import React from 'react';

export default function ContactDashboard({ data, isCached = false }) {
  const hasAnyContact = 
    (data.email && data.email.length > 0) ||
    (data.phone && data.phone.length > 0) ||
    (data.socials && Object.values(data.socials).some(v => v));

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg border-2 border-black overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Contact Information</h2>
            {isCached && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-full text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Cached
              </span>
            )}
          </div>
          
          {/* Source URL */}
          <div className="bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Source URL:</p>
            <a
              href={data.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white hover:text-gray-300 flex items-center gap-2 break-all"
            >
              {data.source_url}
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {hasAnyContact ? (
            <div className="space-y-6">
              {/* Emails */}
              {data.email && data.email.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Addresses ({data.email.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.email.map((email, index) => (
                      <a
                        key={index}
                        href={`mailto:${email}`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm hover:bg-blue-200 transition-colors border border-blue-300"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Phones */}
              {data.phone && data.phone.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Numbers ({data.phone.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.phone.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-green-100 text-green-900 rounded-full text-sm hover:bg-green-200 transition-colors border border-green-300"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {data.socials && Object.values(data.socials).some(v => v) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Social Media Links
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(data.socials).map(([platform, url]) => 
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium text-gray-900 capitalize border border-gray-400 text-center"
                        >
                          {platform}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Contact Information Found
              </h3>
              <p className="text-gray-600">
                The page may use a contact form or the information might be in an image.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
