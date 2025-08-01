
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
  };
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  postedDate: string;
  applyUrl: string;
  source: string;
  skills: string[];
  benefits?: string[];
  companyLogo?: string;
  companySize?: string;
  industry?: string;
}

interface JobSearchParams {
  query: string;
  location?: string;
  jobType?: string;
  salaryMin?: number;
  experienceLevel?: string;
  remote?: boolean;
}

// Mock job data for demonstration and fallback
const MOCK_JOBS: JobListing[] = [
  {
    id: "job-1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    description: "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building responsive web applications using React, TypeScript, and modern frontend technologies. The ideal candidate has 5+ years of experience and a passion for creating exceptional user experiences.",
    requirements: [
      "5+ years of React development experience",
      "Strong TypeScript skills",
      "Experience with modern CSS frameworks",
      "Knowledge of state management libraries",
      "Experience with testing frameworks"
    ],
    salary: {
      min: 120000,
      max: 180000,
      currency: "USD",
      period: "yearly"
    },
    type: "Full-time",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://techcorp.com/jobs/senior-frontend-dev",
    source: "TechCorp Careers",
    skills: ["React", "TypeScript", "CSS", "JavaScript", "Redux", "Jest"],
    benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options"],
    companySize: "500-1000 employees",
    industry: "Technology"
  },
  {
    id: "job-2",
    title: "Product Manager",
    company: "InnovateLabs",
    location: "New York, NY",
    description: "Join our product team as a Product Manager to drive the development of cutting-edge software solutions. You'll work closely with engineering, design, and business teams to define product strategy and roadmap. We're looking for someone with strong analytical skills and experience in B2B SaaS.",
    requirements: [
      "3+ years of product management experience",
      "Experience with B2B SaaS products",
      "Strong analytical and problem-solving skills",
      "Excellent communication abilities",
      "Experience with agile methodologies"
    ],
    salary: {
      min: 110000,
      max: 160000,
      currency: "USD",
      period: "yearly"
    },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://innovatelabs.com/careers/product-manager",
    source: "InnovateLabs Jobs",
    skills: ["Product Strategy", "Analytics", "Agile", "Roadmapping", "User Research"],
    benefits: ["Health Insurance", "Dental", "Vision", "Flexible PTO"],
    companySize: "100-500 employees",
    industry: "Software"
  },
  {
    id: "job-3",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    description: "We're seeking a talented Full Stack Engineer to help build our next-generation platform. You'll work on both frontend and backend systems, collaborating with a small but mighty team. Perfect opportunity for someone who loves variety and wants to make a significant impact.",
    requirements: [
      "4+ years of full stack development",
      "Proficiency in Node.js and React",
      "Database design experience",
      "API development skills",
      "Cloud platform experience (AWS/GCP)"
    ],
    salary: {
      min: 90000,
      max: 140000,
      currency: "USD",
      period: "yearly"
    },
    type: "Remote",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://startupxyz.com/jobs/fullstack-engineer",
    source: "StartupXYZ Careers",
    skills: ["Node.js", "React", "PostgreSQL", "AWS", "Docker", "REST API"],
    benefits: ["Equity", "Health Insurance", "Remote Work", "Learning Budget"],
    companySize: "10-50 employees",
    industry: "FinTech"
  },
  {
    id: "job-4",
    title: "UX/UI Designer",
    company: "DesignStudio Pro",
    location: "Los Angeles, CA",
    description: "Join our creative team as a UX/UI Designer to craft beautiful and intuitive user experiences. You'll work on diverse projects ranging from mobile apps to web platforms, collaborating with product managers and developers to bring ideas to life.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency in Figma and Adobe Creative Suite",
      "Strong portfolio showcasing mobile and web design",
      "Understanding of design systems",
      "User research experience"
    ],
    salary: {
      min: 80000,
      max: 120000,
      currency: "USD",
      period: "yearly"
    },
    type: "Full-time",
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://designstudiopro.com/careers/ux-ui-designer",
    source: "DesignStudio Careers",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Design Systems"],
    benefits: ["Health Insurance", "Creative Days", "Conference Budget", "Gym Membership"],
    companySize: "50-100 employees",
    industry: "Design Agency"
  },
  {
    id: "job-5",
    title: "Data Scientist",
    company: "DataCorp Analytics",
    location: "Boston, MA",
    description: "We're looking for a Data Scientist to join our analytics team and help drive data-driven decision making across the organization. You'll work with large datasets, build predictive models, and present insights to stakeholders.",
    requirements: [
      "Masters in Data Science, Statistics, or related field",
      "3+ years of data science experience",
      "Proficiency in Python and R",
      "Experience with machine learning frameworks",
      "Strong statistical analysis skills"
    ],
    salary: {
      min: 100000,
      max: 150000,
      currency: "USD",
      period: "yearly"
    },
    type: "Full-time",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://datacorp.com/jobs/data-scientist",
    source: "DataCorp Careers",
    skills: ["Python", "R", "Machine Learning", "SQL", "Tableau", "Statistics"],
    benefits: ["Health Insurance", "Research Time", "Conference Attendance", "Stock Options"],
    companySize: "200-500 employees",
    industry: "Analytics"
  },
  {
    id: "job-6",
    title: "Sales Manager",
    company: "TechSales India",
    location: "Pune, India",
    description: "Join our dynamic sales team as a Sales Manager in Pune. You'll lead a team of sales representatives, develop sales strategies, and drive revenue growth in the Indian market. We're looking for someone with proven sales experience and strong leadership skills.",
    requirements: [
      "5+ years of sales experience",
      "Team management experience",
      "Strong communication skills",
      "Experience in B2B sales",
      "Understanding of Indian market"
    ],
    salary: {
      min: 800000,
      max: 1500000,
      currency: "INR",
      period: "yearly"
    },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://techsalesindia.com/careers/sales-manager",
    source: "TechSales India Careers",
    skills: ["Sales", "Team Management", "B2B Sales", "CRM", "Leadership", "Negotiation"],
    benefits: ["Health Insurance", "Performance Bonus", "Travel Allowance", "Phone Allowance"],
    companySize: "100-500 employees",
    industry: "Technology Sales"
  },
  {
    id: "job-7",
    title: "Regional Sales Manager",
    company: "GlobalCorp",
    location: "Mumbai, India",
    description: "We are seeking an experienced Regional Sales Manager to oversee our sales operations across western India. You will be responsible for achieving sales targets, managing key accounts, and developing new business opportunities.",
    requirements: [
      "7+ years of sales management experience",
      "Proven track record of achieving targets",
      "Experience with enterprise sales",
      "MBA preferred",
      "Fluency in Hindi and English"
    ],
    salary: {
      min: 1200000,
      max: 2000000,
      currency: "INR",
      period: "yearly"
    },
    type: "Full-time",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://globalcorp.com/jobs/regional-sales-manager",
    source: "GlobalCorp Careers",
    skills: ["Enterprise Sales", "Account Management", "Business Development", "Team Leadership"],
    benefits: ["Health Insurance", "Variable Pay", "Car Allowance", "Stock Options"],
    companySize: "1000+ employees",
    industry: "Enterprise Software"
  },
  {
    id: "job-8",
    title: "Inside Sales Manager",
    company: "StartupIndia",
    location: "Pune, India",
    description: "Looking for a dynamic Inside Sales Manager to lead our inside sales team. You'll be responsible for driving sales through phone and digital channels, managing the sales pipeline, and coaching team members to achieve targets.",
    requirements: [
      "4+ years of inside sales experience",
      "Experience with sales automation tools",
      "Strong analytical skills",
      "Team leadership experience",
      "Experience with SaaS products"
    ],
    salary: {
      min: 600000,
      max: 1000000,
      currency: "INR",
      period: "yearly"
    },
    type: "Full-time",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://startupindia.com/careers/inside-sales-manager",
    source: "StartupIndia Jobs",
    skills: ["Inside Sales", "CRM", "Sales Analytics", "Team Management", "SaaS Sales"],
    benefits: ["Health Insurance", "Flexible Hours", "Performance Bonus", "Learning Budget"],
    companySize: "50-200 employees",
    industry: "SaaS"
  },
  {
    id: "job-9",
    title: "Software Engineer",
    company: "InfoTech Solutions",
    location: "Pune, India",
    description: "Join our engineering team as a Software Engineer in Pune. You'll work on cutting-edge software solutions, collaborate with cross-functional teams, and contribute to our growing product portfolio.",
    requirements: [
      "3+ years of software development experience",
      "Strong programming skills in Java or Python",
      "Experience with web technologies",
      "Knowledge of databases",
      "Good problem-solving skills"
    ],
    salary: {
      min: 600000,
      max: 1200000,
      currency: "INR",
      period: "yearly"
    },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://infotech.com/careers/software-engineer",
    source: "InfoTech Careers",
    skills: ["Java", "Python", "Web Development", "SQL", "Problem Solving"],
    benefits: ["Health Insurance", "Training Programs", "Flexible Work", "Team Outings"],
    companySize: "200-1000 employees",
    industry: "Information Technology"
  }
];

export class JobApiService {
  private static readonly JSEARCH_API_KEY = ''; // API key would need to be configured
  private static readonly JSEARCH_BASE_URL = 'https://jsearch.p.rapidapi.com';

  static async searchJobs(params: JobSearchParams): Promise<JobListing[]> {
    console.log('Searching jobs with params:', params);
    
    // Simulate realistic API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Try JSearch API first if API key is available
    if (this.JSEARCH_API_KEY) {
      try {
        return await this.searchWithJSearchAPI(params);
      } catch (error) {
        console.error('JSearch API failed, falling back to mock data:', error);
      }
    }

    // Enhanced mock data search with realistic results
    return this.searchMockJobs(params);
  }

  private static async searchWithJSearchAPI(params: JobSearchParams): Promise<JobListing[]> {
    const { query, location = '', jobType, salaryMin, remote } = params;
    
    const searchQuery = `${query} ${location}`.trim();
    const url = `${this.JSEARCH_BASE_URL}/search`;
    
    const queryParams = new URLSearchParams({
      query: searchQuery,
      page: '1',
      num_pages: '3',
      date_posted: 'month'
    });

    if (remote) {
      queryParams.append('remote_jobs_only', 'true');
    }

    const response = await fetch(`${url}?${queryParams}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': this.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.data || []).map((job: any) => this.transformJSearchJob(job));
  }

  private static transformJSearchJob(job: any): JobListing {
    return {
      id: job.job_id || Math.random().toString(36).substr(2, 9),
      title: job.job_title || 'Job Position',
      company: job.employer_name || 'Company',
      location: job.job_city && job.job_state 
        ? `${job.job_city}, ${job.job_state}` 
        : job.job_country || 'Location',
      description: job.job_description || '',
      requirements: job.job_highlights?.Qualifications || [],
      salary: job.job_min_salary && job.job_max_salary ? {
        min: job.job_min_salary,
        max: job.job_max_salary,
        currency: 'USD',
        period: 'yearly'
      } : undefined,
      type: this.mapJobType(job.job_employment_type),
      postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
      applyUrl: job.job_apply_link || '#',
      source: 'JSearch API',
      skills: job.job_required_skills || [],
      benefits: job.job_highlights?.Benefits || [],
      companyLogo: job.employer_logo,
      industry: job.job_publisher || 'Various'
    };
  }

  private static mapJobType(type: string): JobListing['type'] {
    const typeMap: Record<string, JobListing['type']> = {
      'FULLTIME': 'Full-time',
      'PARTTIME': 'Part-time',
      'CONTRACT': 'Contract',
      'INTERN': 'Internship'
    };
    return typeMap[type?.toUpperCase()] || 'Full-time';
  }

  private static searchMockJobs(params: JobSearchParams): JobListing[] {
    const { query, location, jobType, salaryMin, remote } = params;
    
    let filteredJobs = [...MOCK_JOBS];

    // Filter by query (title, company, skills, description)
    if (query) {
      const queryLower = query.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(queryLower) ||
        job.company.toLowerCase().includes(queryLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(queryLower)) ||
        job.description.toLowerCase().includes(queryLower) ||
        job.industry?.toLowerCase().includes(queryLower)
      );
    }

    // Filter by location
    if (location) {
      const locationLower = location.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(locationLower)
      );
    }

    // Filter by job type
    if (jobType) {
      filteredJobs = filteredJobs.filter(job => 
        job.type.toLowerCase() === jobType.toLowerCase()
      );
    }

    // Filter by remote
    if (remote) {
      filteredJobs = filteredJobs.filter(job => 
        job.type === 'Remote' || job.location.toLowerCase().includes('remote')
      );
    }

    // Filter by salary
    if (salaryMin && filteredJobs.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        job.salary && job.salary.min && job.salary.min >= salaryMin
      );
    }

    // Sort by relevance (recently posted first)
    filteredJobs.sort((a, b) => 
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );

    return filteredJobs;
  }

  static extractJobKeywords(jobDescription: string, jobTitle: string): string[] {
    const text = `${jobTitle} ${jobDescription}`.toLowerCase();
    const keywords = new Set<string>();

    // Common tech keywords
    const techKeywords = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node',
      'python', 'java', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
      'graphql', 'rest', 'api', 'microservices', 'devops',
      'machine learning', 'ai', 'data science', 'analytics',
      'product management', 'agile', 'scrum', 'design', 'ux', 'ui'
    ];

    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        keywords.add(keyword);
      }
    });

    // Extract words from job title
    jobTitle.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)) {
        keywords.add(word);
      }
    });

    return Array.from(keywords);
  }

  static async searchJobsByWebsite(websiteUrl: string, position: string, location?: string): Promise<JobListing[]> {
    console.log(`Searching for ${position} jobs on ${websiteUrl}`);
    
    // For now, return filtered mock jobs based on the search criteria
    // In a real implementation, you would scrape or use specific APIs for each job board
    return this.searchMockJobs({
      query: position,
      location: location
    });
  }
}
