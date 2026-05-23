import React from 'react';

export default function CompanySelector({ companies, onSelect, onCancel }) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-lg border-2 border-black overflow-hidden">
        <div className="bg-black text-white px-6 py-4">
          <h3 className="text-xl font-bold">Multiple Companies Found</h3>
          <p className="text-sm text-gray-300 mt-1">Select the company you're looking for:</p>
        </div>
        
        <div className="p-4 space-y-2">
          {companies.map((company, index) => (
            <button
              key={index}
              onClick={() => onSelect(company)}
              className="w-full p-4 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-black">
                    {company.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {company.domain}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-600 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-100 border-t-2 border-gray-300">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 text-gray-900 hover:text-black transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
