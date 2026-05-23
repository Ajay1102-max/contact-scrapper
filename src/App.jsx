import React, { useState, useEffect } from 'react';
import SearchInput from './components/SearchInput';
import ExtractionStatus from './components/ExtractionStatus';
import ContactDashboard from './components/ContactDashboard';
import SearchHistory from './components/SearchHistory';
import CompanySelector from './components/CompanySelector';
import BulkProgress from './components/BulkProgress';
import BulkResultsPage from './components/BulkResultsPage';
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
  const [isCached, setIsCached] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Multiple company selection state
  const [companyOptions, setCompanyOptions] = useState([]);
  const [showCompanySelector, setShowCompanySelector] = useState(false);
  
  // Bulk upload state
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ total: 0, completed: 0, current: '' });
  const [bulkResults, setBulkResults] = useState([]);
  
  // Bulk results page state
  const [showBulkResults, setShowBulkResults] = useState(false);
  const [bulkResultsData, setBulkResultsData] = useState([]);

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
    setIsCached(false);
    setSearchQuery(query);
    setShowCompanySelector(false);

    try {
      if (isUrl) {
        // Direct URL extraction (Phase 1 mode)
        setCurrentStep('Fetching page content...');
        const data = await extractContactsFromUrl(query);
        setContactData(data);
      } else {
        // Company name search (Phase 2 mode)
        
        // Step 1: Check cache
        setCurrentStep('Checking cache...');
        const cachedResults = await checkCache(query);
        if (cachedResults.length > 0) {
          if (cachedResults.length === 1) {
            setContactData(cachedResults[0]);
            setIsCached(true);
            await loadHistory();
            return;
          } else {
            // Multiple cached results - show selector
            setCompanyOptions(cachedResults.map(item => ({
              domain: item.domain,
              title: `${query} (${item.domain})`,
              cached: true,
              data: item
            })));
            setShowCompanySelector(true);
            setIsLoading(false);
            return;
          }
        }

        // Step 2: Search for domains (can return multiple)
        setCurrentStep(`Searching for ${query}'s website...`);
        const companies = await searchCompanyDomains(query);

        if (companies.length === 1) {
          // Single result - proceed directly
          await processCompany(query, companies[0]);
        } else {
          // Multiple results - show selector
          setCompanyOptions(companies);
          setShowCompanySelector(true);
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred while searching');
      setIsLoading(false);
      setCurrentStep('');
    }
  };

  const processCompany = async (companyName, company) => {
    try {
      setIsLoading(true);
      setShowCompanySelector(false);
      
      // If cached data is available
      if (company.cached && company.data) {
        setContactData(company.data);
        setIsCached(true);
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

      // Step 6: Save to cache
      setCurrentStep('Saving to cache...');
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
    setShowBulkResults(false);
    setBulkProgress({ total: companyNames.length, completed: 0, current: '' });
    setBulkResults([]);

    const results = [];

    for (let i = 0; i < companyNames.length; i++) {
      const companyName = companyNames[i];
      setBulkProgress({ total: companyNames.length, completed: i, current: companyName });

      try {
        // Check cache first
        const cachedResults = await checkCache(companyName);
        if (cachedResults.length > 0) {
          const cached = cachedResults[0];
          results.push({
            company: companyName,
            domain: cached.domain,
            source_url: cached.source_url,
            email: cached.email || [],
            phone: cached.phone || [],
            address: cached.address || '',
            socials: cached.socials || {},
            success: true,
            cached: true
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
        
        // Save to cache
        await saveToCache(companyName, company.domain, data);

        results.push({
          company: companyName,
          domain: company.domain,
          source_url: data.source_url,
          email: data.email || [],
          phone: data.phone || [],
          address: data.address || '',
          socials: data.socials || {},
          success: true,
          cached: false
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

  return (
    <>
      {showBulkResults ? (
        <BulkResultsPage 
          results={bulkResultsData}
          onBack={handleBackToDashboard}
        />
      ) : (
        <div className="min-h-screen bg-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Contact Extractor
          </h1>
          <p className="text-lg text-gray-600">
            Enter a company name or contact page URL
          </p>
        </header>

        {/* Search Input */}
        <SearchInput 
          onSearch={handleSearch} 
          onBulkUpload={handleBulkUpload}
          isLoading={isLoading || isBulkProcessing} 
        />

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mt-6">
            <div className="bg-white border-2 border-gray-400 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-800">{error}</p>
              </div>
            </div>
          </div>
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
        {contactData && <ContactDashboard data={contactData} isCached={isCached} />}

        {/* Search History */}
        {!isLoading && !isBulkProcessing && !contactData && !showCompanySelector && history.length > 0 && (
          <SearchHistory history={history} onSelectCompany={handleHistoryClick} />
        )}

        {/* Instructions */}
        {!isLoading && !isBulkProcessing && !contactData && !showCompanySelector && !error && history.length === 0 && (
          <div className="w-full max-w-2xl mx-auto mt-12">
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How to use:
              </h3>
              <ol className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-900">1.</span>
                  <span>Enter a company name (e.g., "Tesla") OR a contact page URL</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-900">2.</span>
                  <span>Click "Search"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-900">3.</span>
                  <span>View extracted emails, phones, address, and social links</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
      )}
    </>
  );
}

export default App;
