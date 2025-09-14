
import { useState, useEffect, useCallback } from 'react';
import { JobApiService } from '@/utils/jobApiService';
import { useToast } from '@/hooks/use-toast';

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
    period: 'hourly' | 'monthly' | 'yearly' | 'weekly';
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

interface UseRealtimeJobSearchParams {
  query: string;
  location?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useRealtimeJobSearch = ({
  query,
  location,
  autoRefresh = true,
  refreshInterval = 300000 // 5 minutes
}: UseRealtimeJobSearchParams) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);
  const [newJobsCount, setNewJobsCount] = useState(0);
  const { toast } = useToast();

  const searchJobs = useCallback(async (showToast = false) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await JobApiService.searchJobs({
        query,
        location
      });

      const previousJobIds = jobs.map(job => job.id);
      const newJobs = results.filter(job => !previousJobIds.includes(job.id));
      
      if (newJobs.length > 0 && jobs.length > 0) {
        setNewJobsCount(prev => prev + newJobs.length);
        
        if (showToast) {
          toast({
            title: `${newJobs.length} New Jobs Found!`,
            description: `Updated search results for "${query}"`,
          });
        }
      }

      setJobs(results);
      setLastSearchTime(new Date());
    } catch (error) {
      console.error('Real-time job search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [query, location, jobs, toast]);

  useEffect(() => {
    if (query.trim()) {
      searchJobs();
    }
  }, [query, location]);

  useEffect(() => {
    if (!autoRefresh || !query.trim()) return;

    const interval = setInterval(() => {
      searchJobs(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, searchJobs, query]);

  useEffect(() => {
    const handleAutoRefresh = () => searchJobs(true);
    const handleManualRefresh = () => searchJobs(false);

    window.addEventListener('autoJobRefresh', handleAutoRefresh);
    window.addEventListener('manualJobRefresh', handleManualRefresh);

    return () => {
      window.removeEventListener('autoJobRefresh', handleAutoRefresh);
      window.removeEventListener('manualJobRefresh', handleManualRefresh);
    };
  }, [searchJobs]);

  const markAsViewed = () => {
    setNewJobsCount(0);
  };

  return {
    jobs,
    isSearching,
    lastSearchTime,
    newJobsCount,
    searchJobs: () => searchJobs(false),
    markAsViewed
  };
};
