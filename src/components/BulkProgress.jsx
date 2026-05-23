import React from 'react';
import { exportBulkResultsToCSV } from '../lib/csvExport';

export default function BulkProgress({ total, completed, current, results }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleExportCSV = () => {
    try {
      exportBulkResultsToCSV(results, `contact-extraction-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export CSV');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-4">
      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bulk Processing
          </h3>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {completed} / {total} completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-300">
            {percentage}%
          </div>
        </div>

        {/* Current Processing */}
        {current && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span>Processing: <span className="font-medium text-gray-900 dark:text-white">{current}</span></span>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* Export Button */}
          {completed === total && completed > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
                </svg>
                Export to CSV
              </button>
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.success
                    ? 'bg-white border-black'
                    : 'bg-white border-gray-400'
                }`}
              >
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {result.company}
                    </p>
                    {result.success ? (
                      <div className="text-sm text-gray-600 space-y-1 mt-2">
                        <p className="truncate"><strong>Domain:</strong> {result.domain}</p>
                        {result.email && result.email.length > 0 && (
                          <p className="truncate"><strong>Emails:</strong> {result.email.length}</p>
                        )}
                        {result.phone && result.phone.length > 0 && (
                          <p className="truncate"><strong>Phones:</strong> {result.phone.length}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {result.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
