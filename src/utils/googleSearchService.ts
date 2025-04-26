
const GOOGLE_API_KEY = 'AIzaSyCWiVxC_QLRNUIq6STBHBvbnelnMiD0IMM';

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
}

export const searchJobs = async (query: string, location: string, searchEngineId: string): Promise<any[]> => {
  try {
    if (!searchEngineId) {
      throw new Error('Search Engine ID is required');
    }
    
    const searchQuery = `${query} jobs ${location}`.trim();
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data: GoogleSearchResult = await response.json();
    
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
