
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Bell, 
  BellOff,
  Search,
  Plus,
  ExternalLink,
  CheckCircle,
  BriefcaseBusiness,
  Zap
} from 'lucide-react';

export interface JobWebsite {
  id: string;
  name: string;
  url: string;
  positions: string[];
  notifications: boolean;
  lastChecked?: string;
  newJobs?: number;
  appliedJobs?: number;
}

const JobWebsiteTracker = () => {
  const [jobWebsites, setJobWebsites] = useState<JobWebsite[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWebsite, setNewWebsite] = useState({
    name: '',
    url: '',
    position: ''
  });
  
  useEffect(() => {
    // Load tracked websites from localStorage or use sample data
    const savedWebsites = localStorage.getItem('jobWebsites');
    
    if (savedWebsites) {
      setJobWebsites(JSON.parse(savedWebsites));
    } else {
      // Sample data for demonstration
      const sampleWebsites: JobWebsite[] = [
        {
          id: "site1",
          name: "LinkedIn",
          url: "https://linkedin.com/jobs",
          positions: ["Frontend Developer", "React Developer"],
          notifications: true,
          lastChecked: new Date().toISOString(),
          newJobs: 3,
          appliedJobs: 2
        },
        {
          id: "site2",
          name: "Indeed",
          url: "https://indeed.com",
          positions: ["JavaScript Engineer", "Web Developer"],
          notifications: false,
          lastChecked: new Date(Date.now() - 86400000).toISOString(),
          newJobs: 5,
          appliedJobs: 0
        },
        {
          id: "site3",
          name: "Glassdoor",
          url: "https://glassdoor.com",
          positions: ["Frontend Engineer", "UI Developer"],
          notifications: true,
          lastChecked: new Date(Date.now() - 86400000 * 2).toISOString(),
          newJobs: 0,
          appliedJobs: 1
        }
      ];
      
      setJobWebsites(sampleWebsites);
      localStorage.setItem('jobWebsites', JSON.stringify(sampleWebsites));
    }
  }, []);
  
  const toggleNotifications = (websiteId: string) => {
    const updatedWebsites = jobWebsites.map(site => 
      site.id === websiteId ? { ...site, notifications: !site.notifications } : site
    );
    
    setJobWebsites(updatedWebsites);
    localStorage.setItem('jobWebsites', JSON.stringify(updatedWebsites));
  };
  
  const handleAddWebsite = () => {
    if (!newWebsite.name || !newWebsite.url || !newWebsite.position) return;
    
    const newSite: JobWebsite = {
      id: Math.random().toString(36).substring(2, 15),
      name: newWebsite.name,
      url: newWebsite.url,
      positions: [newWebsite.position],
      notifications: true,
      lastChecked: new Date().toISOString(),
      newJobs: 0,
      appliedJobs: 0
    };
    
    const updatedWebsites = [...jobWebsites, newSite];
    setJobWebsites(updatedWebsites);
    localStorage.setItem('jobWebsites', JSON.stringify(updatedWebsites));
    
    // Reset form
    setNewWebsite({ name: '', url: '', position: '' });
    setShowAddForm(false);
  };
  
  const handleAddPosition = (websiteId: string, position: string) => {
    if (!position) return;
    
    const updatedWebsites = jobWebsites.map(site => {
      if (site.id === websiteId && !site.positions.includes(position)) {
        return {
          ...site,
          positions: [...site.positions, position]
        };
      }
      return site;
    });
    
    setJobWebsites(updatedWebsites);
    localStorage.setItem('jobWebsites', JSON.stringify(updatedWebsites));
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <Card className="glass-panel">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Job Websites Tracker
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track job websites and positions you're interested in
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="self-start md:self-center"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Website
          </Button>
        </CardHeader>
        
        <CardContent>
          {showAddForm && (
            <div className="bg-muted/30 rounded-lg p-4 mb-6 animate-fade-in border border-border">
              <h3 className="font-medium mb-3">Add New Job Website</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Website Name</label>
                  <Input
                    placeholder="LinkedIn, Indeed, etc."
                    value={newWebsite.name}
                    onChange={(e) => setNewWebsite({...newWebsite, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Website URL</label>
                  <Input
                    placeholder="https://example.com"
                    value={newWebsite.url}
                    onChange={(e) => setNewWebsite({...newWebsite, url: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Position Looking For</label>
                  <Input
                    placeholder="Frontend Developer, etc."
                    value={newWebsite.position}
                    onChange={(e) => setNewWebsite({...newWebsite, position: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button size="sm" onClick={handleAddWebsite}>Add Website</Button>
              </div>
            </div>
          )}
          
          {jobWebsites.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No job websites added yet.</p>
              <Button 
                onClick={() => setShowAddForm(true)} 
                variant="outline" 
                className="mt-4"
              >
                Add Your First Website
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobWebsites.map((website) => (
                <div 
                  key={website.id} 
                  className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{website.name}</h3>
                        <a 
                          href={website.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                        >
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Last checked: {formatDate(website.lastChecked)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                      {website.newJobs && website.newJobs > 0 ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                          <Zap size={14} className="mr-1" />
                          {website.newJobs} new jobs
                        </Badge>
                      ) : null}
                      
                      {website.appliedJobs && website.appliedJobs > 0 ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                          <CheckCircle size={14} className="mr-1" />
                          {website.appliedJobs} applied
                        </Badge>
                      ) : null}
                      
                      <div className="flex items-center space-x-2 ml-auto">
                        <Switch
                          id={`notifications-${website.id}`}
                          checked={website.notifications}
                          onCheckedChange={() => toggleNotifications(website.id)}
                        />
                        <label
                          htmlFor={`notifications-${website.id}`}
                          className="text-sm cursor-pointer flex items-center gap-1"
                        >
                          {website.notifications ? (
                            <>
                              <Bell size={14} className="text-primary" />
                              <span className="sr-only md:not-sr-only">Notifications On</span>
                            </>
                          ) : (
                            <>
                              <BellOff size={14} className="text-muted-foreground" />
                              <span className="sr-only md:not-sr-only">Notifications Off</span>
                            </>
                          )}
                        </label>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        <Search size={14} className="mr-1" />
                        Check Jobs
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-dashed border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <BriefcaseBusiness size={15} className="text-muted-foreground" />
                      <h4 className="text-sm font-medium">Positions you're looking for:</h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {website.positions.map((position, index) => (
                        <Badge key={index} variant="secondary">
                          {position}
                        </Badge>
                      ))}
                      
                      <div className="relative inline-block">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 rounded-full"
                          onClick={() => {
                            const position = prompt("Enter position name");
                            if (position) handleAddPosition(website.id, position);
                          }}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobWebsiteTracker;
