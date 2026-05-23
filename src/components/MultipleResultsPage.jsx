import React from 'react';

export default function MultipleResultsPage({ results, searchQuery, onBack }) {
  const successfulResults = results.filter(r => r.contactData && !r.error);
  const failedResults = results.filter(r => r.error || !r.contactData);

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 animate-fadeIn">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black hover:bg-white rounded-lg transition-all duration-300 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {successfulResults.length > 0 ? `Found ${successfulResults.length} Result${successfulResults.length !== 1 ? 's' : ''}` : 'No Results Found'}
        </h2>
        <p className="text-gray-600">
          {searchQuery && `Showing contact information for "${searchQuery}"`}
        </p>
      </div>

      {/* Successful Results */}
      {successfulResults.length > 0 && (
        <div className="space-y-6 mb-8">
          {successfulResults.map((result, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{result.title}</h3>
                    <a
                      href={`https://${result.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-300 hover:text-white flex items-center gap-2 break-all"
                    >
                      {result.domain}
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  {result.cached && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full text-sm flex-shrink-0 ml-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Cached
                    </span>
                  )}
                </div>
                
                {/* Source URL */}
                {result.contactData?.source_url && (
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Extracted from:</p>
                    <a
                      href={result.contactData.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white hover:text-gray-300 flex items-center gap-2 break-all"
                    >
                      {result.contactData.source_url}
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="p-6">
                {result.contactData && (
                  <div className="space-y-6">
                    {/* Emails */}
                    {result.contactData.email && result.contactData.email.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email Addresses ({result.contactData.email.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.contactData.email.map((email, idx) => (
                            <a
                              key={idx}
                              href={`mailto:${email}`}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-900 rounded-full text-sm hover:bg-blue-100 transition-colors border border-blue-200 font-medium"
                            >
                              {email}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Phones */}
                    {result.contactData.phone && result.contactData.phone.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Phone Numbers ({result.contactData.phone.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.contactData.phone.map((phone, idx) => (
                            <a
                              key={idx}
                              href={`tel:${phone.replace(/\s/g, '')}`}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-green-50 text-green-900 rounded-full text-sm hover:bg-green-100 transition-colors border border-green-200 font-medium"
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social Links */}
                    {result.contactData.socials && Object.values(result.contactData.socials).some(v => v) && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Social Media Links
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {Object.entries(result.contactData.socials).map(([platform, url]) => 
                            url && (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-gray-900 capitalize border border-gray-300 text-center"
                              >
                                {platform}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* No contact info found */}
                    {(!result.contactData.email || result.contactData.email.length === 0) &&
                     (!result.contactData.phone || result.contactData.phone.length === 0) &&
                     (!result.contactData.socials || !Object.values(result.contactData.socials).some(v => v)) && (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-600">No contact information found on this page</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Failed Results */}
      {failedResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Unable to Extract ({failedResults.length})
          </h3>
          <div className="space-y-3">
            {failedResults.map((result, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{result.title}</p>
                    <p className="text-sm text-gray-600">{result.domain}</p>
                    {result.error && (
                      <p className="text-sm text-red-700 mt-1">{result.error}</p>
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
