import React from 'react';

export default function SearchHistory({ history, onSelectCompany }) {
  if (!history || history.length === 0) return null;

  const singleSearches = history.filter(item => item.type !== 'bulk').slice(0, 10);
  const bulkSearches = history.filter(item => item.type === 'bulk').slice(0, 5);

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recent Searches
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Searches */}
        {singleSearches.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
              Company Searches
            </h4>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {singleSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelectCompany(item)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 capitalize group-hover:text-black transition-colors truncate">
                        {item.company_name}
                      </p>
                      <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors truncate">
                        {item.domain}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors hidden sm:block">
                      {getTimeAgo(new Date(item.fetched_at))}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bulk Searches */}
        {bulkSearches.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
              Bulk Searches
            </h4>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {bulkSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelectCompany(item)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-black rounded-lg group-hover:bg-gray-800 transition-all duration-300 flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover:text-black transition-colors">
                        Bulk Search
                      </p>
                      <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                        {new Date(item.fetched_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors hidden sm:block">
                      {getTimeAgo(new Date(item.fetched_at))}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}
