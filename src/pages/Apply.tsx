
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import JobSearch from "@/components/JobSearch";
import Header from "@/components/Header";
import { CircleCheck, FileWarning } from "lucide-react";

const Apply = () => {
  const navigate = useNavigate();
  const [isCVUploaded, setIsCVUploaded] = useState(false);
  const [cvCheckInProgress, setCvCheckInProgress] = useState(true);
  const [cvStatus, setCvStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [cvDetails, setCvDetails] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if CV is uploaded
    const checkCV = async () => {
      setCvCheckInProgress(true);
      setCvStatus('checking');
      
      // Simulate API delay for CV validation
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const cv = localStorage.getItem('cv');
      if (!cv) {
        toast({
          title: "No CV Found",
          description: "Please upload your CV before applying to jobs",
          variant: "destructive",
        });
        setCvStatus('invalid');
        setIsCVUploaded(false);
      } else {
        try {
          const cvData = JSON.parse(cv);
          setCvDetails(cvData);
          
          if (!cvData.name || !cvData.uploadedAt) {
            throw new Error("Invalid CV data");
          }
          
          // CV data is valid
          setCvStatus('valid');
          setIsCVUploaded(true);
          toast({
            title: "CV Ready",
            description: "Your CV is ready for automatic applications",
          });
        } catch (error) {
          console.error("Error parsing CV data:", error);
          setCvStatus('invalid');
          setIsCVUploaded(false);
          toast({
            title: "CV Data Error",
            description: "Your CV data appears to be corrupted. Please re-upload.",
            variant: "destructive",
          });
        }
      }
      
      setCvCheckInProgress(false);
    };
    
    checkCV();
  }, [toast]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
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
              
              {cvCheckInProgress ? (
                <div className="max-w-md mx-auto py-12 animate-fade-in">
                  <div className="space-y-4 text-center">
                    <h3 className="text-lg font-medium">Checking your CV...</h3>
                    <Progress value={50} className="w-full h-2" />
                    <p className="text-sm text-muted-foreground">
                      We're validating your CV for automatic applications
                    </p>
                  </div>
                </div>
              ) : cvStatus === 'invalid' ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                    <FileWarning className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-xl font-medium mb-3">
                    CV Not Found or Invalid
                  </p>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You need to upload a valid CV before you can apply to jobs. Our system will use your CV data to automatically apply to compatible positions.
                  </p>
                  <Button onClick={() => navigate('/upload')} size="lg">
                    Upload Your CV
                  </Button>
                </div>
              ) : (
                <div className="animate-slide-up space-y-8">
                  <div className="max-w-4xl mx-auto bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-4">
                    <CircleCheck className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">CV Ready for Auto-Applications</h3>
                      <p className="text-sm text-muted-foreground">
                        Your CV was uploaded on {cvDetails?.uploadedAt && formatDate(cvDetails.uploadedAt)}.
                      </p>
                      <div className="mt-3 flex gap-4">
                        <Button variant="outline" size="sm" onClick={() => navigate('/upload')}>
                          Update CV
                        </Button>
                      </div>
                    </div>
                  </div>
                  
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
