
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ApplicationTracker from '@/components/ApplicationTracker';
import JobWebsiteTracker from '@/components/JobWebsiteTracker';
import Header from '@/components/Header';
import { Application } from '@/components/ApplicationTracker';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TargetIcon } from "lucide-react";
import ApplicationTargetTracker from '@/components/ApplicationTargetTracker';

const Dashboard = () => {
  const navigate = useNavigate();
  const [hasApplications, setHasApplications] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const { toast } = useToast();
  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  
  const loadApplications = () => {
    const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Add unique IDs if they don't exist
    const appsWithIds = savedApplications.map((app: Application) => ({
      ...app,
      id: app.id || Math.random().toString(36).substring(2, 15),
    }));
    
    console.log('Dashboard - Loading applications:', appsWithIds.length);
    setApplications(appsWithIds);
    
    if (appsWithIds.length > 0) {
      setHasApplications(true);
    }
  };
  
  useEffect(() => {
    // Check if CV is uploaded
    const cv = localStorage.getItem('cv');
    if (!cv) {
      toast({
        title: "No CV Found",
        description: "Please upload your CV before tracking applications",
        variant: "destructive",
      });
    }
    
    // Load applications initially
    loadApplications();
    
    // Listen for application updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'applications') {
        console.log('Dashboard - Storage changed, reloading applications');
        loadApplications();
      }
    };
    
    const handleApplicationAdded = (e: CustomEvent) => {
      console.log('Dashboard - Application added event received:', e.detail);
      loadApplications();
    };
    
    const handleApplicationsRefresh = () => {
      console.log('Dashboard - Applications refresh event received');
      loadApplications();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('applicationAdded', handleApplicationAdded as EventListener);
    window.addEventListener('applicationsRefresh', handleApplicationsRefresh);
    
    // Periodic refresh to ensure data consistency
    const refreshInterval = setInterval(() => {
      const currentCount = applications.length;
      const storageCount = JSON.parse(localStorage.getItem('applications') || '[]').length;
      if (currentCount !== storageCount) {
        console.log('Dashboard - Application count mismatch, refreshing');
        loadApplications();
      }
    }, 2000);
    
    // If no applications exist, add sample data
    if (!hasApplications) {
      const sampleApplications: Application[] = [
        {
          id: "app1",
          jobId: "job1",
          jobTitle: "Frontend Developer",
          company: "TechCorp Inc.",
          position: "Senior Frontend Engineer",
          appliedDate: new Date().toISOString(),
          status: "Applied",
          autoApplied: true,
          contactEmail: "hiring@techcorp.com",
          contactName: "Sarah Johnson"
        },
        {
          id: "app2",
          jobId: "job2",
          jobTitle: "React Developer",
          company: "Digital Solutions Ltd",
          position: "React Developer - Remote",
          appliedDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          status: "In Review",
          autoApplied: true,
          contactLinkedIn: "https://linkedin.com/in/recruiter-profile",
          contactName: "Michael Chang"
        },
        {
          id: "app3",
          jobId: "job3",
          jobTitle: "Full Stack Engineer",
          company: "Startup Innovations",
          position: "Full Stack Javascript Developer",
          appliedDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
          status: "Failed",
          autoApplied: false,
          message: "Application requires additional assessment test",
          contactEmail: "recruiting@startup-innovations.co"
        },
        {
          id: "app4",
          jobId: "job4",
          jobTitle: "Growth Manager",
          company: "LinkedIn",
          position: "Growth Marketing Manager",
          appliedDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
          status: "Applied",
          autoApplied: true,
          contactName: "Jennifer Davis",
          contactEmail: "jennifer.davis@linkedin.com",
          contactLinkedIn: "linkedin.com/in/jennifer-davis-342",
          source: "LinkedIn Jobs",
          sourceId: "linkedin-12345"
        },
        {
          id: "app5",
          jobId: "job5",
          jobTitle: "Growth Product Manager",
          company: "Slack",
          position: "Growth Product Manager - Remote",
          appliedDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          status: "Interview",
          autoApplied: true,
          contactName: "Robert Miller",
          contactLinkedIn: "linkedin.com/in/robert-miller-789",
          source: "LinkedIn Jobs",
          sourceId: "linkedin-56789"
        }
      ];
      
      localStorage.setItem('applications', JSON.stringify(sampleApplications));
      setApplications(sampleApplications);
      setHasApplications(true);
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('applicationAdded', handleApplicationAdded as EventListener);
      window.removeEventListener('applicationsRefresh', handleApplicationsRefresh);
      clearInterval(refreshInterval);
    };
  }, [toast, hasApplications, applications.length]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-background/70">
      <Header />
      
      <main className="flex-1 flex flex-col pt-20">
        <section className="py-12 flex-1">
          <div className="container px-4 md:px-6">
            <div className="max-w-[80rem] mx-auto">
              <div className="space-y-3 mb-10 text-center animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Application Dashboard
                </h1>
                <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                  Track and manage all your job applications in one place.
                </p>
              </div>
              
              {!hasApplications || applications.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <p className="text-muted-foreground mb-6">
                    You haven't applied to any jobs yet. Start your job search to see applications here.
                  </p>
                  <Button onClick={() => navigate('/apply')}>
                    Browse Jobs
                  </Button>
                </div>
              ) : (
                <div className="animate-slide-up space-y-10">
                  {/* Tracker Button */}
                  <div className="flex justify-center mb-6">
                    <Dialog open={targetDialogOpen} onOpenChange={setTargetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <TargetIcon className="h-4 w-4" />
                          <span>Application Target Tracker ({applications.length} applications)</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                        <ApplicationTargetTracker applications={applications} />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <ApplicationTracker />
                  <JobWebsiteTracker />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} CV Navigator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
