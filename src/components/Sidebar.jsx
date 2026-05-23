import React from 'react';

export default function Sidebar({ onNewSearch, onBulkSearch, isOpen, onToggle, activeView }) {
  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-gray-900 to-black text-white overflow-y-auto z-40 transform transition-transform duration-300 md:translate-x-0 shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-10 pt-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Contact Finder</h1>
            </div>
            <p className="text-sm text-gray-400 ml-14">Extract contact information</p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-3">
            {/* Single Search */}
            <button
              onClick={() => {
                onNewSearch();
                if (window.innerWidth < 768) onToggle();
              }}
              className={`w-full px-4 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeView === 'single'
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Single Search</span>
            </button>

            {/* Bulk Search */}
            <button
              onClick={() => {
                onBulkSearch();
                if (window.innerWidth < 768) onToggle();
              }}
              className={`w-full px-4 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeView === 'bulk'
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Bulk Search</span>
            </button>
          </nav>

          {/* Info Section */}
          <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How it works
            </h3>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-white mt-0.5">•</span>
                <span>Enter company name or URL</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white mt-0.5">•</span>
                <span>Get emails, phones & social links</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white mt-0.5">•</span>
                <span>Bulk process multiple companies</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main content offset for desktop */}
      <div className="hidden md:block w-72" />
    </>
  );
}
