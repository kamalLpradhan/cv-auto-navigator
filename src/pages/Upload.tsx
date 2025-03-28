
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import CVUploader from '@/components/CVUploader';
import Header from '@/components/Header';

const Upload = () => {
  const navigate = useNavigate();
  const [isCVUploaded, setIsCVUploaded] = useState(false);
  
  // Check for CV on mount and update state
  useEffect(() => {
    const cv = localStorage.getItem('cv');
    if (cv) {
      setIsCVUploaded(true);
    }
  }, []);
  
  // Callback to handle CV upload completion
  const handleUploadComplete = useCallback(() => {
    setIsCVUploaded(true);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-background/70">
      <Header />
      
      <main className="flex-1 flex flex-col pt-20">
        <section className="py-12 flex-1 flex items-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-[50rem] mx-auto flex flex-col items-center text-center">
              <div className="space-y-3 mb-10 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Upload Your CV
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Upload your CV once and use it to apply to multiple jobs automatically.
                </p>
              </div>
              
              <div className="w-full max-w-md mx-auto mb-10 animate-slide-up">
                <CVUploader onUploadComplete={handleUploadComplete} />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
                {isCVUploaded && (
                  <Button 
                    onClick={() => navigate('/apply')} 
                    className="gap-1"
                  >
                    Continue to Job Search
                  </Button>
                )}
                <Button 
                  onClick={() => navigate('/')} 
                  variant="outline"
                >
                  Back to Home
                </Button>
              </div>
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

export default Upload;
