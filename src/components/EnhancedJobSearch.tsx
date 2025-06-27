
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  ExternalLink,
  Building,
  Users,
  Star,
  TrendingUp,
  Filter,
  Loader2
} from 'lucide-react';
import { JobApiService } from '@/utils/jobApiService';
import { applyToJob } from '@/utils/applicationService';
import { debounce } from 'lodash';

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

const EnhancedJobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [applyingJobs, setApplyingJobs] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await JobApiService.searchJobs({
        query: searchQuery,
        location: location || undefined,
        jobType: jobType || undefined,
        salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
        remote: remoteOnly
      });

      setJobs(results);
      
      if (results.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria or keywords",
        });
      } else {
        toast({
          title: `Found ${results.length} jobs`,
          description: "Showing relevant positions based on your search",
        });
      }
    } catch (error) {
      console.error('Job search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, location, jobType, salaryMin, remoteOnly, toast]);

  const debouncedSearch = useCallback(
    debounce(() => {
      if (searchQuery.trim()) {
        performSearch();
      }
    }, 800),
    [performSearch]
  );

  useEffect(() => {
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchQuery, location, jobType, salaryMin, remoteOnly, debouncedSearch]);

  const toggleJobExpansion = (jobId: string) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedJobs(newExpanded);
  };

  const handleApplyToJob = async (job: JobListing) => {
    setApplyingJobs(prev => new Set([...prev, job.id]));
    
    try {
      await applyToJob({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        source: job.source,
        applyUrl: job.applyUrl
      });
      
      toast({
        title: "Application Submitted",
        description: `Applied to ${job.title} at ${job.company}`,
      });
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApplyingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(job.id);
        return newSet;
      });
    }
  };

  const formatSalary = (salary: JobListing['salary']) => {
    if (!salary) return null;
    const { min, max, currency, period } = salary;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} per ${period}`;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Enhanced Job Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search-query">Job Title or Keywords</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Frontend Developer, React"
                  className="pl-9"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, Remote"
                  className="pl-9"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="job-type">Job Type</Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any type</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="salary-min">Min Salary ($)</Label>
              <Input
                id="salary-min"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="80000"
                className="w-24"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="remote-only"
                checked={remoteOnly}
                onCheckedChange={setRemoteOnly}
              />
              <Label htmlFor="remote-only">Remote only</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {isSearching && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Searching for jobs...</span>
          </div>
        </div>
      )}

      {jobs.length > 0 && !isSearching && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
            </h3>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Sorted by relevance
            </Badge>
          </div>
          
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span className="font-medium">{job.company}</span>
                          {job.companySize && (
                            <>
                              <span>•</span>
                              <Users className="h-3 w-3" />
                              <span className="text-sm">{job.companySize}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>

                    {/* Job Details */}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(job.postedDate)}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatSalary(job.salary)}
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {job.source}
                      </Badge>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.skills.slice(0, 6).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 6} more
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>
                        {expandedJobs.has(job.id) 
                          ? job.description 
                          : `${job.description.substring(0, 200)}...`
                        }
                      </p>
                      {job.description.length > 200 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleJobExpansion(job.id)}
                          className="mt-2 p-0 h-auto"
                        >
                          {expandedJobs.has(job.id) ? 'Show less' : 'Show more'}
                        </Button>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {expandedJobs.has(job.id) && (
                      <div className="space-y-3 mb-4">
                        <Separator />
                        {job.requirements.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Requirements:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {job.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {job.benefits && job.benefits.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Benefits:</h4>
                            <div className="flex flex-wrap gap-1">
                              {job.benefits.map((benefit, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 lg:min-w-[140px]">
                    <Button
                      onClick={() => handleApplyToJob(job)}
                      disabled={applyingJobs.has(job.id)}
                      className="w-full"
                    >
                      {applyingJobs.has(job.id) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        'Quick Apply'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(job.applyUrl, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isSearching && jobs.length === 0 && searchQuery && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="mb-4">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or keywords
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedJobSearch;
