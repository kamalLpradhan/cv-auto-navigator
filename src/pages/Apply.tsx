import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import JobSearchWithGemini from '@/components/JobSearchWithGemini';
import JobWebsiteTracker from '@/components/JobWebsiteTracker';
import Header from '@/components/Header';
import EnhancedJobSearch from '@/components/EnhancedJobSearch';

const Apply = () => {
  const navigate = useNavigate();
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvData, setCvData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if CV is already uploaded
    const savedCV = localStorage.getItem('cv');
    if (savedCV) {
      try {
        const parsedCV = JSON.parse(savedCV);
        setCvData(parsedCV);
        setCvUploaded(true);
      } catch (error) {
        console.error('Error parsing saved CV:', error);
      }
    }
  }, []);

  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.includes('text')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or text file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Create a structured CV object
      const cvObject = {
        fileName: file.name,
        content: content,
        uploadDate: new Date().toISOString(),
        fileType: file.type
      };

      localStorage.setItem('cv', JSON.stringify(cvObject));
      setCvData(cvObject);
      setCvUploaded(true);
      
      toast({
        title: "CV Uploaded Successfully",
        description: "Your CV has been saved and is ready for job matching",
      });
    };

    reader.onerror = () => {
      toast({
        title: "Upload Failed",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
  };

  const handleRemoveCV = () => {
    localStorage.removeItem('cv');
    setCvData(null);
    setCvUploaded(false);
    toast({
      title: "CV Removed",
      description: "Your CV has been removed from the system",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-background/70">
      <Header />
      
      <main className="flex-1 pt-20">
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-[90rem] mx-auto">
              <div className="space-y-3 mb-10 text-center animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Find Your Perfect Job
                </h1>
                <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                  Search and apply to jobs with AI-powered matching and automatic application tracking
                </p>
              </div>

              {/* CV Upload Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    CV Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!cvUploaded ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Upload your CV to enable AI-powered job matching and personalized recommendations
                      </p>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="cv-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors">
                            <Upload className="h-4 w-4" />
                            <span>Choose CV File</span>
                          </div>
                        </Label>
                        <Input
                          id="cv-upload"
                          type="file"
                          accept=".pdf,.txt,.doc,.docx"
                          onChange={handleCVUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">CV Uploaded Successfully</p>
                          <p className="text-sm text-muted-foreground">
                            {cvData?.fileName} • Uploaded {new Date(cvData?.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={handleRemoveCV}>
                        Remove CV
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="enhanced-search" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="enhanced-search">Enhanced Search</TabsTrigger>
                  <TabsTrigger value="gemini-search">AI-Powered Search</TabsTrigger>
                  <TabsTrigger value="website-tracker">Website Tracker</TabsTrigger>
                </TabsList>
                
                <TabsContent value="enhanced-search" className="space-y-6">
                  <EnhancedJobSearch />
                </TabsContent>
                
                <TabsContent value="gemini-search" className="space-y-6">
                  <JobSearchWithGemini />
                </TabsContent>
                
                <TabsContent value="website-tracker" className="space-y-6">
                  <JobWebsiteTracker />
                </TabsContent>
              </Tabs>
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
