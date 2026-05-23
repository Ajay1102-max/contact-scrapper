# Quick Start Guide - Updated Contact Extractor

## What's New?

✨ **Major Updates**:
- 🔍 **Multiple Results**: See all matching websites when searching
- 📱 **Mobile Responsive**: Hamburger menu sidebar on mobile
- 🎨 **Better UI**: Color-coded contact information (blue emails, green phones)
- 📊 **No Address**: Removed address scraping for cleaner data
- 📞 **Better Phone Extraction**: Improved validation and format support
- 🔗 **Enhanced Social Links**: Added WhatsApp and GitHub support
- ⏱️ **Quick Access**: Recent searches in sidebar for fast re-runs

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file with:
```
VITE_TAVILY_API_KEY=your_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

## How to Use

### Single Company Search

1. **Enter Company Name**
   - Type company name (e.g., "Apple", "Tesla", "Google")
   - Or paste a contact page URL

2. **Click Search**
   - App searches for matching websites
   - If multiple results found, you'll see them all
   - If single result, extraction starts automatically

3. **Select Result (if multiple)**
   - Click on the website you want
   - App extracts contact information
   - Results display with color-coded badges

4. **View Results**
   - 📧 **Blue Badges**: Email addresses (click to email)
   - 📞 **Green Badges**: Phone numbers (click to call)
   - 🔗 **Gray Badges**: Social media links (click to visit)

### Bulk Search

1. **Create CSV File**
   ```
   Apple
   Microsoft
   Google
   Tesla
   ```

2. **Upload File**
   - Click "Upload CSV/TXT File"
   - Select your file
   - App processes all companies

3. **View Results**
   - See progress as companies are processed
   - View all results when complete
   - Export to CSV if needed

### Using Recent Searches

#### Desktop
- Sidebar on left shows recent searches
- Click any search to re-run it
- Organized by type (Companies vs Bulk)

#### Mobile
- Tap hamburger menu (☰) in top-left
- Sidebar slides in from left
- Click any search to re-run it
- Tap overlay to close sidebar

## Features

### Search Features
- ✅ Company name search
- ✅ Direct URL extraction
- ✅ Multiple results display
- ✅ Cached results
- ✅ Bulk processing

### Data Extraction
- ✅ Email addresses
- ✅ Phone numbers (multiple formats)
- ✅ Social media links
- ✅ Smart validation
- ❌ Address (removed for cleaner data)

### UI Features
- ✅ Responsive design
- ✅ Mobile hamburger menu
- ✅ Sidebar navigation
- ✅ Recent search history
- ✅ Color-coded information
- ✅ Dark/light theme support

### Export Features
- ✅ CSV export for bulk results
- ✅ Copy individual contacts
- ✅ Direct email/phone links

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Submit search |
| Esc | Close sidebar (mobile) |
| Ctrl+K | Focus search (coming soon) |

## Tips & Tricks

### Get Better Results
1. Use full company name (e.g., "Apple Inc." instead of "Apple")
2. If multiple results, choose the official website
3. Check the source URL to verify it's correct

### Bulk Processing
1. One company name per line
2. Use .csv or .txt format
3. Avoid special characters in names
4. Process in batches of 50-100 for best results

### Mobile Usage
1. Tap hamburger menu to access history
2. Use full-width search for easier typing
3. Tap color-coded badges to contact directly
4. Swipe to close sidebar

## Troubleshooting

### Search Returns No Results
- **Solution**: Try different company name variations
- **Example**: "Apple" → "Apple Inc." → "Apple Computer"

### Phone Numbers Not Extracting
- **Solution**: Check if page has phone numbers
- **Supported Formats**:
  - +1-234-567-8900
  - (234) 567-8900
  - 234-567-8900
  - +44 20 7946 0958

### Emails Not Extracting
- **Solution**: Check if page has contact form instead
- **Note**: Contact forms are not scraped

### Sidebar Not Showing
- **Desktop**: Make sure window is wide enough (> 1024px)
- **Mobile**: Tap hamburger menu (☰) in top-left

### Slow Performance
- **Solution**: Check internet connection
- **Note**: First search may be slower due to caching

## API Limits

- **Search**: 5 requests per minute
- **Extraction**: 10 requests per minute
- **Bulk**: 100 companies per batch

If you hit limits, wait a few minutes before retrying.

## Data Privacy

- ✅ No personal data stored
- ✅ No tracking
- ✅ Results cached locally
- ✅ HTTPS only
- ✅ No third-party sharing

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE 11 | ❌ Not supported |

## File Formats

### CSV Format
```
Company Name
Apple
Microsoft
Google
Tesla
```

### TXT Format
```
Apple
Microsoft
Google
Tesla
```

## Export Format

### CSV Export
```
Company,Domain,Email,Phone,Social
Apple,apple.com,"email1@apple.com, email2@apple.com","+1-234-567-8900",facebook.com/apple
```

## Common Issues & Solutions

### Issue: "No results found"
**Solution**: 
- Try different company name
- Check spelling
- Use full company name

### Issue: "API rate limit reached"
**Solution**:
- Wait 1-2 minutes
- Reduce bulk batch size
- Try again later

### Issue: "No contact information found"
**Solution**:
- Company may use contact form
- Try different contact page URL
- Check if page has information

### Issue: "Sidebar not visible"
**Solution**:
- Desktop: Maximize window width
- Mobile: Tap hamburger menu
- Refresh page

## Getting Help

1. **Check Documentation**
   - Read IMPLEMENTATION_SUMMARY.md
   - Read UI_CHANGES.md
   - Read TESTING_GUIDE.md

2. **Check Browser Console**
   - Press F12 to open DevTools
   - Check Console tab for errors
   - Check Network tab for API calls

3. **Verify Configuration**
   - Check .env file
   - Verify API keys are correct
   - Check internet connection

## Next Steps

1. ✅ Install and setup
2. ✅ Try single company search
3. ✅ Try multiple results search
4. ✅ Try bulk upload
5. ✅ Export results
6. ✅ Check recent searches
7. ✅ Test on mobile

## Performance Tips

- Use cached results when possible
- Batch bulk searches (50-100 at a time)
- Clear browser cache if slow
- Use modern browser for best performance

## Feedback

Found a bug or have a suggestion?
- Check existing issues
- Create detailed bug report
- Include browser and OS info
- Include steps to reproduce

## Version Info

- **Version**: 2.0.0
- **Last Updated**: 2024
- **Status**: Production Ready

---

**Happy searching! 🚀**
