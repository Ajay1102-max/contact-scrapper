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
  const socials = extractSocialLinks(content);

  return {
    source_url: url,
    email: emails,
    phone: phones,
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
           !lower.endsWith('.gif') &&
           !lower.includes('noreply') &&
           !lower.includes('no-reply') &&
           !lower.includes('donotreply');
  });
  
  // Remove duplicates (case-insensitive)
  const unique = [...new Set(filtered.map(e => e.toLowerCase()))];
  return unique;
}

/**
 * Extract phone numbers with strict validation
 * Only extracts proper phone numbers, avoiding false positives
 */
function extractPhones(text) {
  const phones = new Set();
  
  // Look for phone number indicators in context
  const phoneContextPattern = /(?:phone|tel|call|mobile|fax|contact|telephone)[\s:]*([+\d\s().-]{10,20})/gi;
  const contextMatches = [...text.matchAll(phoneContextPattern)];
  
  contextMatches.forEach(match => {
    const phone = match[1].trim();
    if (isValidPhoneNumber(phone)) {
      phones.add(normalizePhone(phone));
    }
  });
  
  // Pattern 1: International format with + (most reliable)
  // +1-234-567-8900 or +44 20 7946 0958
  const intlPattern = /\+\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}(?:[\s.-]?\d{1,4})?/g;
  const intlMatches = text.match(intlPattern) || [];
  intlMatches.forEach(phone => {
    if (isValidPhoneNumber(phone)) {
      phones.add(normalizePhone(phone));
    }
  });
  
  // Pattern 2: Standard formats with clear separators
  // (123) 456-7890 or 123-456-7890 or 123.456.7890
  const standardPattern = /\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g;
  const standardMatches = text.match(standardPattern) || [];
  standardMatches.forEach(phone => {
    if (isValidPhoneNumber(phone) && !looksLikeNonPhone(phone)) {
      phones.add(normalizePhone(phone));
    }
  });
  
  return Array.from(phones).filter(phone => phone.length >= 10);
}

/**
 * Validate if string is a proper phone number
 */
function isValidPhoneNumber(str) {
  const digits = str.replace(/\D/g, '');
  
  // Must have 7-15 digits
  if (digits.length < 7 || digits.length > 15) return false;
  
  // Must not be all same digit (111-111-1111)
  if (/^(\d)\1+$/.test(digits)) return false;
  
  // Must not be sequential (123-456-7890)
  if (isSequential(digits)) return false;
  
  // Must have variation in digits
  const uniqueDigits = new Set(digits.split(''));
  if (uniqueDigits.size < 3) return false;
  
  return true;
}

/**
 * Check if digits are sequential
 */
function isSequential(digits) {
  if (digits.length < 7) return false;
  let sequential = 0;
  for (let i = 1; i < digits.length; i++) {
    if (parseInt(digits[i]) === parseInt(digits[i-1]) + 1) {
      sequential++;
      if (sequential >= 5) return true;
    } else {
      sequential = 0;
    }
  }
  return false;
}

/**
 * Check if string looks like something other than a phone
 */
function looksLikeNonPhone(str) {
  // Check for date patterns
  if (/^\d{2,4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(str)) return true;
  
  // Check for coordinates (decimal numbers)
  if (/\d+\.\d+/.test(str) && str.split('.').length > 2) return true;
  
  // Check for IDs or codes (too many digits without separators)
  const digits = str.replace(/\D/g, '');
  if (digits.length > 12) return true;
  
  return false;
}

/**
 * Normalize phone number format
 */
function normalizePhone(phone) {
  // Keep the original format but clean up extra spaces
  return phone.replace(/\s+/g, ' ').trim();
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
    ],
    github: [
      /https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/gi
    ],
    whatsapp: [
      /https?:\/\/(?:www\.)?wa\.me\/\d+/gi,
      /https?:\/\/(?:www\.)?whatsapp\.com\/[a-zA-Z0-9._-]+/gi
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
