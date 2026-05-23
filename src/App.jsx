import React, { useState, useEffect } from 'react';
import SearchInput from './components/SearchInput';
import ExtractionStatus from './components/ExtractionStatus';
import ContactDashboard from './components/ContactDashboard';
import SearchHistory from './components/SearchHistory';
import CompanySelector from './components/CompanySelector';
import MultipleResultsPage from './components/MultipleResultsPage';
import BulkProgress from './components/BulkProgress';
import BulkResultsPage from './components/BulkResultsPage';
import Sidebar from './components/Sidebar';
import { extractContactsFromUrl } from './lib/extractor';
import { searchCompanyDomains } from './lib/tavilySearch';
import { generateContactUrls, findWorkingUrl } from './lib/urlPatterns';
import { checkCache, saveToCache, getSearchHistory, saveBulkSearch, getBulkSearchResults } from './lib/supabase';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFromDatabase, setIsFromDatabase] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Multiple company selection state
  const [companyOptions, setCompanyOptions] = useState([]);
  const [showCompanySelector, setShowCompanySelector] = useState(false);
  
  // Multiple results page state - now shows all extracted results
  const [multipleResults, setMultipleResults] = useState([]);
  const [showMultipleResults, setShowMultipleResults] = useState(false);
  
  // Bulk upload state
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ total: 0, completed: 0, current: '' });
  const [bulkResults, setBulkResults] = useState([]);
  
  // Bulk results page state
  const [showBulkResults, setShowBulkResults] = useState(false);
  const [bulkResultsData, setBulkResultsData] = useState([]);
  
  // Sidebar and view state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('single'); // 'single' or 'bulk'

  // Load search history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getSearchHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleSearch = async (query, isUrl = false) => {
    setIsLoading(true);
    setError(null);
    setContactData(null);
    setIsFromDatabase(false);
    setSearchQuery(query);
    setShowCompanySelector(false);
    setShowMultipleResults(false);
    setMultipleResults([]);
    setSidebarOpen(false);

    try {
      if (isUrl) {
        // Direct URL extraction - find contact page and extract
        setCurrentStep('Extracting contact information...');
        
        // Extract the domain from the URL for database lookup
        let domain;
        try {
          const urlObj = new URL(query.startsWith('http') ? query : `https://${query}`);
          domain = urlObj.hostname.replace(/^www\./, '');
        } catch (e) {
          domain = query.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        }
        
        // Check database first
        const dbResults = await checkCache('', domain);
        if (dbResults.length > 0) {
          setContactData(dbResults[0]);
          setIsFromDatabase(true);
          await loadHistory();
          setIsLoading(false);
          return;
        }
        
        // If not in database, find contact page and extract
        setCurrentStep('Finding contact page...');
        const candidateUrls = generateContactUrls(domain);
        
        // Try to find working contact page
        let workingUrl;
        try {
          workingUrl = await findWorkingUrl(candidateUrls);
        } catch (err) {
          // If no contact page found, try the provided URL directly
          console.log('No contact page found, trying provided URL:', query);
          workingUrl = query.startsWith('http') ? query : `https://${query}`;
        }
        
        setCurrentStep('Extracting contact information...');
        const data = await extractContactsFromUrl(workingUrl);
        
        // Save to database with domain as company name
        const savedData = await saveToCache(domain, domain, data);
        setContactData(savedData);
        await loadHistory();
        setIsLoading(false);
        return;
      }
      
      // Company name search - Extract all matching results
      
      // Step 1: Check database
      setCurrentStep('Checking database...');
      const dbResults = await checkCache(query);
      
      if (dbResults.length === 1) {
        // Single database result - show directly
        setContactData(dbResults[0]);
        setIsFromDatabase(true);
        await loadHistory();
        setIsLoading(false);
        return;
      } else if (dbResults.length > 1) {
        // Multiple database results - show all with their data
        setMultipleResults(dbResults.map(item => ({
          domain: item.domain,
          title: `${query} (${item.domain})`,
          fromDatabase: true,
          contactData: item,
          snippet: ''
        })));
        setShowMultipleResults(true);
        setIsLoading(false);
        return;
      }

      // Step 2: Search for domains (can return multiple)
      setCurrentStep(`Searching for ${query}'s website...`);
      const companies = await searchCompanyDomains(query);

      if (companies.length === 0) {
        throw new Error('No results found for this company');
      }

      if (companies.length === 1) {
        // Single result - extract and show directly
        await processCompany(query, companies[0]);
      } else {
        // Multiple results - extract contact info for ALL of them
        setCurrentStep('Extracting contact information from all matches...');
        const extractedResults = [];
        
        for (let i = 0; i < companies.length; i++) {
          const company = companies[i];
          try {
            setCurrentStep(`Extracting from ${company.domain} (${i + 1}/${companies.length})...`);
            
            // Generate candidate URLs
            const candidateUrls = generateContactUrls(company.domain);
            
            // Find working URL
            const workingUrl = await findWorkingUrl(candidateUrls);
            
            // Extract contacts
            const data = await extractContactsFromUrl(workingUrl);
            
            // Save to database
            await saveToCache(query, company.domain, data);
            
            extractedResults.push({
              domain: company.domain,
              title: company.title,
              fromDatabase: false,
              contactData: data,
              snippet: company.snippet
            });
          } catch (err) {
            console.error(`Failed to extract from ${company.domain}:`, err);
            // Still add to results but mark as failed
            extractedResults.push({
              domain: company.domain,
              title: company.title,
              fromDatabase: false,
              contactData: null,
              error: err.message,
              snippet: company.snippet
            });
          }
        }
        
        setMultipleResults(extractedResults);
        setShowMultipleResults(true);
        await loadHistory();
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred while searching');
      setCurrentStep('');
    } finally {
      setIsLoading(false);
    }
  };

  const processCompany = async (companyName, company) => {
    try {
      setIsLoading(true);
      setShowCompanySelector(false);
      setShowMultipleResults(false);
      
      // If database data is available
      if (company.fromDatabase && company.data) {
        setContactData(company.data);
        setIsFromDatabase(true);
        await loadHistory();
        setIsLoading(false);
        return;
      }

      // Step 3: Generate candidate URLs
      setCurrentStep('Generating contact page URLs...');
      const candidateUrls = generateContactUrls(company.domain);

      // Step 4: Find working URL
      setCurrentStep('Finding contact page...');
      const workingUrl = await findWorkingUrl(candidateUrls);

      // Step 5: Extract contacts
      setCurrentStep('Extracting contact information...');
      const data = await extractContactsFromUrl(workingUrl);

      // Step 6: Save to database
      setCurrentStep('Saving to database...');
      const savedData = await saveToCache(companyName, company.domain, data);

      setContactData(savedData);
      await loadHistory();
    } catch (err) {
      console.error('Process company error:', err);
      setError(err.message || 'An error occurred while processing company');
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  };

  const handleMultipleResultSelect = async (result) => {
    await processCompany(searchQuery, result);
  };

  const handleCompanySelect = async (company) => {
    await processCompany(searchQuery, company);
  };

  const handleBulkUpload = async (companyNames) => {
    if (companyNames.length === 0) {
      setError('No company names found in file');
      return;
    }

    setIsBulkProcessing(true);
    setError(null);
    setContactData(null);
    setShowCompanySelector(false);
    setShowMultipleResults(false);
    setShowBulkResults(false);
    setBulkProgress({ total: companyNames.length, completed: 0, current: '' });
    setBulkResults([]);

    const results = [];

    for (let i = 0; i < companyNames.length; i++) {
      const companyName = companyNames[i];
      setBulkProgress({ total: companyNames.length, completed: i, current: companyName });

      try {
        // Check database first
        const dbResults = await checkCache(companyName);
        if (dbResults.length > 0) {
          const dbData = dbResults[0];
          results.push({
            company: companyName,
            domain: dbData.domain,
            source_url: dbData.source_url,
            email: dbData.email || [],
            phone: dbData.phone || [],
            socials: dbData.socials || {},
            success: true,
            fromDatabase: true
          });
          setBulkResults([...results]);
          continue;
        }

        // Search for company
        const companies = await searchCompanyDomains(companyName);
        
        if (companies.length === 0) {
          results.push({
            company: companyName,
            success: false,
            error: 'No results found'
          });
          setBulkResults([...results]);
          continue;
        }

        // Use first result for bulk processing
        const company = companies[0];
        
        // Generate and test URLs
        const candidateUrls = generateContactUrls(company.domain);
        const workingUrl = await findWorkingUrl(candidateUrls);
        
        // Extract contacts
        const data = await extractContactsFromUrl(workingUrl);
        
        // Save to database
        await saveToCache(companyName, company.domain, data);

        results.push({
          company: companyName,
          domain: company.domain,
          source_url: data.source_url,
          email: data.email || [],
          phone: data.phone || [],
          socials: data.socials || {},
          success: true,
          fromDatabase: false
        });
        setBulkResults([...results]);

      } catch (err) {
        console.error(`Error processing ${companyName}:`, err);
        results.push({
          company: companyName,
          success: false,
          error: err.message || 'Failed to extract'
        });
        setBulkResults([...results]);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setBulkProgress({ total: companyNames.length, completed: companyNames.length, current: '' });
    setIsBulkProcessing(false);
    
    // Save bulk search to database
    await saveBulkSearch(results);
    await loadHistory();
    
    // Show results page
    setBulkResultsData(results);
    setShowBulkResults(true);
  };

  const handleHistoryClick = async (item) => {
    if (item.type === 'bulk') {
      // Load bulk search results
      const bulkData = await getBulkSearchResults(item.id);
      if (bulkData && bulkData.results) {
        setBulkResultsData(bulkData.results);
        setShowBulkResults(true);
      }
    } else {
      // Regular single search
      handleSearch(item.company_name, false);
    }
  };

  const handleBackToDashboard = () => {
    setShowBulkResults(false);
    setBulkResultsData([]);
  };

  const handleNewSearch = () => {
    setContactData(null);
    setError(null);
    setSearchQuery('');
    setShowMultipleResults(false);
    setShowBulkResults(false);
    setMultipleResults([]);
    setActiveView('single');
  };

  const handleBulkSearchView = () => {
    setContactData(null);
    setError(null);
    setSearchQuery('');
    setShowMultipleResults(false);
    setShowBulkResults(false);
    setMultipleResults([]);
    setActiveView('bulk');
  };

  return (
    <>
      {showBulkResults ? (
        <BulkResultsPage 
          results={bulkResultsData}
          onBack={handleBackToDashboard}
        />
      ) : (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Sidebar */}
          <Sidebar
            onNewSearch={handleNewSearch}
            onBulkSearch={handleBulkSearchView}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            activeView={activeView}
          />

          {/* Main Content */}
          <main className="flex-1 py-8 px-4 md:px-8 md:py-12">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              {!showMultipleResults && !contactData && (
                <header className="text-center mb-12 mt-12 md:mt-0">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {activeView === 'bulk' ? 'Bulk Contact Extraction' : 'Contact Finder'}
                  </h1>
                  <p className="text-base md:text-lg text-gray-600">
                    {activeView === 'bulk' 
                      ? 'Upload a file with multiple company names' 
                      : 'Search by company name or extract from a specific URL'}
                  </p>
                </header>
              )}

              {/* Search Input */}
              {!showMultipleResults && !contactData && (
                <SearchInput 
                  onSearch={handleSearch} 
                  onBulkUpload={handleBulkUpload}
                  isLoading={isLoading || isBulkProcessing}
                  showBulkOnly={activeView === 'bulk'}
                />
              )}

              {/* Error Message */}
              {error && (
                <div className="w-full max-w-2xl mx-auto mt-6">
                  <div className="bg-white border-2 border-red-400 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Multiple Results Page */}
              {showMultipleResults && (
                <MultipleResultsPage
                  results={multipleResults}
                  searchQuery={searchQuery}
                  onBack={() => {
                    setShowMultipleResults(false);
                    setMultipleResults([]);
                    setContactData(null);
                  }}
                />
              )}

              {/* Company Selector */}
              {showCompanySelector && (
                <CompanySelector 
                  companies={companyOptions}
                  onSelect={handleCompanySelect}
                  onCancel={() => {
                    setShowCompanySelector(false);
                    setCompanyOptions([]);
                  }}
                />
              )}

              {/* Bulk Progress */}
              {isBulkProcessing && (
                <BulkProgress 
                  total={bulkProgress.total}
                  completed={bulkProgress.completed}
                  current={bulkProgress.current}
                  results={bulkResults}
                />
              )}

              {/* Extraction Status */}
              {isLoading && <ExtractionStatus step={currentStep} query={searchQuery} />}

              {/* Contact Dashboard */}
              {contactData && (
                <div>
                  <button
                    onClick={handleNewSearch}
                    className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Search
                  </button>
                  <ContactDashboard data={contactData} isFromDatabase={isFromDatabase} />
                </div>
              )}

              {/* Search History */}
              {!isLoading && !isBulkProcessing && !contactData && !showCompanySelector && !showMultipleResults && history.length > 0 && (
                <SearchHistory history={history} onSelectCompany={handleHistoryClick} />
              )}

              {/* Instructions */}
              {!isLoading && !isBulkProcessing && !contactData && !showCompanySelector && !showMultipleResults && !error && history.length === 0 && (
                <div className="w-full max-w-2xl mx-auto mt-12">
                  <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-black rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        How to use
                      </h3>
                    </div>
                    <ol className="space-y-4 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                        <div>
                          <p className="font-semibold text-gray-900">Enter company name or URL</p>
                          <p className="text-sm text-gray-600 mt-1">Search for "Tesla" or paste a contact page URL</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                        <div>
                          <p className="font-semibold text-gray-900">Automatic extraction</p>
                          <p className="text-sm text-gray-600 mt-1">We'll find and extract contact information from all matching websites</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                        <div>
                          <p className="font-semibold text-gray-900">Get results</p>
                          <p className="text-sm text-gray-600 mt-1">View emails, phone numbers, and social media links</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default App;
