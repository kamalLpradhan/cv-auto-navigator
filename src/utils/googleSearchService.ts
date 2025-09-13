import { parseSalaryFromText, convertSalaryToINR, type Salary } from './currencyUtils';

const GOOGLE_API_KEY = 'AIzaSyCWiVxC_QLRNUIq6STBHBvbnelnMiD0IMM';
const DEFAULT_SEARCH_ENGINE_ID = '51ad170dce0d9478c'; // Updated with your search engine ID

interface GoogleSearchResult {
  items?: {
    title: string;
    link: string;
    snippet: string;
    displayLink?: string;
    pagemap?: {
      metatags?: Array<{
        "og:title"?: string;
        "og:description"?: string;
        "og:site_name"?: string;
        "article:published_time"?: string;
        "twitter:title"?: string;
        "twitter:description"?: string;
      }>;
      jobposting?: Array<{
        title?: string;
        hiringOrganization?: string;
        jobLocation?: string;
        employmentType?: string;
        datePosted?: string;
        basesalary?: string;
        salaryCurrency?: string;
        industry?: string;
        description?: string;
        qualifications?: string;
        responsibilities?: string;
      }>;
      organization?: Array<{
        name?: string;
        url?: string;
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

// Enhanced search with structured queries and filters
interface SearchFilters {
  jobType?: string;
  industry?: string;
  experienceLevel?: string;
  salaryRange?: string;
  datePosted?: 'past24h' | 'past3days' | 'pastweek' | 'pastmonth';
  remote?: boolean;
}

// Job site domains for targeted searches
const JOB_SITE_DOMAINS = {
  linkedin: 'linkedin.com/jobs',
  indeed: 'indeed.com',
  glassdoor: 'glassdoor.com',
  monster: 'monster.com',
  ziprecruiter: 'ziprecruiter.com',
  dice: 'dice.com',
  stackoverflow: 'stackoverflow.com/jobs',
  angel: 'angel.co',
  remote: 'remoteok.io'
};

// Industry-specific keywords for better targeting
const INDUSTRY_KEYWORDS = {
  technology: ['software', 'developer', 'engineer', 'programmer', 'tech', 'IT', 'DevOps', 'frontend', 'backend', 'fullstack'],
  healthcare: ['nurse', 'doctor', 'medical', 'healthcare', 'clinical', 'therapist', 'physician'],
  finance: ['financial', 'analyst', 'accountant', 'banking', 'investment', 'CPA', 'finance'],
  education: ['teacher', 'instructor', 'education', 'academic', 'professor', 'training'],
  sales: ['sales', 'account manager', 'business development', 'customer success', 'marketing'],
  design: ['designer', 'UX', 'UI', 'creative', 'graphic', 'visual', 'product design']
};

// Build structured search query with schema.org targeting
const buildStructuredQuery = (query: string, location: string, filters: SearchFilters = {}): string => {
  const baseTerms = [];
  
  // Add core job-related terms
  baseTerms.push(`"${query}"`);
  
  // Add schema.org structured data targeting
  baseTerms.push('("JobPosting" OR "job-posting" OR "hiring" OR "career" OR "employment")');
  
  // Add location if specified
  if (location) {
    baseTerms.push(`"${location}"`);
  }
  
  // Add job type filters
  if (filters.jobType) {
    baseTerms.push(`"${filters.jobType}"`);
  }
  
  // Add remote filter
  if (filters.remote) {
    baseTerms.push('("remote" OR "work from home" OR "telecommute")');
  }
  
  // Add industry-specific keywords
  if (filters.industry && INDUSTRY_KEYWORDS[filters.industry as keyof typeof INDUSTRY_KEYWORDS]) {
    const industryTerms = INDUSTRY_KEYWORDS[filters.industry as keyof typeof INDUSTRY_KEYWORDS];
    baseTerms.push(`(${industryTerms.map(term => `"${term}"`).join(' OR ')})`);
  }
  
  // Add experience level filter
  if (filters.experienceLevel) {
    const expMap: { [key: string]: string } = {
      'entry': '("entry level" OR "junior" OR "graduate" OR "0-2 years")',
      'mid': '("mid level" OR "2-5 years" OR "experienced")',
      'senior': '("senior" OR "lead" OR "5+ years" OR "expert")',
      'executive': '("director" OR "manager" OR "executive" OR "VP" OR "C-level")'
    };
    if (expMap[filters.experienceLevel]) {
      baseTerms.push(expMap[filters.experienceLevel]);
    }
  }
  
  // Add date filter
  if (filters.datePosted) {
    const dateMap: { [key: string]: string } = {
      'past24h': 'after:' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      'past3days': 'after:' + new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      'pastweek': 'after:' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      'pastmonth': 'after:' + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    if (dateMap[filters.datePosted]) {
      baseTerms.push(dateMap[filters.datePosted]);
    }
  }
  
  return baseTerms.join(' ');
};

// Extract job data from structured markup
const extractJobData = (item: any, location: string) => {
  const pagemap = item.pagemap || {};
  const metatags = pagemap.metatags?.[0] || {};
  const jobposting = pagemap.jobposting?.[0] || {};
  
  // Extract salary information and convert to INR
  let salary: Salary | undefined = undefined;
  
  // First try to get from structured data
  if (jobposting.basesalary || jobposting.salaryCurrency) {
    salary = {
      min: jobposting.basesalary ? parseInt(jobposting.basesalary) : undefined,
      max: undefined,
      currency: jobposting.salaryCurrency || 'USD',
      period: 'yearly' as const
    };
  }
  
  // If no structured salary data, try to parse from description
  const description = item.snippet || metatags['og:description'] || '';
  if (!salary) {
    salary = parseSalaryFromText(description);
  }
  
  // Convert salary to INR
  if (salary) {
    salary = convertSalaryToINR(salary) || salary;
  }
  
  // Extract company information
  const company = jobposting.hiringOrganization || 
                 metatags['og:site_name'] || 
                 item.displayLink || 
                 'Company';
  
  // Extract job type
  const jobType = jobposting.employmentType || 'Full-time';
  
  // Extract posting date
  const postedDate = jobposting.datePosted || 
                    metatags['article:published_time'] || 
                    new Date().toISOString();
  
  // Extract skills and requirements from job text
  const jobDescription = item.snippet || metatags['og:description'] || '';
  const skills = extractSkillsFromDescription(jobDescription);
  const requirements = extractRequirementsFromDescription(jobDescription);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: jobposting.title || item.title || 'Job Position',
    company: company,
    location: jobposting.jobLocation || location || 'Location not specified',
    type: jobType,
    description: jobDescription,
    requirements: requirements,
    skills: skills,
    salary: salary,
    postedDate: postedDate,
    canAutoApply: true,
    source: 'Google Search',
    applyUrl: item.link,
    industry: jobposting.industry || extractIndustryFromDescription(jobDescription)
  };
};

// Extract skills from job description
const extractSkillsFromDescription = (description: string): string[] => {
  const skillPatterns = [
    /\b(JavaScript|TypeScript|React|Vue|Angular|Node\.js|Python|Java|PHP|Ruby|Go|Rust|Swift|Kotlin|C\+\+|C#)\b/gi,
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|Git|SQL|NoSQL|MongoDB|PostgreSQL|MySQL)\b/gi,
    /\b(HTML|CSS|SASS|SCSS|Tailwind|Bootstrap|jQuery|REST|GraphQL|API)\b/gi,
    /\b(Figma|Adobe|Photoshop|Illustrator|Sketch|Canva|InDesign)\b/gi,
    /\b(Salesforce|HubSpot|Slack|Jira|Confluence|Trello|Asana)\b/gi
  ];
  
  const skills = new Set<string>();
  skillPatterns.forEach(pattern => {
    const matches = description.match(pattern) || [];
    matches.forEach(match => skills.add(match));
  });
  
  return Array.from(skills).slice(0, 6); // Limit to 6 most relevant skills
};

// Extract requirements from job description
const extractRequirementsFromDescription = (description: string): string[] => {
  const requirementPatterns = [
    /(\d+\+?\s*years?\s*(?:of\s*)?experience)/gi,
    /bachelor'?s?\s*degree/gi,
    /master'?s?\s*degree/gi,
    /certification/gi,
    /license/gi
  ];
  
  const requirements = new Set<string>();
  requirementPatterns.forEach(pattern => {
    const matches = description.match(pattern) || [];
    matches.forEach(match => requirements.add(match.trim()));
  });
  
  return Array.from(requirements).slice(0, 5); // Limit to 5 key requirements
};

// Extract industry from description
const extractIndustryFromDescription = (description: string): string => {
  const industryKeywords = Object.keys(INDUSTRY_KEYWORDS);
  for (const industry of industryKeywords) {
    const keywords = INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS];
    if (keywords.some(keyword => description.toLowerCase().includes(keyword.toLowerCase()))) {
      return industry.charAt(0).toUpperCase() + industry.slice(1);
    }
  }
  return 'Other';
};

export const searchJobs = async (
  query: string, 
  location: string = '', 
  searchEngineId: string = DEFAULT_SEARCH_ENGINE_ID,
  filters: SearchFilters = {},
  maxResults: number = 25
): Promise<any[]> => {
  try {
    // Clean and validate the search engine ID
    const cleanedId = extractSearchEngineId(searchEngineId);
    const finalSearchEngineId = cleanedId || DEFAULT_SEARCH_ENGINE_ID;
    
    console.log('Using Search Engine ID:', finalSearchEngineId);
    console.log('Fetching up to', maxResults, 'jobs');
    
    if (!finalSearchEngineId) {
      throw new Error('Search Engine ID is required. Please configure your Google Custom Search Engine ID.');
    }
    
    // Build structured search query
    const structuredQuery = buildStructuredQuery(query, location, filters);
    
    // We'll make multiple API calls to get at least 25 results
    const resultsPerPage = 10; // Google Custom Search API max per request
    const numPages = Math.ceil(maxResults / resultsPerPage);
    const allJobs: any[] = [];
    
    // Try different job sites to maximize results
    const jobSiteGroups = [
      ['linkedin.com/jobs', 'indeed.com', 'glassdoor.com'],
      ['monster.com', 'ziprecruiter.com', 'dice.com'],
      ['angel.co', 'remoteok.io', 'stackoverflow.com/jobs']
    ];
    
    for (let page = 0; page < numPages; page++) {
      const startIndex = page * resultsPerPage + 1;
      
      // Rotate through different job sites for each page
      const jobSites = jobSiteGroups[page % jobSiteGroups.length];
      const siteRestriction = !filters.industry ? 
        ` (${jobSites.map(site => `site:${site}`).join(' OR ')})` : '';
      
      const searchQuery = structuredQuery + siteRestriction;
      const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${finalSearchEngineId}&q=${encodeURIComponent(searchQuery)}&num=${resultsPerPage}&start=${startIndex}`;
      
      console.log(`Fetching page ${page + 1}/${numPages}:`, searchQuery);
      
      const response = await fetch(apiUrl);
      const data: GoogleSearchResult = await response.json();
    
      // Check for API errors in the response
      if (data.error) {
        if (data.error.code === 400) {
          if (data.error.message.includes('invalid argument') || data.error.message.includes('Invalid Value')) {
            throw new Error('Invalid Google Custom Search Engine ID. Please check your configuration or set up a new Custom Search Engine at https://cse.google.com/');
          }
        }
        console.error(`Google API Error on page ${page + 1}:`, data.error.message);
        // Continue to next page even if one fails
        continue;
      }

      if (!response.ok) {
        console.error(`HTTP Error on page ${page + 1}: ${response.status} - ${response.statusText}`);
        // Continue to next page even if one fails
        continue;
      }
      
      // Process results with enhanced data extraction
      const pageJobs = (data.items || []).map(item => extractJobData(item, location));
      allJobs.push(...pageJobs);
      
      // If we have enough jobs, stop fetching
      if (allJobs.length >= maxResults) {
        break;
      }
    }
    
    // Filter, deduplicate and sort results
    const uniqueJobs = Array.from(
      new Map(allJobs.map(job => [`${job.title}-${job.company}`.toLowerCase(), job])).values()
    );
    
    return uniqueJobs
      .filter(job => 
        job.title.toLowerCase().includes('job') || 
        job.title.toLowerCase().includes('manager') ||
        job.title.toLowerCase().includes('developer') ||
        job.title.toLowerCase().includes('engineer') ||
        job.title.toLowerCase().includes('analyst') ||
        job.title.toLowerCase().includes('designer') ||
        job.title.toLowerCase().includes('specialist') ||
        job.title.toLowerCase().includes('lead') ||
        job.title.toLowerCase().includes('director') ||
        job.description.toLowerCase().includes('hiring') ||
        job.description.toLowerCase().includes('position') ||
        job.description.toLowerCase().includes('opportunity')
      )
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
      .slice(0, maxResults); // Ensure we don't exceed the requested limit
    
  } catch (error) {
    console.error('Google search error:', error);
    throw error;
  }
};

// Export enhanced search function with filters
export const searchJobsWithFilters = async (
  query: string,
  location: string = '',
  filters: SearchFilters = {},
  searchEngineId: string = DEFAULT_SEARCH_ENGINE_ID
): Promise<any[]> => {
  return searchJobs(query, location, searchEngineId, filters);
};
