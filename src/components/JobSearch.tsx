import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Search, BriefcaseBusiness, MapPin, Filter, CheckCircle, AlertCircle, Globe, Loader2, Clock } from 'lucide-react';
import { applyToJob, fetchGoogleJobs, fetchJobs } from '@/utils/applicationService';

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
  const [isLoadingGoogleJobs, setIsLoadingGoogleJobs] = useState(false);
  const { toast } = useToast();

  // Demo jobs data
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'We are looking for a Frontend Developer with React experience to join our team.',
      requirements: ['3+ years React experience', 'TypeScript knowledge', 'CSS expertise'],
      skills: ['React', 'TypeScript', 'CSS', 'HTML'],
      postedDate: '2023-07-15',
      canAutoApply: true
    },
    {
      id: '2',
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Join our design team to create stunning user experiences.',
      requirements: ['Portfolio showcasing UI/UX work', 'Experience with Figma', 'Understanding of user research'],
      skills: ['Figma', 'UI/UX', 'User Research', 'Prototyping'],
      postedDate: '2023-07-20',
      canAutoApply: false
    },
    {
      id: '3',
      title: 'Backend Engineer',
      company: 'DataSystems',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build scalable backend services for our growing platform.',
      requirements: ['Node.js expertise', 'Database design', 'API development'],
      skills: ['Node.js', 'MongoDB', 'Express', 'REST APIs'],
      postedDate: '2023-07-22',
      canAutoApply: true
    }
  ];

  // Load initial Google jobs on component mount
  useEffect(() => {
    const loadInitialGoogleJobs = async () => {
      setIsLoadingGoogleJobs(true);
      try {
        // Default to product manager and growth manager jobs
        const googleJobs = await fetchGoogleJobs('product manager, growth manager');
        setSearchResults([...mockJobs, ...googleJobs]);
      } catch (error) {
        console.error("Error fetching Google jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load Google jobs. Please try again later.",
          variant: "destructive",
        });
        setSearchResults(mockJobs);
      } finally {
        setIsLoadingGoogleJobs(false);
      }
    };

    loadInitialGoogleJobs();
  }, [toast]);

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      // Default to product manager, growth manager if no search term
      const effectiveSearchTerm = searchTerm || 'product manager, growth manager';
      
      // Fetch Google jobs based on search criteria
      const googleJobs = await fetchGoogleJobs(effectiveSearchTerm, location);
      
      // Filter local mock jobs based on search criteria
      const filteredMockJobs = mockJobs.filter(job => {
        const matchesSearchTerm = effectiveSearchTerm === '' || 
          job.title.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) || 
          job.company.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(effectiveSearchTerm.toLowerCase()));
          
        const matchesLocation = location === '' || 
          job.location.toLowerCase().includes(location.toLowerCase());
          
        return matchesSearchTerm && matchesLocation;
      });
      
      // Combine the results
      const combinedResults = [...filteredMockJobs, ...googleJobs];
      
      setSearchResults(combinedResults);
      
      if (combinedResults.length === 0) {
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
  };

  const handleApply = async (job: Job) => {
    // Check if CV is uploaded
    const cv = localStorage.getItem('cv');
    
    if (!cv) {
      toast({
        title: "No CV Found",
        description: "Please upload your CV before applying",
        variant: "destructive",
      });
      return;
    }
    
    // Special handling for Google Jobs with external apply links
    if (job.source === 'Google Jobs' && job.applyUrl) {
      // In a real app, we would open the URL in a new tab
      window.open(job.applyUrl, '_blank');
      
      // Save application to localStorage for tracking
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      applications.push({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedDate: new Date().toISOString(),
        status: 'Applied',
        autoApplied: false,
        message: "Application initiated through external link",
        source: job.source,
        sourceId: job.sourceId
      });
      localStorage.setItem('applications', JSON.stringify(applications));
      
      toast({
        title: "External Application",
        description: `You've been redirected to apply for ${job.title} at ${job.company}`,
      });
      
      return;
    }
    
    setIsApplying(prev => ({ ...prev, [job.id]: true }));
    
    try {
      // Call application service
      const result = await applyToJob(job);
      
      setAppliedJobs(prev => ({ 
        ...prev, 
        [job.id]: { 
          success: result.success,
          message: result.message
        } 
      }));
      
      // Save application to localStorage for demo
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      applications.push({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedDate: new Date().toISOString(),
        status: result.success ? 'Applied' : 'Failed',
        autoApplied: job.canAutoApply,
        message: result.message,
        source: job.source,
        sourceId: job.sourceId,
        contactName: result.contactName,
        contactEmail: result.contactEmail,
        contactLinkedIn: result.contactLinkedIn
      });
      localStorage.setItem('applications', JSON.stringify(applications));
      
      // Show toast notification
      toast({
        title: result.success ? "Application Submitted" : "Application Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Application error:", error);
      setAppliedJobs(prev => ({ 
        ...prev, 
        [job.id]: { 
          success: false,
          message: "An unexpected error occurred" 
        } 
      }));
    } finally {
      setIsApplying(prev => ({ ...prev, [job.id]: false }));
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
            
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="w-full h-10 md:w-auto"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Searching...
                  </>
                ) : 'Search Jobs'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isLoadingGoogleJobs && searchResults.length === 0 && (
        <div className="text-center py-10 animate-fade-in">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            Loading Google Jobs data for Product and Growth Managers...
          </p>
        </div>
      )}
      
      {searchResults.length > 0 && (
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
                        
                        {job.source === 'Google Jobs' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            Google Jobs
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
      
      {searchResults.length === 0 && !isSearching && !isLoadingGoogleJobs && (
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
