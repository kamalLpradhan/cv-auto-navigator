import { JobListing, JobSearchParams } from './jobApiService';
import { AdzunaService } from './adzunaService';

interface RemoteOKJob {
  id: string;
  slug: string;
  company: string;
  company_logo: string;
  position: string;
  tags: string[];
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  url: string;
  date: string;
}

export class EnhancedJobSearchService {
  // RemoteOK API - Free, no authentication needed
  private static readonly REMOTEOK_API_URL = 'https://remoteok.com/api';
  
  // Reed API - Free tier available, sign up at https://www.reed.co.uk/developers/jobseeker
  private static readonly REED_API_KEY = localStorage.getItem('reed_api_key') || '';
  private static readonly REED_API_URL = 'https://www.reed.co.uk/api/1.0/search';
  
  static setReedApiKey(apiKey: string) {
    localStorage.setItem('reed_api_key', apiKey);
  }
  
  static async searchAllSources(params: JobSearchParams): Promise<JobListing[]> {
    const allJobs: JobListing[] = [];
    const searchPromises: Promise<JobListing[]>[] = [];
    
    // Search Adzuna if credentials are available
    if (AdzunaService.hasCredentials()) {
      searchPromises.push(
        AdzunaService.searchJobs(params.query, params.location || '', 'in', 1, 30)
          .catch(err => {
            console.error('Adzuna search failed:', err);
            return [];
          })
      );
    }
    
    // Search RemoteOK for remote jobs
    if (!params.location || params.location.toLowerCase().includes('remote') || params.remote) {
      searchPromises.push(
        this.searchRemoteOK(params.query)
          .catch(err => {
            console.error('RemoteOK search failed:', err);
            return [];
          })
      );
    }
    
    // Search Reed if API key is available
    if (this.REED_API_KEY) {
      searchPromises.push(
        this.searchReed(params)
          .catch(err => {
            console.error('Reed search failed:', err);
            return [];
          })
      );
    }
    
    // Search using existing Google Custom Search
    searchPromises.push(
      this.searchWithGoogle(params)
        .catch(err => {
          console.error('Google search failed:', err);
          return [];
        })
    );
    
    // Wait for all searches to complete
    const results = await Promise.all(searchPromises);
    
    // Combine all results
    results.forEach(jobList => {
      allJobs.push(...jobList);
    });
    
    // Remove duplicates based on title and company
    const uniqueJobs = this.removeDuplicates(allJobs);
    
    // Sort by posted date (newest first)
    uniqueJobs.sort((a, b) => {
      const dateA = new Date(a.postedDate).getTime();
      const dateB = new Date(b.postedDate).getTime();
      return dateB - dateA;
    });
    
    // Apply filters
    return this.applyFilters(uniqueJobs, params);
  }
  
  private static async searchRemoteOK(query: string): Promise<JobListing[]> {
    try {
      const response = await fetch(`${this.REMOTEOK_API_URL}?tag=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`RemoteOK API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // First item is metadata, skip it
      const jobs = data.slice(1) as RemoteOKJob[];
      
      return jobs.slice(0, 20).map(job => this.transformRemoteOKJob(job));
    } catch (error) {
      console.error('RemoteOK API error:', error);
      return [];
    }
  }
  
  private static transformRemoteOKJob(job: RemoteOKJob): JobListing {
    return {
      id: job.id || job.slug,
      title: job.position,
      company: job.company,
      location: job.location || 'Remote',
      description: job.description,
      requirements: this.extractRequirements(job.description),
      salary: job.salary_min || job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: 'USD',
        period: 'yearly' as const
      } : undefined,
      type: 'full_time',
      postedDate: job.date,
      applyUrl: job.url,
      source: 'RemoteOK',
      skills: job.tags || [],
      companyLogo: job.company_logo
    };
  }
  
  private static async searchReed(params: JobSearchParams): Promise<JobListing[]> {
    try {
      const queryParams = new URLSearchParams({
        keywords: params.query,
        locationName: params.location || '',
        minimumSalary: params.salaryMin?.toString() || '0',
        resultsToTake: '30'
      });
      
      const response = await fetch(`${this.REED_API_URL}?${queryParams}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(this.REED_API_KEY + ':')
        }
      });
      
      if (!response.ok) {
        throw new Error(`Reed API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.results.map((job: any) => this.transformReedJob(job));
    } catch (error) {
      console.error('Reed API error:', error);
      return [];
    }
  }
  
  private static transformReedJob(job: any): JobListing {
    return {
      id: job.jobId.toString(),
      title: job.jobTitle,
      company: job.employerName,
      location: job.locationName,
      description: job.jobDescription,
      requirements: [],
      salary: job.minimumSalary || job.maximumSalary ? {
        min: job.minimumSalary,
        max: job.maximumSalary,
        currency: 'GBP',
        period: 'yearly' as const
      } : undefined,
      type: this.mapJobType(job.jobType),
      postedDate: job.date,
      applyUrl: job.jobUrl,
      source: 'Reed',
      skills: [],
      companyLogo: job.employerLogoUrl
    };
  }
  
  private static async searchWithGoogle(params: JobSearchParams): Promise<JobListing[]> {
    // Import the existing Google search service
    const { searchJobs } = await import('./googleSearchService');
    
    try {
      const results = await searchJobs(params.query, params.location || '');
      return results.map(job => ({
        ...job,
        type: this.mapJobType(job.type || 'Full-time')
      }));
    } catch (error) {
      console.error('Google search error:', error);
      return [];
    }
  }
  
  private static mapJobType(type: string): JobListing['type'] {
    const typeMap: Record<string, JobListing['type']> = {
      'full-time': 'full_time',
      'full_time': 'full_time',
      'fulltime': 'full_time',
      'part-time': 'part_time',
      'part_time': 'part_time',
      'parttime': 'part_time',
      'contract': 'contract',
      'contractor': 'contract',
      'internship': 'internship',
      'intern': 'internship',
      'temporary': 'temporary',
      'temp': 'temporary'
    };
    
    const normalized = type.toLowerCase().replace(/\s+/g, '');
    return typeMap[normalized] || 'full_time';
  }
  
  private static removeDuplicates(jobs: JobListing[]): JobListing[] {
    const seen = new Set<string>();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  
  private static applyFilters(jobs: JobListing[], params: JobSearchParams): JobListing[] {
    let filtered = [...jobs];
    
    // Filter by job type
    if (params.jobType && params.jobType !== 'all') {
      const mappedType = this.mapJobType(params.jobType);
      filtered = filtered.filter(job => job.type === mappedType);
    }
    
    // Filter by minimum salary
    if (params.salaryMin && params.salaryMin > 0) {
      filtered = filtered.filter(job => {
        if (!job.salary) return false;
        const minSalary = job.salary.min || job.salary.max || 0;
        // Convert to yearly INR for comparison
        let yearlyINR = minSalary;
        
        if (job.salary.currency !== 'INR') {
          // Simple conversion rates (should be updated with real rates)
          const conversionRates: Record<string, number> = {
            'USD': 83,
            'GBP': 105,
            'EUR': 90
          };
          yearlyINR = minSalary * (conversionRates[job.salary.currency] || 83);
        }
        
        if (job.salary.period === 'monthly') {
          yearlyINR *= 12;
        } else if (job.salary.period === 'hourly') {
          yearlyINR *= 2080; // 40 hours/week * 52 weeks
        } else if (job.salary.period === 'weekly') {
          yearlyINR *= 52;
        }
        
        return yearlyINR >= params.salaryMin;
      });
    }
    
    // Filter by experience level
    if (params.experienceLevel) {
      filtered = filtered.filter(job => {
        const desc = job.description.toLowerCase();
        const title = job.title.toLowerCase();
        
        switch (params.experienceLevel) {
          case 'entry':
            return desc.includes('entry') || desc.includes('junior') || 
                   desc.includes('0-2 years') || title.includes('junior');
          case 'mid':
            return desc.includes('mid') || desc.includes('3-5 years') || 
                   !desc.includes('senior') && !desc.includes('junior');
          case 'senior':
            return desc.includes('senior') || desc.includes('lead') || 
                   desc.includes('5+ years') || title.includes('senior');
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }
  
  private static extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const lines = description.split(/[.\n]/);
    
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (
        lower.includes('required') ||
        lower.includes('must have') ||
        lower.includes('experience') ||
        lower.includes('degree') ||
        lower.includes('years')
      ) {
        const cleaned = line.trim().replace(/<[^>]*>/g, ''); // Remove HTML tags
        if (cleaned.length > 10 && cleaned.length < 200) {
          requirements.push(cleaned);
        }
      }
    });
    
    return requirements.slice(0, 5);
  }
}