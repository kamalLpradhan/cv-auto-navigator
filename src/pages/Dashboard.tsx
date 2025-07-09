
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ApplicationTracker from '@/components/ApplicationTracker';
import Header from '@/components/Header';

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
                <div className="animate-slide-up">
                  <ApplicationTracker />
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
