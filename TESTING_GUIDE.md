# Testing Guide - Contact Extractor Updates

## Pre-Testing Setup

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   - Desktop: http://localhost:5173
   - Mobile: Use browser DevTools or physical device

## Test Categories

### 1. Multiple Results Handling

#### Test 1.1: Single Result Search
- **Steps**:
  1. Search for "Tesla"
  2. Should automatically proceed to extraction
  3. Should NOT show multiple results page
- **Expected**: Direct extraction without selection

#### Test 1.2: Multiple Results Search
- **Steps**:
  1. Search for "Apple"
  2. Should show multiple results page
  3. Should display 2-3 different Apple companies
  4. Each result should show domain, title, and snippet
- **Expected**: Grid of results with proper information

#### Test 1.3: Result Selection
- **Steps**:
  1. From multiple results page
  2. Click on one result
  3. Should show loading indicator
  4. Should proceed to extraction
- **Expected**: Smooth transition to extraction

#### Test 1.4: Back Navigation
- **Steps**:
  1. From multiple results page
  2. Click "Back to Search"
  3. Should return to search input
- **Expected**: Clean return to search state

### 2. Data Extraction Quality

#### Test 2.1: Email Extraction
- **Steps**:
  1. Search for a company (e.g., "OpenAI")
  2. Check extracted emails
  3. Verify no test/placeholder emails
  4. Verify no noreply addresses
- **Expected**: Only valid business emails

#### Test 2.2: Phone Number Extraction
- **Steps**:
  1. Search for a company with phone numbers
  2. Check extracted phones
  3. Verify different formats are recognized:
     - +1-234-567-8900
     - (234) 567-8900
     - 234-567-8900
  4. Verify no coordinates or dates are included
- **Expected**: Valid phone numbers only

#### Test 2.3: Social Media Links
- **Steps**:
  1. Search for a company
  2. Check social media links
  3. Verify links are clickable
  4. Verify all platforms are recognized:
     - Facebook, Twitter, LinkedIn, Instagram, YouTube, TikTok, Pinterest, GitHub, WhatsApp
- **Expected**: Correct social media links

#### Test 2.4: No Address Extraction
- **Steps**:
  1. Search for any company
  2. Check contact dashboard
  3. Verify NO address section exists
- **Expected**: Address field completely removed

### 3. UI/UX - Desktop

#### Test 3.1: Sidebar Visibility
- **Steps**:
  1. Open app on desktop (> 1024px)
  2. Check left sidebar
  3. Verify sidebar is always visible
  4. Verify main content is offset
- **Expected**: Sidebar visible on left, content offset

#### Test 3.2: Recent Searches in Sidebar
- **Steps**:
  1. Perform 3-4 searches
  2. Check sidebar
  3. Verify recent searches appear
  4. Click on a recent search
  5. Should re-run that search
- **Expected**: Recent searches accessible and clickable

#### Test 3.3: New Search Button
- **Steps**:
  1. After viewing results
  2. Click "New Search" in sidebar
  3. Should clear results and show search input
- **Expected**: Clean return to search state

#### Test 3.4: Color-Coded Contact Info
- **Steps**:
  1. View contact results
  2. Check email badges (should be blue)
  3. Check phone badges (should be green)
  4. Check social badges (should be gray)
- **Expected**: Proper color coding for each type

### 4. UI/UX - Mobile

#### Test 4.1: Hamburger Menu Visibility
- **Steps**:
  1. Open app on mobile (< 768px)
  2. Check top-left corner
  3. Verify hamburger menu button exists
  4. Verify sidebar is hidden by default
- **Expected**: Hamburger menu visible, sidebar hidden

#### Test 4.2: Sidebar Toggle
- **Steps**:
  1. Tap hamburger menu
  2. Sidebar should slide in from left
  3. Overlay should appear
  4. Tap overlay or back button
  5. Sidebar should slide out
- **Expected**: Smooth sidebar animation

#### Test 4.3: Mobile Search
- **Steps**:
  1. On mobile, enter company name
  2. Tap search button
  3. Should show results
  4. Results should be full-width
- **Expected**: Proper mobile layout

#### Test 4.4: Mobile Results Grid
- **Steps**:
  1. Search for company with multiple results
  2. Check grid layout
  3. Should be single column on mobile
  4. Should be 2 columns on tablet
  5. Should be 3 columns on desktop
- **Expected**: Responsive grid layout

#### Test 4.5: Mobile Contact Display
- **Steps**:
  1. View contact results on mobile
  2. Check layout
  3. Should be single column
  4. Should be readable without scrolling horizontally
- **Expected**: Proper mobile layout

### 5. Bulk Search

#### Test 5.1: Bulk Upload
- **Steps**:
  1. Create CSV with company names:
     ```
     Apple
     Microsoft
     Google
     ```
  2. Upload file
  3. Should process all companies
  4. Should show progress
- **Expected**: All companies processed

#### Test 5.2: Bulk Results Display
- **Steps**:
  1. After bulk processing
  2. Check results page
  3. Verify no address field
  4. Verify color-coded contact info
- **Expected**: Proper bulk results display

#### Test 5.3: Bulk Export
- **Steps**:
  1. After bulk processing
  2. Click "Export to CSV"
  3. Should download CSV file
  4. Open CSV and verify data
- **Expected**: Valid CSV export

### 6. Search History

#### Test 6.1: History Persistence
- **Steps**:
  1. Perform 5 searches
  2. Check sidebar
  3. Verify all searches appear
  4. Refresh page
  5. Verify history persists
- **Expected**: History saved and persists

#### Test 6.2: History Organization
- **Steps**:
  1. Perform single searches
  2. Perform bulk searches
  3. Check sidebar
  4. Verify separated into "Companies" and "Bulk Searches"
- **Expected**: Organized history sections

#### Test 6.3: History Timestamps
- **Steps**:
  1. Check sidebar history
  2. Verify timestamps show
  3. Verify "X minutes ago" format
- **Expected**: Proper timestamp display

### 7. Responsive Design

#### Test 7.1: Mobile (< 768px)
- **Devices**: iPhone SE, iPhone 12, Pixel 4
- **Checks**:
  - Hamburger menu visible
  - Single column layouts
  - Touch targets 48px minimum
  - No horizontal scrolling
  - Proper spacing

#### Test 7.2: Tablet (768px - 1024px)
- **Devices**: iPad, iPad Air
- **Checks**:
  - Sidebar visible
  - 2-column grids
  - Balanced spacing
  - Proper touch targets

#### Test 7.3: Desktop (> 1024px)
- **Devices**: Desktop, Laptop
- **Checks**:
  - Fixed sidebar
  - 3-column grids
  - Full feature set
  - Proper mouse interactions

### 8. Performance

#### Test 8.1: Load Time
- **Steps**:
  1. Open app
  2. Check load time
  3. Should be < 3 seconds
- **Expected**: Fast load time

#### Test 8.2: Search Performance
- **Steps**:
  1. Perform search
  2. Check response time
  3. Should be < 5 seconds
- **Expected**: Fast search response

#### Test 8.3: Extraction Performance
- **Steps**:
  1. After search, check extraction time
  2. Should be < 10 seconds
- **Expected**: Fast extraction

### 9. Error Handling

#### Test 9.1: Invalid Company
- **Steps**:
  1. Search for non-existent company
  2. Should show error message
  3. Error should be clear
- **Expected**: Proper error handling

#### Test 9.2: Network Error
- **Steps**:
  1. Disconnect internet
  2. Try to search
  3. Should show error message
- **Expected**: Proper error handling

#### Test 9.3: API Rate Limit
- **Steps**:
  1. Perform many searches quickly
  2. Should show rate limit error
  3. Error should suggest retry
- **Expected**: Proper error handling

### 10. Cross-Browser Testing

#### Test 10.1: Chrome
- **Steps**:
  1. Open app in Chrome
  2. Run all tests
- **Expected**: All tests pass

#### Test 10.2: Firefox
- **Steps**:
  1. Open app in Firefox
  2. Run all tests
- **Expected**: All tests pass

#### Test 10.3: Safari
- **Steps**:
  1. Open app in Safari
  2. Run all tests
- **Expected**: All tests pass

#### Test 10.4: Edge
- **Steps**:
  1. Open app in Edge
  2. Run all tests
- **Expected**: All tests pass

## Test Data

### Company Names for Testing
- Apple (multiple results expected)
- Microsoft (multiple results expected)
- Google (multiple results expected)
- Tesla (single result expected)
- OpenAI (single result expected)
- Stripe (single result expected)

### Expected Results
- **Apple**: Apple Inc., Apple Support, Apple Developer
- **Microsoft**: Microsoft, Microsoft Support, Microsoft Developer
- **Google**: Google, Google Support, Google Cloud

## Checklist

- [ ] Multiple results display correctly
- [ ] Single results auto-process
- [ ] Email extraction works
- [ ] Phone extraction works
- [ ] Social media extraction works
- [ ] No address in results
- [ ] Sidebar visible on desktop
- [ ] Hamburger menu on mobile
- [ ] Recent searches work
- [ ] Color-coded badges display
- [ ] Mobile layout responsive
- [ ] Tablet layout responsive
- [ ] Desktop layout responsive
- [ ] Bulk upload works
- [ ] Bulk export works
- [ ] History persists
- [ ] Error handling works
- [ ] Performance acceptable
- [ ] Cross-browser compatible

## Known Limitations

1. Address extraction completely removed
2. Phone number extraction may have false negatives for unusual formats
3. Social media extraction limited to major platforms
4. Bulk processing limited by API rate limits

## Troubleshooting

### Sidebar not showing on desktop
- Check browser width (should be > 1024px)
- Check CSS is loaded properly
- Clear browser cache

### Hamburger menu not showing on mobile
- Check browser width (should be < 768px)
- Check CSS media queries are working
- Clear browser cache

### Results not displaying
- Check API key is set in .env
- Check internet connection
- Check API rate limits

### Phone numbers not extracting
- Check if page has phone numbers
- Check if format is supported
- Check extraction patterns

## Support

For issues or questions:
1. Check browser console for errors
2. Check network tab for API calls
3. Verify .env configuration
4. Check API documentation
