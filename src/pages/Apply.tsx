import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle } from 'lucide-react';
import JobSearchHub from '@/components/JobSearchHub';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Dream Job</h1>
          <p className="text-muted-foreground">
            Search across thousands of job listings and apply with one click
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
                  Upload your CV to enable personalized job matching
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
                      {cvData?.fileName} • {new Date(cvData?.uploadDate).toLocaleDateString()}
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

        <JobSearchHub />
      </main>
      
      <Footer />
    </div>
  );
};

export default Apply;
