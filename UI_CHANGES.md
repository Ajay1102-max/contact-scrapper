# UI/UX Changes - Visual Guide

## Layout Changes

### Desktop View (Before)
```
┌─────────────────────────────────────────┐
│                                         │
│         Contact Extractor               │
│                                         │
│    [Search Input] [Search Button]       │
│                                         │
│    [Results / History]                  │
│                                         │
└─────────────────────────────────────────┘
```

### Desktop View (After)
```
┌──────────┬──────────────────────────────┐
│ SIDEBAR  │                              │
│          │    Contact Extractor         │
│ Recent   │                              │
│ Searches │  [Search Input] [Search]     │
│          │                              │
│ • Apple  │  [Results / History]         │
│ • Tesla  │                              │
│ • Google │                              │
│          │                              │
│ Bulk     │                              │
│ • 2024   │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Mobile View (Before)
```
┌─────────────────────────────┐
│                             │
│   Contact Extractor         │
│                             │
│  [Search Input] [Search]    │
│                             │
│  [Results / History]        │
│                             │
└─────────────────────────────┘
```

### Mobile View (After)
```
┌─────────────────────────────┐
│ ☰ [Header]                  │
├─────────────────────────────┤
│                             │
│   Contact Extractor         │
│                             │
│  [Search Input] [Search]    │
│                             │
│  [Results / History]        │
│                             │
└─────────────────────────────┘

When ☰ is tapped:
┌─────────────────────────────┐
│ ☰ [Header]                  │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ SIDEBAR                 │ │
│ │ Recent Searches         │ │
│ │ • Apple                 │ │
│ │ • Tesla                 │ │
│ │ • Google                │ │
│ │                         │ │
│ │ Bulk Searches           │ │
│ │ • 2024-01-15            │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

## Contact Information Display

### Before (With Address)
```
┌─────────────────────────────────────┐
│ Extracted Contact Information       │
├─────────────────────────────────────┤
│ 📧 Email Addresses                  │
│ [email1@example.com] [email2@...]   │
│                                     │
│ 📞 Phone Numbers                    │
│ [+1-234-567-8900] [+1-987-654-3210] │
│                                     │
│ 📍 Address                          │
│ [123 Main St, City, State 12345]    │
│                                     │
│ 🔗 Social Media                     │
│ [Facebook] [Twitter] [LinkedIn]     │
└─────────────────────────────────────┘
```

### After (Without Address, Color-Coded)
```
┌─────────────────────────────────────┐
│ Contact Information                 │
├─────────────────────────────────────┤
│ 📧 Email Addresses (2)              │
│ [email1@example.com] [email2@...]   │
│   (Blue badges)                     │
│                                     │
│ 📞 Phone Numbers (2)                │
│ [+1-234-567-8900] [+1-987-654-3210] │
│   (Green badges)                    │
│                                     │
│ 🔗 Social Media Links               │
│ [Facebook] [Twitter] [LinkedIn]     │
│   (Gray badges)                     │
└─────────────────────────────────────┘
```

## Multiple Results Display

### New Multiple Results Page
```
┌─────────────────────────────────────┐
│ ← Back to Search                    │
│                                     │
│ Multiple Results Found              │
│ We found 3 matching websites        │
│                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────┐ │
│ │ Apple    │ │ Apple    │ │ Apple│ │
│ │ Inc.     │ │ Support  │ │ Dev  │ │
│ │          │ │          │ │      │ │
│ │ apple.   │ │ support. │ │ dev. │ │
│ │ com      │ │ apple.   │ │ apple│ │
│ │          │ │ com      │ │ .com │ │
│ │ View →   │ │ View →   │ │View →│ │
│ └──────────┘ └──────────┘ └──────┘ │
│                                     │
└─────────────────────────────────────┘
```

## Sidebar Navigation

### Desktop Sidebar
```
┌──────────────────┐
│ Contact          │
│ Extractor        │
│ Search & Extract │
│                  │
│ [+ New Search]   │
│                  │
│ Recent Searches  │
│ ⏱️ Companies     │
│ • Apple          │
│   apple.com      │
│ • Tesla          │
│   tesla.com      │
│ • Google         │
│   google.com     │
│                  │
│ 📄 Bulk Searches │
│ • 2024-01-15     │
│   Jan 15, 2024   │
│                  │
└──────────────────┘
```

### Mobile Sidebar (Hamburger)
```
When closed:
┌─────────────────────────────┐
│ ☰ [Header]                  │
└─────────────────────────────┘

When open (overlay):
┌─────────────────────────────┐
│ ☰ [Header]                  │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Contact Extractor       │ │
│ │ Search & Extract        │ │
│ │                         │ │
│ │ [+ New Search]          │ │
│ │                         │ │
│ │ Recent Searches         │ │
│ │ ⏱️ Companies            │ │
│ │ • Apple                 │ │
│ │ • Tesla                 │ │
│ │ • Google                │ │
│ │                         │ │
│ │ 📄 Bulk Searches        │ │
│ │ • 2024-01-15            │ │
│ └─────────────────────────┘ │
│ [Overlay - tap to close]    │
└─────────────────────────────┘
```

## Search Flow Comparison

### Before
```
Enter Company Name
        ↓
Search for Domains
        ↓
Multiple Results? → Show Selector → User Chooses
        ↓ (Single Result)
Generate URLs
        ↓
Find Working URL
        ↓
Extract Contacts
        ↓
Display Results (with Address)
```

### After
```
Enter Company Name
        ↓
Check Cache
        ↓
Search for Domains
        ↓
Multiple Results? → Show Grid Page → User Selects
        ↓ (Single Result)
Generate URLs
        ↓
Find Working URL
        ↓
Extract Contacts (No Address)
        ↓
Display Results (Color-Coded)
```

## Color Scheme for Contact Info

### Email Badges
- Background: Light Blue (#dbeafe)
- Text: Dark Blue (#111e3f)
- Border: Medium Blue (#93c5fd)
- Hover: Lighter Blue (#bfdbfe)

### Phone Badges
- Background: Light Green (#dcfce7)
- Text: Dark Green (#14532d)
- Border: Medium Green (#86efac)
- Hover: Lighter Green (#bbf7d0)

### Social Media Badges
- Background: Light Gray (#f3f4f6)
- Text: Dark Gray (#1f2937)
- Border: Medium Gray (#d1d5db)
- Hover: Lighter Gray (#e5e7eb)

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layouts
- Full-width inputs
- Hamburger menu visible
- Sidebar slides in from left
- Touch-friendly spacing (48px minimum)

### Tablet (768px - 1024px)
- 2-column grids
- Sidebar visible but narrower
- Balanced spacing
- Medium touch targets

### Desktop (> 1024px)
- 3-column grids
- Fixed sidebar (256px)
- Full feature set
- Optimized for mouse/keyboard

## Animation & Transitions

### Sidebar
- Slide in/out: 300ms ease
- Overlay fade: 300ms ease

### Results Grid
- Fade in: 500ms ease-out
- Hover scale: 300ms ease

### Buttons
- Hover transform: -2px translateY
- Active transform: 0px translateY
- Transition: 300ms ease

### Loading States
- Spinner: 1s linear infinite
- Pulse: 2s cubic-bezier animation
