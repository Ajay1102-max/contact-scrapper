const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY;

const SKIP_DOMAINS = [
  'linkedin.com',
  'facebook.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'youtube.com',
  'wikipedia.org',
  'indiamart.com',
  'justdial.com'
];

/**
 * Search for company's official website using Tavily Search API
 * Returns multiple results to handle companies with same name
 * @param {string} companyName - Company name to search
 * @returns {Promise<Array>} Array of {domain, title, url} objects
 */
export async function searchCompanyDomains(companyName) {
  if (!TAVILY_API_KEY) {
    throw new Error('Missing VITE_TAVILY_API_KEY');
  }

  const query = `${companyName} official website contact`;
  
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TAVILY_API_KEY}`
    },
    body: JSON.stringify({
      query,
      max_results: 5,
      include_domains: [],
      exclude_domains: SKIP_DOMAINS
    })
  });
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Search limit reached. Please try again shortly.');
    }
    throw new Error(`Tavily Search API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    throw new Error('No results found for this company');
  }
  
  // Return multiple results (filter out aggregators)
  const results = [];
  for (const result of data.results) {
    const domain = extractDomain(result.url);
    const isAggregator = SKIP_DOMAINS.some(skip => domain.includes(skip));
    
    if (!isAggregator) {
      results.push({
        domain,
        title: result.title || domain,
        url: result.url
      });
    }
  }
  
  return results.length > 0 ? results : [{
    domain: extractDomain(data.results[0].url),
    title: data.results[0].title,
    url: data.results[0].url
  }];
}

/**
 * Search for single company (backward compatibility)
 */
export async function searchCompanyDomain(companyName) {
  const results = await searchCompanyDomains(companyName);
  return results[0].domain;
}

/**
 * Extract hostname from URL
 * @param {string} url - Full URL
 * @returns {string} Hostname only
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch (error) {
    return url;
  }
}
