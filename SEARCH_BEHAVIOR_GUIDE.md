# Search Behavior Guide

## 🔍 How the Search Works

### Scenario 1: Company Name Search
**What you enter**: `Tesla` or `Microsoft` or `Apple`

**What happens**:
1. ✅ System searches for ALL websites matching that company name
2. ✅ Finds multiple domains (e.g., tesla.com, tesla.co.uk, teslamotors.com)
3. ✅ Automatically extracts contact info from ALL matching websites
4. ✅ Shows all results on one page with their respective contact information

**Example Output**:
```
Found 3 Results for "Tesla"

┌─────────────────────────────────────┐
│ Tesla, Inc. (tesla.com)             │
│ ✉️  info@tesla.com                  │
│ ✉️  support@tesla.com               │
│ 📞 +1-888-518-3752                  │
│ 🔗 Facebook, Twitter, LinkedIn      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Tesla Motors UK (tesla.co.uk)       │
│ ✉️  uk@tesla.com                    │
│ 📞 +44-20-1234-5678                 │
│ 🔗 Facebook, Twitter                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Tesla Energy (teslaenergy.com)      │
│ ✉️  energy@tesla.com                │
│ 📞 +1-800-765-4321                  │
│ 🔗 LinkedIn                         │
└─────────────────────────────────────┘
```

---

### Scenario 2: Direct URL Search
**What you enter**: `apollo.io` or `www.tesla.com` or `https://microsoft.com/contact`

**What happens**:
1. ✅ System detects it's a URL
2. ✅ Extracts contact info from THAT specific URL ONLY
3. ✅ Shows single result immediately
4. ✅ No search for other websites

**Example Output**:
```
Contact Information

Source: https://apollo.io/contact

✉️  Emails:
   • support@apollo.io
   • sales@apollo.io
   • hello@apollo.io

📞 Phone Numbers:
   • +1-415-640-9303
   • +1-800-123-4567

🔗 Social Media:
   • LinkedIn: https://linkedin.com/company/apollo
   • Twitter: https://twitter.com/apollo
   • Facebook: https://facebook.com/apolloio
```

---

## 🎯 Quick Reference

### When to use Company Name:
- ✅ You want to find ALL websites for a company
- ✅ You're not sure of the exact domain
- ✅ You want comprehensive results from multiple sources
- ✅ Example: "Starbucks", "Amazon", "Nike"

### When to use URL:
- ✅ You know the exact website
- ✅ You want data from a specific page only
- ✅ You want faster results (no search needed)
- ✅ Example: "apollo.io", "www.shopify.com", "https://stripe.com/contact"

---

## 📝 Input Examples

### Company Names (Multi-Website Search):
```
✅ Tesla
✅ Microsoft Corporation
✅ Apple Inc
✅ Coca Cola
✅ Amazon
✅ Google
```

### URLs (Single Website Extraction):
```
✅ apollo.io
✅ www.tesla.com
✅ https://microsoft.com
✅ shopify.com/contact
✅ stripe.com
✅ https://www.apple.com/contact
```

---

## 🔄 Flow Diagrams

### Company Name Flow:
```
Enter "Tesla"
    ↓
Search for websites
    ↓
Found: tesla.com, tesla.co.uk, teslamotors.com
    ↓
Extract from ALL websites (parallel)
    ↓
Show all results on one page
```

### URL Flow:
```
Enter "apollo.io"
    ↓
Detect as URL
    ↓
Add https:// if needed → https://apollo.io
    ↓
Extract from this URL ONLY
    ↓
Show single result
```

---

## 💡 Pro Tips

### Tip 1: Specific Pages
If you want to extract from a specific contact page:
```
✅ https://apollo.io/contact
✅ https://tesla.com/contact-us
✅ https://microsoft.com/en-us/contact
```

### Tip 2: Subdomains
Subdomains are treated as URLs:
```
✅ support.shopify.com → Extracts from support.shopify.com only
✅ help.netflix.com → Extracts from help.netflix.com only
```

### Tip 3: International Domains
Country-specific domains are treated as URLs:
```
✅ tesla.co.uk → Extracts from tesla.co.uk only
✅ amazon.de → Extracts from amazon.de only
```

### Tip 4: Comprehensive Search
For comprehensive results, use company name:
```
✅ "Tesla" → Finds tesla.com, tesla.co.uk, teslamotors.com, etc.
❌ "tesla.com" → Only extracts from tesla.com
```

---

## ⚡ Performance Comparison

### Company Name Search:
- **Time**: 15-30 seconds (for 3 websites)
- **Results**: Multiple websites with all their contact info
- **Use Case**: Comprehensive research

### URL Search:
- **Time**: 5-10 seconds
- **Results**: Single website contact info
- **Use Case**: Quick extraction from known source

---

## 🎨 Visual Indicators

### In the UI:

**Company Name Search**:
```
🔍 Searching for Tesla's website...
📊 Found 3 matching websites
⚙️  Extracting from tesla.com (1/3)...
⚙️  Extracting from tesla.co.uk (2/3)...
⚙️  Extracting from teslamotors.com (3/3)...
✅ Complete! Showing 3 results
```

**URL Search**:
```
🔗 Fetching page content...
⚙️  Extracting contact information...
✅ Complete! Showing contact info
```

---

## ❓ FAQ

**Q: I entered "apollo.io" but it searched for multiple websites. Why?**  
A: This has been fixed! Now "apollo.io" is correctly detected as a URL and extracts from that site only.

**Q: How do I get results from multiple Apollo websites?**  
A: Enter just "Apollo" (without .io) to search for all Apollo-related websites.

**Q: Can I enter a URL without https://?**  
A: Yes! The system automatically adds https:// for you. Just enter "apollo.io" or "www.tesla.com"

**Q: What if I want to extract from a specific contact page?**  
A: Enter the full URL: "https://apollo.io/contact" or "apollo.io/contact"

**Q: Does it work with international domains?**  
A: Yes! "tesla.co.uk", "amazon.de", "google.fr" all work as URLs.

---

## ✅ Summary

| Input | Detection | Behavior | Results |
|-------|-----------|----------|---------|
| `Tesla` | Company Name | Search all websites | Multiple results |
| `apollo.io` | URL | Extract from apollo.io | Single result |
| `www.tesla.com` | URL | Extract from tesla.com | Single result |
| `https://apollo.io/contact` | URL | Extract from that page | Single result |
| `Microsoft Corporation` | Company Name | Search all websites | Multiple results |

---

**Remember**: 
- 🏢 **Company Name** = Find all websites
- 🔗 **URL** = Extract from specific site

Choose based on what you need! 🎯
