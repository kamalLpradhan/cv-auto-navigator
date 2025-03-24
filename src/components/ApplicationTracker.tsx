
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileCheck, Clock, X, CheckCircle, AlertTriangle, Globe, Briefcase, Linkedin } from 'lucide-react';
import ApplicationCard from './ApplicationCard';

export interface Application {
  id?: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'Applied' | 'In Review' | 'Rejected' | 'Interview' | 'Offer' | 'Failed';
  autoApplied: boolean;
  message?: string;
  position?: string;
  contactEmail?: string;
  contactLinkedIn?: string;
  contactName?: string;
  source?: string;
  sourceId?: string;
}

const ApplicationTracker = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Load applications from localStorage for demo purposes
    const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Add unique IDs if they don't exist
    const appsWithIds = savedApplications.map((app: Application) => ({
      ...app,
      id: app.id || Math.random().toString(36).substring(2, 15),
    }));
    
    setApplications(appsWithIds);
    setFilteredApplications(appsWithIds);
  }, []);
  
  useEffect(() => {
    // Filter applications based on search term and active tab
    let filtered = [...applications];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.source && app.source.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply tab filter
    if (activeTab === 'auto') {
      filtered = filtered.filter(app => app.autoApplied);
    } else if (activeTab === 'manual') {
      filtered = filtered.filter(app => !app.autoApplied);
    } else if (activeTab === 'failed') {
      filtered = filtered.filter(app => app.status === 'Failed');
    } else if (activeTab === 'google') {
      filtered = filtered.filter(app => app.source === 'Google Jobs');
    } else if (activeTab === 'linkedin') {
      filtered = filtered.filter(app => app.source === 'LinkedIn Jobs');
    } else if (activeTab === 'product') {
      filtered = filtered.filter(app => 
        app.jobTitle.toLowerCase().includes('product manager') || 
        app.position?.toLowerCase().includes('product manager')
      );
    } else if (activeTab === 'growth') {
      filtered = filtered.filter(app => 
        app.jobTitle.toLowerCase().includes('growth') || 
        app.position?.toLowerCase().includes('growth')
      );
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, activeTab]);
  
  const getStatusCounts = () => {
    const autoApplied = applications.filter(app => app.autoApplied).length;
    const manual = applications.filter(app => !app.autoApplied).length;
    const failed = applications.filter(app => app.status === 'Failed').length;
    const google = applications.filter(app => app.source === 'Google Jobs').length;
    const linkedin = applications.filter(app => app.source === 'LinkedIn Jobs').length;
    const product = applications.filter(app => 
      app.jobTitle.toLowerCase().includes('product manager') || 
      app.position?.toLowerCase().includes('product manager')
    ).length;
    const growth = applications.filter(app => 
      app.jobTitle.toLowerCase().includes('growth') || 
      app.position?.toLowerCase().includes('growth')
    ).length;
    
    return { autoApplied, manual, failed, google, linkedin, product, growth, total: applications.length };
  };
  
  const counts = getStatusCounts();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="glass-panel transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <h3 className="text-3xl font-bold mt-1">{counts.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileCheck className="text-primary" size={22} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Manager Jobs</p>
                <h3 className="text-3xl font-bold mt-1">{counts.growth}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Briefcase className="text-purple-600 dark:text-purple-400" size={22} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">LinkedIn Applications</p>
                <h3 className="text-3xl font-bold mt-1">{counts.linkedin}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Linkedin className="text-blue-600 dark:text-blue-400" size={22} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Your Applications</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="auto">Auto-Applied</TabsTrigger>
              <TabsTrigger value="product">Product Manager</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="google">Google Jobs</TabsTrigger>
              <TabsTrigger value="linkedin">
                <span className="flex items-center gap-1">
                  LinkedIn
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    New
                  </span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {filteredApplications.length > 0 ? (
                <div className="space-y-4 animate-fade-in">
                  {filteredApplications.map((application) => (
                    <ApplicationCard 
                      key={application.id} 
                      application={application}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Clock className="text-muted-foreground" size={24} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No applications found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? "No applications match your search criteria" 
                      : "Upload your CV and start applying to jobs to see them here"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationTracker;
