
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload, Search, CheckCircle, Target } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null; // Prevent hydration issues
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-background/70">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <section className="py-24 lg:py-32 flex items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in">
                  AI-Powered CV Navigator
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-slide-up">
                  Automatically apply your CV to thousands of job positions with a single click
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 animate-slide-up">
                <Button 
                  onClick={() => navigate('/upload')} 
                  size="lg" 
                  className="gap-1"
                >
                  Upload Your CV
                  <Upload size={18} />
                </Button>
                <Button 
                  onClick={() => navigate('/apply')} 
                  variant="outline" 
                  size="lg"
                  className="gap-1"
                >
                  Browse Jobs
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 lg:py-24 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto text-center md:max-w-[58rem] mb-10 md:mb-16 animate-fade-in">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Our AI-powered platform automates your job application process in just a few simple steps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
              <div className="glass-panel relative group p-6 rounded-lg transition-all duration-300 hover:shadow-lg text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  <Upload size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Upload Your CV</h3>
                <p className="text-muted-foreground">
                  Upload your CV once and our AI will extract your skills, experience, and qualifications.
                </p>
              </div>
              
              <div className="glass-panel relative group p-6 rounded-lg transition-all duration-300 hover:shadow-lg text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Find Jobs</h3>
                <p className="text-muted-foreground">
                  Search for jobs that match your skills and experience with our smart job matching algorithm.
                </p>
              </div>
              
              <div className="glass-panel relative group p-6 rounded-lg transition-all duration-300 hover:shadow-lg text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Auto-Apply</h3>
                <p className="text-muted-foreground">
                  Our system automatically applies to compatible jobs, saving you hours of repetitive form filling.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="space-y-4 animate-slide-up">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Smart Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Focus on Interviews, <br />Not Applications
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform handles the tedious application process so you can focus on preparing for interviews. With detailed tracking and smart automation, you'll never miss an opportunity.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="gap-1"
                  >
                    Track Applications
                    <Target size={18} />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="glass-panel relative group overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="h-full w-full bg-muted/30 p-6 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Auto-fill application forms</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Bypass tedious registration processes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Identify when manual application is needed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Track all your applications in one place</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Receive notifications about application status</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

export default Index;
