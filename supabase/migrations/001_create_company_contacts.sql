-- Create company_contacts table for caching
CREATE TABLE IF NOT EXISTS company_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  source_url TEXT NOT NULL,
  email TEXT[] DEFAULT '{}',
  phone TEXT[] DEFAULT '{}',
  address TEXT,
  socials JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_name, domain)
);

-- Create bulk_searches table for tracking bulk operations
CREATE TABLE IF NOT EXISTS bulk_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_name TEXT NOT NULL DEFAULT 'Bulk Search',
  total_companies INTEGER NOT NULL,
  successful_count INTEGER NOT NULL,
  failed_count INTEGER NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_name ON company_contacts (company_name);
CREATE INDEX IF NOT EXISTS idx_domain ON company_contacts (domain);
CREATE INDEX IF NOT EXISTS idx_fetched_at ON company_contacts (fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulk_searches_created_at ON bulk_searches (created_at DESC);

-- Disable Row Level Security (RLS) for easier access
-- Note: Enable RLS in production for better security
ALTER TABLE company_contacts DISABLE ROW LEVEL SECURITY;

-- Add comment
COMMENT ON TABLE company_contacts IS 'Cached company contact information with 7-day TTL';
