
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ApplicationTracker from '@/components/ApplicationTracker';
import JobWebsiteTracker from '@/components/JobWebsiteTracker';
import Header from '@/components/Header';
import { Application } from '@/components/ApplicationTracker';

const Dashboard = () => {
  const navigate = useNavigate();
  const [hasApplications, setHasApplications] = useState(false);
  const { toast } = useToast();
  
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
    
    // Check if there are any applications
    const applications = localStorage.getItem('applications');
    if (applications && JSON.parse(applications).length > 0) {
      setHasApplications(true);
    } else {
      // Add sample applications data for demonstration
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
      setHasApplications(true);
    }
  }, [toast]);
  
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
              
              {!hasApplications ? (
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
