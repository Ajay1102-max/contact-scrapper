import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { extractContacts } from './extractor.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new Error('Invalid request: urls array is required');
    }

    // Step 1: Probe all URLs in parallel (HEAD requests)
    console.log(`Probing ${urls.length} candidate URLs...`);
    
    const probeResults = await Promise.allSettled(
      urls.map(url => 
        fetch(url, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
      )
    );

    // Step 2: Find first URL returning 200
    let winnerUrl = null;
    for (let i = 0; i < probeResults.length; i++) {
      const result = probeResults[i];
      if (result.status === 'fulfilled' && result.value.ok) {
        winnerUrl = urls[i];
        console.log(`Found working URL: ${winnerUrl}`);
        break;
      }
    }

    // Fallback to homepage if no contact page found
    if (!winnerUrl) {
      const baseUrl = new URL(urls[0]).origin;
      winnerUrl = baseUrl;
      console.log(`No contact page found, falling back to homepage: ${winnerUrl}`);
    }

    // Step 3: Fetch full HTML
    console.log(`Fetching HTML from: ${winnerUrl}`);
    const response = await fetch(winnerUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${winnerUrl}: ${response.status}`);
    }

    const html = await response.text();
    console.log(`Fetched ${html.length} bytes of HTML`);

    // Step 4: Extract contacts
    const result = extractContacts(html, winnerUrl);
    console.log('Extraction complete:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        source_url: null,
        email: [],
        phone: [],
        address: null,
        socials: {}
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
