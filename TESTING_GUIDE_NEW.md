# Testing Guide for New UI Improvements

## 🚀 Development Server
The server is now running at: **http://localhost:3000/**

---

## 🧪 Test Scenarios

### 1. **Sidebar Navigation (Desktop)**
- [ ] Sidebar is visible on the left with dark gradient background
- [ ] "Single Search" button is highlighted by default
- [ ] Click "Bulk Search" - button highlights and view changes
- [ ] Click "Single Search" - returns to single search view
- [ ] Sidebar stays fixed when scrolling

### 2. **Sidebar Navigation (Mobile)**
- [ ] Resize browser to mobile width (< 768px)
- [ ] Hamburger menu button appears in top-left
- [ ] Click hamburger - sidebar slides in from left
- [ ] Dark overlay appears behind sidebar
- [ ] Click overlay - sidebar closes
- [ ] Click "Single Search" - sidebar closes automatically
- [ ] Click "Bulk Search" - sidebar closes automatically

### 3. **Single Search - One Result**
**Test Case**: Search for a company with one website
- [ ] Enter "Tesla" in search box
- [ ] Click "Search" button
- [ ] Loading animation appears
- [ ] Status messages show progress
- [ ] Contact information displays directly (no selection needed)
- [ ] Emails shown in blue badges
- [ ] Phone numbers shown in green badges
- [ ] Social links shown in gray badges
- [ ] Source URL is displayed
- [ ] "Back to Search" button works

### 4. **Single Search - Multiple Results**
**Test Case**: Search for a company with multiple websites
- [ ] Enter a common company name (e.g., "Apple Store")
- [ ] Click "Search"
- [ ] Loading shows extraction from multiple sites
- [ ] All results display on one page
- [ ] Each result shows in its own card
- [ ] Each card has:
  - Company name and domain
  - Source URL
  - Extracted emails (if any)
  - Extracted phone numbers (if any)
  - Extracted social links (if any)
- [ ] Failed extractions shown at bottom (if any)
- [ ] "Back to Search" button works

### 5. **Phone Number Extraction Quality**
**Test**: Verify no false positives
- [ ] Search for a company
- [ ] Check phone numbers extracted
- [ ] Verify NO coordinates (e.g., 40.7128, -74.0060)
- [ ] Verify NO dates (e.g., 12/25/2023)
- [ ] Verify NO sequential numbers (e.g., 123-456-7890)
- [ ] Verify NO repeated digits (e.g., 111-111-1111)
- [ ] Verify ONLY real phone numbers

### 6. **Email Extraction Quality**
**Test**: Verify proper emails only
- [ ] Check emails extracted
- [ ] Verify NO example.com emails
- [ ] Verify NO noreply@ emails
- [ ] Verify NO test.com emails
- [ ] Verify ONLY real contact emails

### 7. **Address Scraping Removed**
- [ ] Check extracted data
- [ ] Verify NO address field
- [ ] Verify ONLY emails, phones, and social links

### 8. **Bulk Search**
**Test**: Upload multiple companies
- [ ] Click "Bulk Search" in sidebar
- [ ] Large upload area appears
- [ ] Create a test file (companies.txt):
  ```
  Tesla
  Microsoft
  Apple
  ```
- [ ] Upload the file
- [ ] Progress bar shows current company
- [ ] Results page shows all companies
- [ ] Each company has its extracted data
- [ ] Export functionality works

### 9. **Recent Searches Display**
- [ ] Perform a single search
- [ ] Return to home (click "Back to Search")
- [ ] Recent searches appear below search input
- [ ] Two columns: "Company Searches" and "Bulk Searches"
- [ ] Click a recent search - loads that data
- [ ] Time ago is displayed correctly

### 10. **Cache Functionality**
- [ ] Search for "Tesla"
- [ ] Note the loading time
- [ ] Click "Back to Search"
- [ ] Search for "Tesla" again
- [ ] Should load instantly with "Cached" badge
- [ ] Data should be identical

### 11. **Mobile Responsiveness**
**Test at different widths**: 375px, 768px, 1024px, 1440px
- [ ] 375px (Mobile):
  - Hamburger menu visible
  - Search input full width
  - Search button stacks below input
  - Results cards single column
  - Recent searches single column
  - All text readable
  - Touch targets large enough
- [ ] 768px (Tablet):
  - Sidebar visible
  - Two-column layouts work
  - Proper spacing
- [ ] 1024px+ (Desktop):
  - Sidebar fixed left
  - Multi-column layouts
  - Optimal spacing

### 12. **Error Handling**
- [ ] Search for "asdfghjklqwertyuiop" (nonsense)
- [ ] Error message displays clearly
- [ ] Can search again without refresh
- [ ] Try with no internet connection
- [ ] Appropriate error message

### 13. **Loading States**
- [ ] Search button shows spinner when loading
- [ ] Status messages update during extraction
- [ ] Progress bar for bulk searches
- [ ] Disabled state prevents double-clicks

### 14. **Animations & Transitions**
- [ ] Page loads with fade-in animation
- [ ] Sidebar slides smoothly
- [ ] Cards have hover effects
- [ ] Buttons have hover/active states
- [ ] Smooth transitions (not jarring)

### 15. **Social Media Links**
**Test**: Verify all platforms detected
- [ ] Facebook links extracted
- [ ] Twitter/X links extracted
- [ ] LinkedIn links extracted
- [ ] Instagram links extracted
- [ ] YouTube links extracted
- [ ] GitHub links extracted (if applicable)
- [ ] WhatsApp links extracted (if applicable)

---

## 🐛 Known Issues to Watch For

1. **Rate Limiting**: Tavily API has rate limits
   - If you see "429" errors, wait a moment
   - Bulk searches may hit limits with many companies

2. **No Contact Info**: Some websites may not have extractable contact info
   - This is expected behavior
   - Should show "No contact information found" message

3. **Extraction Failures**: Some sites may fail to extract
   - Should show in "Unable to Extract" section
   - Should not crash the app

---

## ✅ Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Smooth animations
- ✅ Responsive on all screen sizes
- ✅ Proper data extraction
- ✅ No false positives in phone numbers
- ✅ Clean, professional UI
- ✅ Fast loading with cache
- ✅ Clear error messages

---

## 📊 Performance Benchmarks

- **Single search (cached)**: < 1 second
- **Single search (new)**: 5-10 seconds
- **Multiple results (3 sites)**: 15-30 seconds
- **Bulk search (10 companies)**: 2-3 minutes

---

## 🔧 Troubleshooting

### Issue: Sidebar not showing
- **Solution**: Check browser width, may be hidden on mobile

### Issue: No results found
- **Solution**: Check Tavily API key in .env file

### Issue: Phone numbers look wrong
- **Solution**: This is now fixed - should only show real phone numbers

### Issue: Hamburger menu not working
- **Solution**: Check browser console for errors, ensure JavaScript is enabled

### Issue: Slow extraction
- **Solution**: Normal for multiple sites, be patient

---

## 📝 Feedback

After testing, note:
1. Any bugs or issues
2. UI/UX improvements
3. Performance concerns
4. Mobile experience
5. Extraction accuracy

---

## 🎉 Ready to Test!

Open **http://localhost:3000/** in your browser and start testing!
