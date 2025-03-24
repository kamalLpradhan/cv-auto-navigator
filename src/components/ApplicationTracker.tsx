
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileCheck, Clock, X, CheckCircle, AlertTriangle, Globe } from 'lucide-react';
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
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, activeTab]);
  
  const getStatusCounts = () => {
    const autoApplied = applications.filter(app => app.autoApplied).length;
    const manual = applications.filter(app => !app.autoApplied).length;
    const failed = applications.filter(app => app.status === 'Failed').length;
    const google = applications.filter(app => app.source === 'Google Jobs').length;
    
    return { autoApplied, manual, failed, google, total: applications.length };
  };
  
  const counts = getStatusCounts();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                <p className="text-sm font-medium text-muted-foreground">Auto-Applied</p>
                <h3 className="text-3xl font-bold mt-1">{counts.autoApplied}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="text-green-600 dark:text-green-400" size={22} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Google Jobs</p>
                <h3 className="text-3xl font-bold mt-1">{counts.google}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Globe className="text-blue-600 dark:text-blue-400" size={22} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Applications</p>
                <h3 className="text-3xl font-bold mt-1">{counts.failed}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="text-amber-600 dark:text-amber-400" size={22} />
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
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="auto">Auto-Applied</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="google">Google Jobs</TabsTrigger>
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
                      : "Start applying to jobs to see your applications here"}
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
