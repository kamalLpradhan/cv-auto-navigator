
const GOOGLE_API_KEY = 'AIzaSyCWiVxC_QLRNUIq6STBHBvbnelnMiD0IMM';
const DEFAULT_SEARCH_ENGINE_ID = '136d9854244734739'; // Default search engine ID

interface GoogleSearchResult {
  items?: {
    title: string;
    link: string;
    snippet: string;
    pagemap?: {
      metatags?: Array<{
        "og:title"?: string;
        "og:description"?: string;
        "og:site_name"?: string;
      }>;
    };
  }[];
  error?: {
    code: number;
    message: string;
  };
}

// Function to extract Search Engine ID from HTML embed code or validate plain ID
const extractSearchEngineId = (input: string): string => {
  if (!input || input.trim() === '') {
    return '';
  }

  // If the input contains HTML script tags, extract the cx value
  const scriptMatch = input.match(/cx=["']?([a-zA-Z0-9]+)["']?/);
  if (scriptMatch && scriptMatch[1]) {
    return scriptMatch[1];
  }

  // If it's just a plain ID (alphanumeric), return it
  const plainIdMatch = input.match(/^[a-zA-Z0-9]+$/);
  if (plainIdMatch) {
    return input.trim();
  }

  // If it contains other patterns, try to extract just alphanumeric parts
  const extractedId = input.replace(/[^a-zA-Z0-9]/g, '');
  if (extractedId.length > 10) { // Search engine IDs are typically longer than 10 chars
    return extractedId;
  }

  return '';
};

export const searchJobs = async (query: string, location: string, searchEngineId: string = DEFAULT_SEARCH_ENGINE_ID): Promise<any[]> => {
  try {
    // Clean and validate the search engine ID
    const cleanedId = extractSearchEngineId(searchEngineId);
    const finalSearchEngineId = cleanedId || DEFAULT_SEARCH_ENGINE_ID;
    
    console.log('Using Search Engine ID:', finalSearchEngineId);
    
    if (!finalSearchEngineId) {
      throw new Error('Search Engine ID is required. Please configure your Google Custom Search Engine ID.');
    }
    
    const searchQuery = `${query} jobs ${location}`.trim();
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${finalSearchEngineId}&q=${encodeURIComponent(searchQuery)}`;
    
    console.log('Making request to:', apiUrl);
    
    const response = await fetch(apiUrl);

    const data: GoogleSearchResult = await response.json();
    
    // Check for API errors in the response
    if (data.error) {
      if (data.error.code === 400) {
        if (data.error.message.includes('invalid argument') || data.error.message.includes('Invalid Value')) {
          throw new Error('Invalid Google Custom Search Engine ID. Please check your configuration or set up a new Custom Search Engine at https://cse.google.com/');
        }
      }
      throw new Error(`Google API Error: ${data.error.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    return (data.items || []).map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      title: item.title || 'Job Position',
      company: item.pagemap?.metatags?.[0]?.["og:site_name"] || 'Company',
      location: location || 'Location not specified',
      type: 'Full-time',
      description: item.snippet || item.pagemap?.metatags?.[0]?.["og:description"] || '',
      requirements: [],
      skills: [],
      postedDate: new Date().toISOString(),
      canAutoApply: true,
      source: 'Google Search',
      applyUrl: item.link
    }));
  } catch (error) {
    console.error('Google search error:', error);
    throw error;
  }
};
