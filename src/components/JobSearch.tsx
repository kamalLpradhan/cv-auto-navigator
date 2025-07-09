
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Search, BriefcaseBusiness, MapPin, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { applyToJob } from '@/utils/applicationService';

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
}

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isApplying, setIsApplying] = useState<Record<string, boolean>>({});
  const [appliedJobs, setAppliedJobs] = useState<Record<string, { success: boolean; message?: string }>>({});
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

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API search delay
    setTimeout(() => {
      // Filter jobs based on search criteria
      const results = mockJobs.filter(job => {
        const matchesSearchTerm = searchTerm === '' || 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
          
        const matchesLocation = location === '' || 
          job.location.toLowerCase().includes(location.toLowerCase());
          
        return matchesSearchTerm && matchesLocation;
      });
      
      setSearchResults(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria",
          variant: "default",
        });
      }
    }, 1000);
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
        message: result.message
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
                  placeholder="e.g. Frontend Developer"
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
                {isSearching ? 'Searching...' : 'Search Jobs'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {searchResults.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          {searchResults.map((job) => (
            <Card key={job.id} className="overflow-hidden card-hover">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <BriefcaseBusiness size={15} />
                        <span>{job.company}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                        <MapPin size={15} />
                        <span>{job.location}</span>
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
                      </div>
                    </div>
                    
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
                        {isApplying[job.id] ? 'Applying...' : 'Apply Now'}
                      </Button>
                    )}
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
      
      {searchResults.length === 0 && searchTerm && !isSearching && (
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
