
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FileUp, X, File, CheckCircle } from 'lucide-react';

const CVUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return false;
    }
    
    // 10MB max size
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should be less than 10MB",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploaded(true);
      setIsUploading(false);
      
      // Save to localStorage for demo purposes
      localStorage.setItem('cv', JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        uploadedAt: new Date().toISOString()
      }));
      
      toast({
        title: "CV Uploaded Successfully",
        description: "Your CV is now ready for automatic applications",
      });
    }, 3000);
  };
  
  const removeFile = () => {
    setFile(null);
    setIsUploaded(false);
    setUploadProgress(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    else return `${Math.round(size / (1024 * 1024) * 10) / 10} MB`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="glass-panel overflow-hidden transition-all duration-300">
        <CardContent className="p-6">
          {!file ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 transition-all duration-200 flex flex-col items-center justify-center text-center ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/30 hover:border-muted-foreground/50'
              }`}
            >
              <FileUp 
                className={`w-12 h-12 mb-4 transition-all duration-200 ${
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
              <h3 className="text-lg font-medium mb-2">Upload your CV</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Drag and drop your CV file here, or click to browse
              </p>
              <p className="text-muted-foreground/70 text-xs mb-6">
                Supports PDF, DOC, DOCX (Max 10MB)
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="transition-all duration-300 hover:shadow-md"
              >
                Browse Files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
              />
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Selected File</h3>
                {!isUploaded && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={removeFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X size={18} />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center p-4 bg-muted/40 rounded-lg mb-5">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    {isUploaded ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <File className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              {isUploading && (
                <div className="w-full bg-muted rounded-full h-2 mb-5 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              
              {!isUploaded ? (
                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload CV'}
                </Button>
              ) : (
                <div className="text-center text-sm p-2 bg-primary/10 text-primary rounded-md">
                  CV uploaded successfully
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CVUploader;
