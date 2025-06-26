
import { searchJobs as googleSearchJobs } from './googleSearchService';

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  source: string;
  postedDate: string;
  salary?: string;
  type?: string;
}

interface JobSearchParams {
  position: string;
  location?: string;
  website: string;
  websiteUrl: string;
}

export class JobSearchService {
  static async searchJobsOnWebsite(params: JobSearchParams): Promise<JobResult[]> {
    const { position, location = '', website, websiteUrl } = params;
    
    try {
      console.log(`Searching for ${position} jobs on ${website}`);
      
      // For LinkedIn, Indeed, and other major job sites, we'll use Google Custom Search
      // to find jobs specifically on those domains
      const searchQuery = `${position} jobs site:${this.extractDomain(websiteUrl)}`;
      
      const results = await googleSearchJobs(searchQuery, location);
      
      return results.map(job => ({
        ...job,
        source: website,
        id: `${website.toLowerCase()}-${job.id}`
      }));
      
    } catch (error) {
      console.error(`Error searching jobs on ${website}:`, error);
      return [];
    }
  }
  
  static extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }
  
  static async searchMultipleWebsites(
    websites: Array<{ name: string; url: string; positions: string[] }>,
    location?: string
  ): Promise<{ website: string; jobs: JobResult[] }[]> {
    const searchPromises = websites.flatMap(website =>
      website.positions.map(async position => {
        const jobs = await this.searchJobsOnWebsite({
          position,
          location,
          website: website.name,
          websiteUrl: website.url
        });
        return { website: website.name, position, jobs };
      })
    );
    
    const results = await Promise.all(searchPromises);
    
    // Group results by website
    const groupedResults: { [key: string]: JobResult[] } = {};
    results.forEach(result => {
      if (!groupedResults[result.website]) {
        groupedResults[result.website] = [];
      }
      groupedResults[result.website].push(...result.jobs);
    });
    
    return Object.entries(groupedResults).map(([website, jobs]) => ({
      website,
      jobs: this.removeDuplicateJobs(jobs)
    }));
  }
  
  static removeDuplicateJobs(jobs: JobResult[]): JobResult[] {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  
  static extractKeywords(jobDescription: string, positions: string[]): string[] {
    const keywords = new Set<string>();
    const text = jobDescription.toLowerCase();
    
    // Add position-related keywords
    positions.forEach(position => {
      const positionWords = position.toLowerCase().split(' ');
      positionWords.forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    });
    
    // Common tech keywords to look for
    const techKeywords = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node',
      'python', 'java', 'php', 'ruby', 'go', 'rust', 'swift',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'mongodb',
      'postgresql', 'mysql', 'redis', 'graphql', 'rest', 'api'
    ];
    
    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        keywords.add(keyword);
      }
    });
    
    return Array.from(keywords);
  }
}
