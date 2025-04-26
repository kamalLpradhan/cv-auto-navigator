
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Search, BriefcaseBusiness, MapPin, Filter, CheckCircle, AlertCircle, Globe, Loader2, Clock } from 'lucide-react';
import { applyToJob } from '@/utils/applicationService';
import { debounce } from 'lodash';
import { searchJobs } from '@/utils/googleSearchService';
import { useAuth } from '@/providers/AuthProvider';

// Job types for the interface
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: string;
  canAutoApply: boolean;
  source?: string;
  sourceId?: string;
  applyUrl?: string;
}

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isApplying, setIsApplying] = useState<Record<string, boolean>>({});
  const [appliedJobs, setAppliedJobs] = useState<Record<string, { success: boolean; message?: string }>>({});
  const [searchEngineId, setSearchEngineId] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Effect to get or prompt for Search Engine ID
  useEffect(() => {
    const storedSearchEngineId = localStorage.getItem('searchEngineId');
    if (storedSearchEngineId) {
      setSearchEngineId(storedSearchEngineId);
    } else {
      // Show prompt to enter Search Engine ID
      const id = prompt('Please enter your Google Custom Search Engine ID:');
      if (id) {
        localStorage.setItem('searchEngineId', id);
        setSearchEngineId(id);
      }
    }
  }, []);

  const performSearch = useCallback(async (term: string, loc: string) => {
    if (!term && !loc) return;
    
    setIsSearching(true);
    try {
      if (!searchEngineId) {
        toast({
          title: "Search Engine ID Required",
          description: "Please set up your Google Custom Search Engine ID",
          variant: "destructive",
        });
        return;
      }

      const searchResults = await searchJobs(term, loc, searchEngineId);
      setSearchResults(searchResults);
      
      if (searchResults.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "An error occurred while searching for jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [toast, searchEngineId]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string, loc: string) => {
      performSearch(term, loc);
    }, 500),
    [performSearch]
  );

  // Effect to trigger search when input changes
  useEffect(() => {
    debouncedSearch(searchTerm, location);
    return () => debouncedSearch.cancel();
  }, [searchTerm, location, debouncedSearch]);

  const handleApply = async (job: Job) => {
    // Set applying state for this job
    setIsApplying(prev => ({ ...prev, [job.id]: true }));
    
    try {
      // Use the applyToJob function from applicationService
      const result = await applyToJob(job);
      
      // Update the applied jobs state
      setAppliedJobs(prev => ({
        ...prev,
        [job.id]: { success: true }
      }));
      
      // Show success toast
      toast({
        title: "Application Submitted",
        description: `Your application for ${job.title} at ${job.company} was submitted successfully.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Application error:", error);
      
      // Update the applied jobs state with error
      setAppliedJobs(prev => ({
        ...prev,
        [job.id]: { success: false, message: "Failed to apply" }
      }));
      
      // Show error toast
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Reset applying state
      setIsApplying(prev => ({ ...prev, [job.id]: false }));
    }
  };

  // Add a function to update Search Engine ID
  const updateSearchEngineId = () => {
    const id = prompt('Please enter your Google Custom Search Engine ID:', searchEngineId);
    if (id) {
      localStorage.setItem('searchEngineId', id);
      setSearchEngineId(id);
      toast({
        title: "Search Engine ID Updated",
        description: "Your Google Custom Search Engine ID has been updated",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="glass-panel mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="job-search" className="text-sm font-medium mb-1.5">
                Job Title, Skills, or Company
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="job-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Product Manager, Growth Manager"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="location-search" className="text-sm font-medium mb-1.5">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="location-search"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, Remote"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          {!searchEngineId && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm">
              <p className="text-amber-800 dark:text-amber-300">
                Please set your Google Custom Search Engine ID to enable job searching.
              </p>
            </div>
          )}
          {searchEngineId && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={updateSearchEngineId}
              >
                Update Search Engine ID
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isSearching && (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Searching for jobs...</p>
          </div>
        </div>
      )}

      {searchResults.length > 0 && !isSearching && (
        <div className="space-y-4 animate-fade-in">
          {searchResults.map((job) => (
            <Card key={job.id} className="overflow-hidden card-hover">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <BriefcaseBusiness size={15} />
                        <span>{job.company}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                        <MapPin size={15} />
                        <span>{job.location}</span>
                        {job.source && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                            <Globe size={15} />
                            <span>{job.source}</span>
                          </>
                        )}
                        <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                        <Clock size={15} />
                        <span>{formatDate(job.postedDate)}</span>
                      </div>
                      
                      <h3 className="text-xl font-medium">{job.title}</h3>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {job.type}
                        </span>
                        
                        {job.canAutoApply ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle size={12} className="mr-1" />
                            Auto-Apply Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            <AlertCircle size={12} className="mr-1" />
                            Manual Application
                          </span>
                        )}
                        
                        {job.source === 'Google Search' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            Google Search
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:text-right">
                      {appliedJobs[job.id] ? (
                        <div className={`text-sm py-1 px-3 rounded ${
                          appliedJobs[job.id].success 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {appliedJobs[job.id].success ? 'Applied' : 'Application Failed'}
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleApply(job)}
                          disabled={isApplying[job.id]}
                          className="mt-2 md:mt-0"
                        >
                          {isApplying[job.id] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Applying...
                            </>
                          ) : 'Apply Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-3">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {job.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {searchResults.length === 0 && !isSearching && (
        <div className="text-center py-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Search className="text-muted-foreground" size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or location
          </p>
        </div>
      )}
    </div>
  );
};

export default JobSearch;
