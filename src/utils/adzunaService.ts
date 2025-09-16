import { JobListing } from './jobApiService';

interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string; area: string[] };
  description: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  created: string;
  redirect_url: string;
  category?: { label: string; tag: string };
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
  mean: number;
}

export class AdzunaService {
  // Free tier allows 250 requests per month per app_id
  // Sign up at https://developer.adzuna.com/ to get your own keys
  private static readonly APP_ID = localStorage.getItem('adzuna_app_id') || '';
  private static readonly APP_KEY = localStorage.getItem('adzuna_app_key') || '';
  private static readonly BASE_URL = 'https://api.adzuna.com/v1/api/jobs';
  
  static setCredentials(appId: string, appKey: string) {
    localStorage.setItem('adzuna_app_id', appId);
    localStorage.setItem('adzuna_app_key', appKey);
  }
  
  static hasCredentials(): boolean {
    return !!(this.APP_ID && this.APP_KEY);
  }
  
  static async searchJobs(
    query: string,
    location: string = '',
    country: string = 'in', // Default to India
    page: number = 1,
    resultsPerPage: number = 20
  ): Promise<JobListing[]> {
    if (!this.hasCredentials()) {
      console.warn('Adzuna API credentials not configured');
      return [];
    }
    
    try {
      const params = new URLSearchParams({
        app_id: this.APP_ID,
        app_key: this.APP_KEY,
        results_per_page: resultsPerPage.toString(),
        page: page.toString(),
        what: query,
        where: location,
        sort_by: 'date',
        content_type: 'application/json'
      });
      
      const url = `${this.BASE_URL}/${country}/search/1?${params}`;
      console.log('Fetching from Adzuna:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Adzuna API error: ${response.status}`);
      }
      
      const data: AdzunaResponse = await response.json();
      
      return data.results.map(job => this.transformToJobListing(job));
    } catch (error) {
      console.error('Adzuna API error:', error);
      return [];
    }
  }
  
  private static transformToJobListing(job: AdzunaJob): JobListing {
    const salaryMin = job.salary_min || 0;
    const salaryMax = job.salary_max || 0;
    
    return {
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      requirements: this.extractRequirements(job.description),
      salary: salaryMin || salaryMax ? {
        min: salaryMin,
        max: salaryMax,
        currency: 'INR',
        period: 'yearly' as const
      } : undefined,
      type: this.mapContractType(job.contract_type),
      postedDate: job.created,
      applyUrl: job.redirect_url,
      source: 'Adzuna',
      skills: this.extractSkills(job.description),
      benefits: [],
      companyLogo: undefined,
      companySize: undefined,
      industry: job.category?.label
    };
  }
  
  private static mapContractType(type?: string): JobListing['type'] {
    if (!type) return 'full_time';
    
    const typeMap: Record<string, JobListing['type']> = {
      'permanent': 'full_time',
      'contract': 'contract',
      'part_time': 'part_time',
      'temporary': 'contract'
    };
    
    return typeMap[type.toLowerCase()] || 'full_time';
  }
  
  private static extractSkills(description: string): string[] {
    const skills: string[] = [];
    const text = description.toLowerCase();
    
    const techKeywords = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'nodejs',
      'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'mongodb', 'postgresql', 
      'mysql', 'redis', 'graphql', 'rest api', 'git', 'ci/cd', 'devops',
      'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch',
      'html', 'css', 'sass', 'webpack', 'agile', 'scrum'
    ];
    
    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        skills.push(keyword);
      }
    });
    
    return skills.slice(0, 10); // Limit to 10 skills
  }
  
  private static extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const lines = description.split(/[.\n]/);
    
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (
        lower.includes('experience') ||
        lower.includes('degree') ||
        lower.includes('required') ||
        lower.includes('must have') ||
        lower.includes('years')
      ) {
        const cleaned = line.trim();
        if (cleaned.length > 10 && cleaned.length < 200) {
          requirements.push(cleaned);
        }
      }
    });
    
    return requirements.slice(0, 5);
  }
}