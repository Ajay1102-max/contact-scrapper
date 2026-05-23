import React from 'react';

export default function ExtractionStatus({ step, query }) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black">
        <div className="flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {step || 'Processing...'}
            </h3>
            {query && (
              <p className="text-sm text-gray-600 mt-1">
                Query: {query}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
