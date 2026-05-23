# Contact Extractor 🔍

> Full-featured contact extractor with company search, caching, and history.

[![Status](https://img.shields.io/badge/status-ready-brightgreen)]()
[![Version](https://img.shields.io/badge/version-2.0-blue)]()

## 🎯 What It Does

**Input:** Company name OR contact page URL  
**Output:** Emails, phones, address, social links  
**Time:** 5-8 seconds (first time) | < 100ms (cached)  
**Cost:** Free for 500 companies/month

```
Enter "Tesla" → Get:
✉️  press@tesla.com
📞  +1 650 681 5000
📍  3500 Deer Creek Road, Palo Alto, CA
🔗  LinkedIn, Twitter, Instagram
⚡ Cached for instant repeat lookups
```

## ✨ Features

- 🔍 **Company Name Search** - Enter "Tesla" instead of full URL
- 🎯 **Auto URL Discovery** - Tests 15 contact page patterns
- 📧 **Smart Extraction** - Emails, phones, address, socials
- ⚡ **7-Day Caching** - Instant repeat lookups via Supabase
- 📊 **Search History** - Last 10 searches displayed
- 🔄 **Dual Mode** - Works with company names OR direct URLs
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark Mode** - Automatic dark mode support

## 🚀 Quick Start

**Get running in 5 minutes!**

### 1. Install Dependencies
```bash
npm install
```

### 2. Get API Keys

**Tavily API (Required):**
- Go to https://www.tavily.com/
- Sign up (free tier: 1,000 requests/month)
- Copy your API key

**Supabase (Required for caching):**
- Go to https://supabase.com
- Create new project
- Run SQL migration (see [SUPABASE_SIMPLE_SETUP.md](./SUPABASE_SIMPLE_SETUP.md))
- Copy Project URL and anon key

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your keys
```

Your `.env` should look like:
```env
VITE_TAVILY_API_KEY=tvly-xxxxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run!
```bash
npm run dev
```

Open http://localhost:3000 and search for "Tesla"!

## 📚 Documentation

- **[SUPABASE_SIMPLE_SETUP.md](./SUPABASE_SIMPLE_SETUP.md)** - Easy Supabase setup (no RLS issues!)
- **[PHASE2_SETUP.md](./PHASE2_SETUP.md)** - Detailed setup guide
- **[PHASE2_COMPLETE.md](./PHASE2_COMPLETE.md)** - Complete feature list
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Recent improvements
- **[TEST_GUIDE.md](./TEST_GUIDE.md)** - Testing guide

## 🏗️ How It Works

### Company Name Search
```
"Tesla"
  ↓
1. Check cache → Miss
2. Tavily Search → Find tesla.com
3. Generate 15 URLs → Test in parallel
4. Find working URL → https://tesla.com/contact
5. Tavily Extract → Get page content
6. Extract contacts → Parse data
7. Save to Supabase → Cache for 7 days
8. Display results

Time: ~5-8 seconds | Cost: ~$0.01
```

### Cached Lookup
```
"Tesla" (searched before)
  ↓
1. Check cache → Hit!
2. Display results

Time: < 100ms | Cost: $0
```

### Direct URL
```
"https://tesla.com/contact"
  ↓
1. Detect URL
2. Tavily Extract → Get content
3. Extract contacts
4. Display results

Time: ~2-3 seconds | Cost: ~$0.005
```

## 💰 Cost Breakdown

| Scenario | Tavily | Supabase | Total |
|----------|--------|----------|-------|
| **First lookup** | $0.01 | $0 | **$0.01** |
| **Cached lookup** | $0 | $0 | **$0** |
| **100 companies/month** | $1 | $0 | **$1** |
| **500 companies/month** | $5 | $0 | **$5** |

**Free tier limits:**
- Tavily: 1,000 requests/month = 500 companies
- Supabase: 500MB database = ~10,000 cached companies

## 🧪 Test It

### Company Names
```
Tesla
Microsoft
Apple
Electroglobal
```

### Direct URLs
```
https://www.tesla.com/contact
https://www.microsoft.com/en-us/contact
https://electroglobal.in/contact
```

## 📁 Project Structure

```
contact-extractor/
├── src/
│   ├── components/
│   │   ├── SearchInput.jsx       # Dual-mode input
│   │   ├── ExtractionStatus.jsx  # Progress indicator
│   │   ├── ContactDashboard.jsx  # Results display
│   │   └── SearchHistory.jsx     # Recent searches
│   ├── lib/
│   │   ├── extractor.js          # Tavily Extract + parsing
│   │   ├── tavilySearch.js       # Company search
│   │   ├── urlPatterns.js        # URL generation
│   │   └── supabase.js           # Caching + history
│   └── App.jsx                   # Main orchestrator
├── supabase/
│   └── migrations/
│       └── 001_create_company_contacts.sql
└── .env                          # Your API keys
```

## 🔧 Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **APIs:** Tavily Search + Tavily Extract
- **Database:** Supabase Postgres
- **Caching:** 7-day TTL in Supabase

## 🐛 Troubleshooting

**"Missing VITE_TAVILY_API_KEY"**
- Check `.env` file exists
- Restart dev server

**"Failed to save to cache"**
- Verify Supabase keys are correct
- Check SQL migration ran successfully
- See [SUPABASE_SIMPLE_SETUP.md](./SUPABASE_SIMPLE_SETUP.md)

**"No results found"**
- Try more specific company name
- Try direct URL instead
- Check Tavily API quota

## 🔒 Security Note

**RLS (Row Level Security) is disabled by default** to avoid authentication issues during development. This is fine for testing but should be enabled in production.

To enable RLS for production:
```sql
ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;
-- Add appropriate policies
```

## 📄 License

MIT

---

**Built with:** React • Vite • Tailwind • Tavily API • Supabase  
**Version:** 2.0 | **Status:** ✅ Ready to Use  
**Setup Time:** 5 minutes

[![Status](https://img.shields.io/badge/status-ready-brightgreen)]()
[![Version](https://img.shields.io/badge/version-1.0-blue)]()

## 🎯 What It Does

**Input:** Contact page URL (e.g., "https://example.com/contact")  
**Output:** Emails, phones, address, social links  
**Time:** 2-3 seconds  
**Cost:** Free (1,000 requests/month with Tavily)

```
Enter URL: https://example.com/contact
           ↓
Get:  ✉️  contact@example.com
      📞  +1 234 567 8900
      📍  123 Main St, City, State
      🔗  LinkedIn, Twitter, Instagram
```

## ✨ Features

- 🔗 **Direct URL Input** - Paste any contact page URL
- 📧 **Email Extraction** - Finds all email addresses
- 📞 **Phone Extraction** - Detects phone numbers in any format
- 📍 **Address Detection** - Extracts physical addresses
- 🔗 **Social Links** - Finds LinkedIn, Twitter, Instagram, Facebook
- 🎨 **Clean Dashboard** - Beautiful results display
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark Mode** - Automatic dark mode support

## 🚀 Quick Start

**Get running in 3 minutes!** See [SIMPLE_SETUP.md](./SIMPLE_SETUP.md)

```bash
# 1. Install
npm install

# 2. Get Tavily API key from https://www.tavily.com/

# 3. Configure
cp .env.example .env
# Edit .env with your Tavily API key

# 4. Run!
npm run dev
```

## 🏗️ Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **API:** Tavily Extract API
- **Extraction:** Regex pattern matching

## 📊 How It Works

```
User enters URL
  ↓
Tavily API fetches page content
  ↓
Extract contacts using regex:
  • Emails: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/
  • Phones: /(\+?\d[\d\s\-().]{7,}\d)/
  • Address: Pattern matching
  • Socials: Domain matching
  ↓
Display in dashboard
```

## 💰 Cost

- **Free tier:** 1,000 extractions/month
- **Per extraction:** $0 (within free tier)
- **Paid plans:** Available at https://www.tavily.com/pricing

## 📁 Project Structure

```
contact-extractor/
├── src/
│   ├── components/
│   │   ├── UrlInput.jsx          # URL input form
│   │   ├── ExtractionStatus.jsx  # Loading state
│   │   └── ContactDashboard.jsx  # Results display
│   ├── lib/
│   │   └── extractor.js          # Tavily API + extraction
│   ├── App.jsx                   # Main app
│   └── main.jsx                  # Entry point
├── .env                          # Your API key (create this)
├── .env.example                  # Template
├── package.json
└── SIMPLE_SETUP.md               # Setup guide
```

## 🧪 Example URLs to Try

- https://www.tesla.com/contact
- https://www.microsoft.com/en-us/contact
- https://www.apple.com/contact/
- Any company's contact page!

## 🔮 Roadmap (Phase 2)

- [ ] Enter company name → auto-find contact page
- [ ] Cache results in database
- [ ] Search history
- [ ] Bulk URL processing
- [ ] Export to CSV/JSON
- [ ] Browser extension

## 📚 Documentation

- **[SIMPLE_SETUP.md](./SIMPLE_SETUP.md)** - 3-minute setup guide
- **[README.md](./README.md)** - This file

## 🐛 Troubleshooting

**"Missing VITE_TAVILY_API_KEY"**
- Check `.env` file exists
- Restart dev server

**"Tavily API error"**
- Verify API key is correct
- Check free tier limit (1,000/month)

**"No content extracted"**
- Try a different URL
- Some sites may block scraping

## 📄 License

MIT

---

**Built with:** React • Vite • Tailwind • Tavily API  
**Version:** 1.0 | **Status:** ✅ Ready to Use
