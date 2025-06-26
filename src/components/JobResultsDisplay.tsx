
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Briefcase, 
  MapPin, 
  Calendar,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';
import { applyToJob } from '@/utils/applicationService';
import { useToast } from "@/hooks/use-toast";

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

interface JobResultsDisplayProps {
  websiteResults: Array<{
    website: string;
    jobs: JobResult[];
  }>;
  isLoading: boolean;
}

const JobResultsDisplay = ({ websiteResults, isLoading }: JobResultsDisplayProps) => {
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [applyingJobs, setApplyingJobs] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  const toggleJobExpansion = (jobId: string) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedJobs(newExpanded);
  };
  
  const handleApplyToJob = async (job: JobResult) => {
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
        title: "Application Tracked",
        description: `Successfully applied to ${job.title} at ${job.company}`,
      });
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Failed to track your application. Please try again.",
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
  
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Searching for jobs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (websiteResults.length === 0) {
    return null;
  }
  
  const totalJobs = websiteResults.reduce((sum, result) => sum + result.jobs.length, 0);
  
  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Found Jobs ({totalJobs})</h3>
      </div>
      
      {websiteResults.map(({ website, jobs }) => (
        <Card key={website} className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-4 w-4" />
              {website} ({jobs.length} jobs)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <h4 className="font-medium text-base">{job.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {job.source}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {job.salary}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-3">
                        {expandedJobs.has(job.id) 
                          ? job.description 
                          : `${job.description.substring(0, 150)}...`
                        }
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleJobExpansion(job.id)}
                        >
                          {expandedJobs.has(job.id) ? (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Show More
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApplyToJob(job)}
                        disabled={applyingJobs.has(job.id)}
                      >
                        {applyingJobs.has(job.id) ? 'Applying...' : 'Quick Apply'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(job.applyUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Job
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobResultsDisplay;
