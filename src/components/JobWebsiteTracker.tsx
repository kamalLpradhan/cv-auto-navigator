import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, MapPin, Plus, X, Loader2, TrendingUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import JobResultsDisplay from './JobResultsDisplay';
import { JobSearchService } from '@/utils/jobSearchService';

interface JobWebsite {
  name: string;
  url: string;
}

const JOB_WEBSITES: JobWebsite[] = [
  { name: "LinkedIn", url: "https://www.linkedin.com" },
  { name: "Indeed", url: "https://www.indeed.com" },
  { name: "Glassdoor", url: "https://www.glassdoor.com" },
  { name: "Monster", url: "https://www.monster.com" },
  { name: "SimplyHired", url: "https://www.simplyhired.com" },
];

const JobWebsiteTracker = () => {
  const [selectedWebsite, setSelectedWebsite] = useState<JobWebsite | null>(null);
  const [location, setLocation] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [positions, setPositions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleAddPosition = () => {
    if (newPosition.trim() !== '') {
      setPositions([...positions, newPosition.trim()]);
      setNewPosition('');
    }
  };

  const handleRemovePosition = (index: number) => {
    const newPositions = [...positions];
    newPositions.splice(index, 1);
    setPositions(newPositions);
  };

  const handleSearch = async () => {
    if (!selectedWebsite || positions.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a website and add at least one position",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    
    try {
      console.log('Starting job search with enhanced API service...');
      
      // Use the enhanced JobApiService for better results
      const results = await JobSearchService.searchMultipleWebsites([{
        name: selectedWebsite.name,
        url: selectedWebsite.url,
        positions: positions
      }], location || undefined);
      
      setSearchResults(results);
      
      const totalJobs = results.reduce((sum, result) => sum + result.jobs.length, 0);
      
      if (totalJobs > 0) {
        toast({
          title: "Search Complete",
          description: `Found ${totalJobs} jobs across ${results.length} website(s)`,
        });
      } else {
        toast({
          title: "No Jobs Found",
          description: "Try different keywords or check back later",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Job search error:", error);
      toast({
        title: "Search Failed",
        description: "Failed to search for jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Enhanced Job Website Tracker
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track specific positions across job websites with intelligent keyword matching
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="website-select">Job Website</Label>
            <Select 
              value={selectedWebsite?.name || ""} 
              onValueChange={(value) => {
                const website = JOB_WEBSITES.find(w => w.name === value);
                setSelectedWebsite(website || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a job website" />
              </SelectTrigger>
              <SelectContent>
                {JOB_WEBSITES.map((website) => (
                  <SelectItem key={website.name} value={website.name}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {website.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location-input">Location (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="location-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, Remote"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Position Management */}
        <div>
          <Label htmlFor="position-input">Job Positions to Track</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="position-input"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              placeholder="e.g. Frontend Developer, Product Manager"
              onKeyPress={(e) => e.key === 'Enter' && handleAddPosition()}
            />
            <Button onClick={handleAddPosition} disabled={!newPosition.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {positions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {positions.map((position, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {position}
                  <button
                    onClick={() => handleRemovePosition(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isSearching || !selectedWebsite || positions.length === 0}
          className="w-full"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching with AI-powered matching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Jobs with Enhanced Targeting
            </>
          )}
        </Button>

        {/* Advanced Search Info */}
        {selectedWebsite && positions.length > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Enhanced Search Ready
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Will search for <strong>{positions.join(', ')}</strong> on{' '}
                  <strong>{selectedWebsite.name}</strong>
                  {location && (
                    <> in <strong>{location}</strong></>
                  )}
                  <br />
                  Using intelligent keyword matching and company-specific filtering.
                </p>
              </div>
            </div>
          </div>
        )}

        <JobResultsDisplay 
          websiteResults={searchResults} 
          isLoading={isSearching} 
        />
      </CardContent>
    </Card>
  );
};

export default JobWebsiteTracker;
