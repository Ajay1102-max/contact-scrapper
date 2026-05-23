const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY;

/**
 * Extract contact information from a URL using Tavily Extract API
 * @param {string} url - The URL to extract from
 * @returns {Promise<Object>} Extracted contact data
 */
export async function extractContactsFromUrl(url) {
  if (!TAVILY_API_KEY) {
    throw new Error('Missing VITE_TAVILY_API_KEY');
  }

  // Use Tavily Extract API with advanced depth for better extraction
  const response = await fetch('https://api.tavily.com/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TAVILY_API_KEY}`
    },
    body: JSON.stringify({
      urls: [url],
      extract_depth: 'advanced', // Better extraction with tables and embedded content
      format: 'markdown',
      include_images: false,
      include_favicon: false
    })
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API rate limit reached. Please try again shortly.');
    }
    throw new Error(`Tavily Extract API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('No content extracted from URL');
  }

  const content = data.results[0].raw_content;

  // Extract contact information using improved patterns
  const emails = extractEmails(content);
  const phones = extractPhones(content);
  const address = extractAddress(content);
  const socials = extractSocialLinks(content);

  return {
    source_url: url,
    email: emails,
    phone: phones,
    address: address,
    socials: socials
  };
}

/**
 * Extract email addresses with improved pattern
 */
function extractEmails(text) {
  // More comprehensive email pattern
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailPattern) || [];
  
  // Filter out common false positives
  const filtered = matches.filter(email => {
    const lower = email.toLowerCase();
    return !lower.includes('example.com') &&
           !lower.includes('test.com') &&
           !lower.includes('domain.com') &&
           !lower.includes('yourcompany.com') &&
           !lower.includes('yourdomain.com') &&
           !lower.includes('@sentry') &&
           !lower.includes('@placeholder') &&
           !lower.endsWith('.png') &&
           !lower.endsWith('.jpg') &&
           !lower.endsWith('.gif');
  });
  
  // Remove duplicates (case-insensitive)
  const unique = [...new Set(filtered.map(e => e.toLowerCase()))];
  return unique;
}

/**
 * Extract phone numbers with improved validation
 */
function extractPhones(text) {
  const phones = new Set();
  
  // Pattern 1: International format with + and country code
  const intlPattern = /\+\d{1,3}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,4}/g;
  const intlMatches = text.match(intlPattern) || [];
  intlMatches.forEach(phone => {
    const cleaned = phone.replace(/\s+/g, ' ').trim();
    if (cleaned.length >= 10) phones.add(cleaned);
  });
  
  // Pattern 2: US/Canada format (XXX) XXX-XXXX or XXX-XXX-XXXX
  const usPattern = /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
  const usMatches = text.match(usPattern) || [];
  usMatches.forEach(phone => {
    const cleaned = phone.replace(/\s+/g, ' ').trim();
    // Validate it's not a coordinate or date
    if (!isCoordinate(cleaned) && !isDate(cleaned) && hasVariedDigits(cleaned)) {
      phones.add(cleaned);
    }
  });
  
  // Pattern 3: International without + (country code followed by number)
  const intlNoPlus = /\b\d{1,3}[\s.-]\d{2,4}[\s.-]\d{2,4}[\s.-]\d{2,4}\b/g;
  const intlNoPlusMatches = text.match(intlNoPlus) || [];
  intlNoPlusMatches.forEach(phone => {
    const cleaned = phone.replace(/\s+/g, ' ').trim();
    if (!isCoordinate(cleaned) && !isDate(cleaned) && hasVariedDigits(cleaned) && cleaned.length >= 10) {
      phones.add(cleaned);
    }
  });
  
  return Array.from(phones);
}

/**
 * Check if string is a coordinate (latitude/longitude)
 */
function isCoordinate(str) {
  // Coordinates have decimal points and are typically in pairs
  const coordPattern = /^\d+\.\d+$/;
  return coordPattern.test(str.replace(/[\s.-]/g, ''));
}

/**
 * Check if string looks like a date
 */
function isDate(str) {
  // Common date patterns
  const datePatterns = [
    /^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/,  // MM/DD/YYYY or DD-MM-YYYY
    /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/,    // YYYY-MM-DD
  ];
  return datePatterns.some(pattern => pattern.test(str));
}

/**
 * Check if phone number has varied digits (not all same)
 */
function hasVariedDigits(str) {
  const digits = str.replace(/\D/g, '');
  if (digits.length < 7) return false;
  
  // Check if all digits are the same (like 111-111-1111)
  const firstDigit = digits[0];
  return !digits.split('').every(d => d === firstDigit);
}

/**
 * Extract physical address with improved pattern
 */
function extractAddress(text) {
  // Look for common address patterns
  const addressPatterns = [
    // Pattern 1: Street number + street name + city + state + zip
    /\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Circle|Cir|Place|Pl)[,\s]+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*[,\s]+[A-Z]{2}\s+\d{5}(?:-\d{4})?/gi,
    
    // Pattern 2: PO Box
    /P\.?O\.?\s+Box\s+\d+[,\s]+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*[,\s]+[A-Z]{2}\s+\d{5}(?:-\d{4})?/gi,
    
    // Pattern 3: International format (number, street, city, country)
    /\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*[,\s]+\d{5,6}\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/gi
  ];

  for (const pattern of addressPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Return the first valid address found
      return matches[0].trim();
    }
  }

  // Fallback: Look for "Address:" label
  const addressLabel = /(?:Address|Location|Office):\s*([^\n]{20,150})/i;
  const labelMatch = text.match(addressLabel);
  if (labelMatch) {
    return labelMatch[1].trim();
  }

  return null;
}

/**
 * Extract social media links with improved patterns
 */
function extractSocialLinks(text) {
  const socials = {};

  // Comprehensive social media patterns
  const patterns = {
    facebook: [
      /https?:\/\/(?:www\.)?facebook\.com\/[a-zA-Z0-9._-]+/gi,
      /https?:\/\/(?:www\.)?fb\.com\/[a-zA-Z0-9._-]+/gi,
      /https?:\/\/(?:www\.)?fb\.me\/[a-zA-Z0-9._-]+/gi
    ],
    twitter: [
      /https?:\/\/(?:www\.)?twitter\.com\/[a-zA-Z0-9_]+/gi,
      /https?:\/\/(?:www\.)?x\.com\/[a-zA-Z0-9_]+/gi
    ],
    linkedin: [
      /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[a-zA-Z0-9_-]+/gi
    ],
    instagram: [
      /https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9._]+/gi
    ],
    youtube: [
      /https?:\/\/(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/|@)[a-zA-Z0-9_-]+/gi,
      /https?:\/\/(?:www\.)?youtu\.be\/[a-zA-Z0-9_-]+/gi
    ],
    tiktok: [
      /https?:\/\/(?:www\.)?tiktok\.com\/@[a-zA-Z0-9._]+/gi
    ],
    pinterest: [
      /https?:\/\/(?:www\.)?pinterest\.com\/[a-zA-Z0-9_]+/gi
    ]
  };

  for (const [platform, platformPatterns] of Object.entries(patterns)) {
    for (const pattern of platformPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        // Get the first match and ensure it has https://
        let url = matches[0];
        if (!url.startsWith('http')) {
          url = 'https://' + url;
        }
        socials[platform] = url;
        break; // Only take first match per platform
      }
    }
  }

  return socials;
}
