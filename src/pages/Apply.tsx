
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import JobSearch from "@/components/JobSearch";
import Header from "@/components/Header";

const Apply = () => {
  const navigate = useNavigate();
  const [isCVUploaded, setIsCVUploaded] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if CV is uploaded
    const cv = localStorage.getItem('cv');
    if (!cv) {
      toast({
        title: "No CV Found",
        description: "Please upload your CV before applying to jobs",
        variant: "destructive",
      });
      setIsCVUploaded(false);
    } else {
      setIsCVUploaded(true);
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
                  Find and Apply to Jobs
                </h1>
                <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                  Search for jobs that match your skills and let our AI automatically apply for you.
                </p>
              </div>
              
              {!isCVUploaded ? (
                <div className="text-center py-12 animate-fade-in">
                  <p className="text-muted-foreground mb-6">
                    You need to upload your CV before you can apply to jobs.
                  </p>
                  <Button onClick={() => navigate('/upload')}>
                    Upload Your CV
                  </Button>
                </div>
              ) : (
                <div className="animate-slide-up">
                  <JobSearch />
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

export default Apply;
