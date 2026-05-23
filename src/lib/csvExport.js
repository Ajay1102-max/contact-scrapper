/**
 * Convert bulk results to CSV format and trigger download
 * @param {Array} results - Array of bulk search results with contact data
 * @param {string} filename - Name of the CSV file to download
 */
export function exportBulkResultsToCSV(results, filename = 'contact-extraction.csv') {
  if (!results || results.length === 0) {
    throw new Error('No results to export');
  }

  // Prepare CSV headers
  const headers = [
    'Company Name',
    'Domain',
    'Source URL',
    'Emails',
    'Phone Numbers',
    'Address',
    'Facebook',
    'Twitter',
    'LinkedIn',
    'Instagram',
    'YouTube',
    'Status',
    'Error Message'
  ];

  // Prepare CSV rows
  const rows = results.map(result => [
    result.company || '',
    result.domain || '',
    result.source_url || '',
    result.email ? result.email.join('; ') : '',
    result.phone ? result.phone.join('; ') : '',
    result.address || '',
    result.socials?.facebook || '',
    result.socials?.twitter || '',
    result.socials?.linkedin || '',
    result.socials?.instagram || '',
    result.socials?.youtube || '',
    result.success ? 'Success' : 'Failed',
    result.error || ''
  ]);

  // Create CSV content
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convert bulk results to JSON format and trigger download
 * @param {Array} results - Array of bulk search results
 * @param {string} filename - Name of the JSON file to download
 */
export function exportBulkResultsToJSON(results, filename = 'contact-extraction.json') {
  if (!results || results.length === 0) {
    throw new Error('No results to export');
  }

  const jsonContent = JSON.stringify(results, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
