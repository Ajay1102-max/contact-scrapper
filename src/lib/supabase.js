import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Database storage will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Check database for existing company contact data
 * @param {string} companyName - Company name (will be lowercased and trimmed)
 * @param {string} domain - Optional domain to filter by specific company
 * @returns {Promise<Array>} Array of stored data (can be multiple companies with same name)
 */
export async function checkCache(companyName, domain = null) {
  if (!supabase) return [];
  
  const normalizedName = companyName.toLowerCase().trim();
  
  try {
    let query = supabase
      .from('company_contacts')
      .select('*')
      .eq('company_name', normalizedName);
    
    if (domain) {
      query = query.eq('domain', domain);
    }
    
    const { data, error } = await query;
    
    if (error || !data || data.length === 0) return [];
    
    // Filter out old entries (> 7 days old)
    const now = new Date();
    const validData = data.filter(item => {
      const fetchedAt = new Date(item.fetched_at);
      const daysDiff = (now - fetchedAt) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    
    return validData;
  } catch (error) {
    console.error('Database check error:', error);
    return [];
  }
}

/**
 * Save contact data to database
 * @param {string} companyName - Company name
 * @param {string} domain - Resolved domain
 * @param {Object} contactData - Extracted contact information
 * @returns {Promise<Object>} Saved data
 */
export async function saveToCache(companyName, domain, contactData) {
  if (!supabase) return contactData;
  
  const normalizedName = companyName.toLowerCase().trim();
  
  try {
    const { data, error } = await supabase
      .from('company_contacts')
      .upsert({
        company_name: normalizedName,
        domain,
        source_url: contactData.source_url,
        email: contactData.email,
        phone: contactData.phone,
        address: contactData.address,
        socials: contactData.socials,
        fetched_at: new Date().toISOString()
      }, {
        onConflict: 'company_name,domain'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Failed to save to database:', error);
      return contactData;
    }
    
    return data;
  } catch (error) {
    console.error('Database save error:', error);
    return contactData;
  }
}

/**
 * Get search history (last 10 lookups + bulk searches)
 * @returns {Promise<Array>} Array of recent lookups
 */
export async function getSearchHistory() {
  if (!supabase) return [];
  
  try {
    // Get individual searches
    const { data: individualSearches, error: error1 } = await supabase
      .from('company_contacts')
      .select('company_name, domain, fetched_at')
      .order('fetched_at', { ascending: false })
      .limit(10);
    
    // Get bulk searches
    const { data: bulkSearches, error: error2 } = await supabase
      .from('bulk_searches')
      .select('id, search_name, total_companies, successful_count, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error1 && error2) {
      console.error('Failed to fetch history:', error1, error2);
      return [];
    }
    
    // Combine and format
    const history = [];
    
    // Add bulk searches
    if (bulkSearches && bulkSearches.length > 0) {
      bulkSearches.forEach(bulk => {
        history.push({
          type: 'bulk',
          id: bulk.id,
          company_name: bulk.search_name,
          domain: `${bulk.successful_count}/${bulk.total_companies} successful`,
          fetched_at: bulk.created_at
        });
      });
    }
    
    // Add individual searches
    if (individualSearches && individualSearches.length > 0) {
      individualSearches.forEach(item => {
        history.push({
          type: 'single',
          company_name: item.company_name,
          domain: item.domain,
          fetched_at: item.fetched_at
        });
      });
    }
    
    // Sort by date and limit to 10
    return history
      .sort((a, b) => new Date(b.fetched_at) - new Date(a.fetched_at))
      .slice(0, 10);
  } catch (error) {
    console.error('History fetch error:', error);
    return [];
  }
}

/**
 * Save bulk search results
 * @param {Array} results - Array of bulk search results
 * @returns {Promise<Object>} Saved bulk search record
 */
export async function saveBulkSearch(results) {
  if (!supabase) return null;
  
  const successCount = results.filter(r => r.success).length;
  const failedCount = results.length - successCount;
  
  try {
    const { data, error } = await supabase
      .from('bulk_searches')
      .insert({
        search_name: 'Bulk Search',
        total_companies: results.length,
        successful_count: successCount,
        failed_count: failedCount,
        results: results
      })
      .select()
      .single();
    
    if (error) {
      console.error('Failed to save bulk search:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Bulk search save error:', error);
    return null;
  }
}

/**
 * Get bulk search results by ID
 * @param {string} bulkSearchId - UUID of the bulk search
 * @returns {Promise<Object|null>} Bulk search record with results
 */
export async function getBulkSearchResults(bulkSearchId) {
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('bulk_searches')
      .select('*')
      .eq('id', bulkSearchId)
      .single();
    
    if (error || !data) {
      console.error('Failed to fetch bulk search:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Bulk search fetch error:', error);
    return null;
  }
}
