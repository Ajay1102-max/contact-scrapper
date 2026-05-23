/**
 * Generate all candidate contact page URLs for a given domain
 * @param {string} domain - The company domain (e.g., 'electroglobal.in')
 * @returns {string[]} Array of 15 candidate URLs
 */
export function generateContactUrls(domain) {
  // Ensure domain has protocol
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  
  const patterns = [
    '/contact',
    '/contact-us',
    '/contact_us',
    '/contactus',
    '/get-in-touch',
    '/reach-us',
    '/reach-out',
    '/connect',
    '/talk-to-us',
    '/support',
    '/about/contact',
    '/company/contact',
    '/info',
    '/enquiry',
    '/enquire'
  ];
  
  return patterns.map(pattern => `${baseUrl}${pattern}`);
}

/**
 * Find the first working URL from a list of candidates
 * @param {string[]} urls - Array of URLs to test
 * @returns {Promise<string>} First working URL or the base domain
 */
export async function findWorkingUrl(urls) {
  // Try all URLs in parallel with HEAD requests
  const probeResults = await Promise.allSettled(
    urls.map(url => 
      fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      })
    )
  );
  
  // Find first URL returning 200
  for (let i = 0; i < probeResults.length; i++) {
    const result = probeResults[i];
    if (result.status === 'fulfilled' && result.value.ok) {
      return urls[i];
    }
  }
  
  // Fallback to homepage
  const baseUrl = new URL(urls[0]).origin;
  return baseUrl;
}
