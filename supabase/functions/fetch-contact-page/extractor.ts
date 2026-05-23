/**
 * 5-Layer Contact Extraction Pipeline
 * Extracts emails, phones, address, and social links from HTML
 */

interface ContactData {
  source_url: string;
  email: string[];
  phone: string[];
  address: string | null;
  socials: {
    linkedin: string | null;
    twitter: string | null;
    instagram: string | null;
    facebook: string | null;
  };
}

export function extractContacts(html: string, sourceUrl: string): ContactData {
  const emails: Set<string> = new Set();
  const phones: Set<string> = new Set();
  let address: string | null = null;

  // Layer 1: JSON-LD Structured Data
  extractFromJsonLd(html, emails, phones, (addr) => { address = addr; });

  // Layer 2: mailto: and tel: hyperlinks
  extractFromHrefs(html, emails, phones);

  // Layer 3: Email regex scan
  extractEmailsRegex(html, emails);

  // Layer 4: Phone regex scan
  extractPhonesRegex(html, phones);

  // Layer 5: Address tag and social links
  if (!address) {
    address = extractAddressTag(html);
  }
  const socials = extractSocialLinks(html);

  return {
    source_url: sourceUrl,
    email: Array.from(emails),
    phone: Array.from(phones),
    address,
    socials
  };
}

/**
 * Layer 1: Extract from JSON-LD structured data
 */
function extractFromJsonLd(
  html: string, 
  emails: Set<string>, 
  phones: Set<string>,
  setAddress: (addr: string) => void
) {
  const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  
  for (const match of jsonLdMatches) {
    try {
      const data = JSON.parse(match[1]);
      
      // Handle both single objects and arrays
      const items = Array.isArray(data) ? data : [data];
      
      for (const item of items) {
        if (item['@type'] === 'Organization' || item['@type'] === 'LocalBusiness') {
          if (item.email) emails.add(item.email);
          if (item.telephone) phones.add(item.telephone);
          
          if (item.address) {
            if (typeof item.address === 'string') {
              setAddress(item.address);
            } else if (item.address.streetAddress) {
              const parts = [
                item.address.streetAddress,
                item.address.addressLocality,
                item.address.addressRegion,
                item.address.postalCode,
                item.address.addressCountry
              ].filter(Boolean);
              setAddress(parts.join(', '));
            }
          }
        }
      }
    } catch (e) {
      // Invalid JSON, skip
      continue;
    }
  }
}

/**
 * Layer 2: Extract from mailto: and tel: links
 */
function extractFromHrefs(html: string, emails: Set<string>, phones: Set<string>) {
  // mailto: links
  const mailtoMatches = html.matchAll(/href=["']mailto:([^"']+)["']/gi);
  for (const match of mailtoMatches) {
    const email = match[1].split('?')[0]; // Remove query params
    if (isValidEmail(email)) {
      emails.add(email);
    }
  }

  // tel: links
  const telMatches = html.matchAll(/href=["']tel:([^"']+)["']/gi);
  for (const match of telMatches) {
    const phone = match[1].trim();
    if (isValidPhone(phone)) {
      phones.add(phone);
    }
  }
}

/**
 * Layer 3: Email regex scan
 */
function extractEmailsRegex(html: string, emails: Set<string>) {
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const matches = html.match(emailRegex) || [];
  
  for (const email of matches) {
    if (isValidEmail(email)) {
      emails.add(email.toLowerCase());
    }
  }
}

/**
 * Layer 4: Phone regex scan
 */
function extractPhonesRegex(html: string, phones: Set<string>) {
  // Match various phone formats
  const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/g;
  const matches = html.match(phoneRegex) || [];
  
  for (const phone of matches) {
    if (isValidPhone(phone)) {
      phones.add(phone.trim());
    }
  }
}

/**
 * Layer 5: Extract address from <address> tag
 */
function extractAddressTag(html: string): string | null {
  const addressMatch = html.match(/<address[^>]*>([\s\S]*?)<\/address>/i);
  if (addressMatch) {
    // Strip HTML tags and clean up whitespace
    const text = addressMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text || null;
  }
  return null;
}

/**
 * Extract social media links
 */
function extractSocialLinks(html: string) {
  return {
    linkedin: extractSocialUrl(html, /linkedin\.com\/(?:company|in)\/[^\s"'<>]+/i),
    twitter: extractSocialUrl(html, /(?:twitter|x)\.com\/[^\s"'<>]+/i),
    instagram: extractSocialUrl(html, /instagram\.com\/[^\s"'<>]+/i),
    facebook: extractSocialUrl(html, /facebook\.com\/[^\s"'<>]+/i)
  };
}

function extractSocialUrl(html: string, regex: RegExp): string | null {
  const match = html.match(regex);
  if (match) {
    let url = match[0];
    // Ensure it has protocol
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    return url;
  }
  return null;
}

/**
 * Validation helpers
 */
function isValidEmail(email: string): boolean {
  // Filter out common false positives
  const invalidPatterns = [
    /\.(png|jpg|jpeg|gif|svg|css|js)$/i,
    /@example\./i,
    /@test\./i,
    /@localhost/i
  ];
  
  if (invalidPatterns.some(pattern => pattern.test(email))) {
    return false;
  }
  
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // Must contain at least 7 digits
  const digits = phone.match(/\d/g) || [];
  if (digits.length < 7) return false;
  
  // Filter out common false positives (years, zip codes, etc.)
  if (/^(19|20)\d{2}$/.test(phone.replace(/\D/g, ''))) return false;
  
  return true;
}
