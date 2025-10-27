import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, DollarSign, Briefcase, TrendingUp, Calendar, ExternalLink, Check, Filter, X } from "lucide-react";
import { JobApiService } from "@/utils/jobApiService";
import { applyToJob } from "@/utils/applicationService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  created?: string;
  redirect_url?: string;
}

const PRESET_LOCATIONS = ["Remote", "United States", "United Kingdom", "India", "Canada", "Australia", "Germany"];

const JobSearchHub = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["Remote", "United States"]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [filterType, setFilterType] = useState<string>("all");
  const [minSalary, setMinSalary] = useState<string>("");
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Load applied jobs from localStorage
  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem("applications") || "[]");
    const appliedIds = new Set<string>(applications.map((app: any) => String(app.jobId || app.id)));
    setAppliedJobs(appliedIds);
  }, []);

  // Filter and sort jobs
  useEffect(() => {
    let filtered = [...jobs];

    // Apply filters
    if (remoteOnly) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes("remote") ||
        job.location.toLowerCase().includes("anywhere")
      );
    }

    if (minSalary && minSalary !== "0") {
      const minSal = parseInt(minSalary);
      filtered = filtered.filter(job => 
        job.salary_min && job.salary_min >= minSal
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(job =>
        job.contract_type?.toLowerCase() === filterType.toLowerCase()
      );
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.created || 0).getTime();
        const dateB = new Date(b.created || 0).getTime();
        return dateB - dateA;
      });
    } else if (sortBy === "salary") {
      filtered.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    }

    setFilteredJobs(filtered);
  }, [jobs, remoteOnly, minSalary, filterType, sortBy]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    if (selectedLocations.length === 0) {
      toast({
        title: "Please select at least one location",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const results = await JobApiService.searchJobsMultipleLocations(searchTerm, selectedLocations);
      setJobs(results);
      
      if (results.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try different keywords or locations",
        });
      } else {
        toast({
          title: `Found ${results.length} jobs`,
          description: "Scroll down to see all results",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleApply = async (job: Job) => {
    try {
      await applyToJob({
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        status: "applied",
        appliedDate: new Date().toISOString(),
      });

      setAppliedJobs(prev => new Set([...prev, job.id]));
      
      toast({
        title: "Application submitted",
        description: `Applied to ${job.title} at ${job.company}`,
      });

      // Dispatch events for real-time updates
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("applicationAdded"));
    } catch (error) {
      toast({
        title: "Application failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const clearFilters = () => {
    setRemoteOnly(false);
    setMinSalary("");
    setFilterType("all");
    setSortBy("relevance");
  };

  const hasActiveFilters = remoteOnly || minSalary !== "" || filterType !== "all" || sortBy !== "relevance";

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Job Search Hub
          </CardTitle>
          <CardDescription>
            Search across multiple locations and find your perfect job match
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Job title, keywords, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
              <Search className="h-4 w-4" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Location Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Locations
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_LOCATIONS.map((location) => (
                <Badge
                  key={location}
                  variant={selectedLocations.includes(location) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleLocation(location)}
                >
                  {location}
                  {selectedLocations.includes(location) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      {jobs.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>

              <Select value={minSalary} onValueChange={setMinSalary}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Min. salary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Salary</SelectItem>
                  <SelectItem value="40000">$40,000+</SelectItem>
                  <SelectItem value="60000">$60,000+</SelectItem>
                  <SelectItem value="80000">$80,000+</SelectItem>
                  <SelectItem value="100000">$100,000+</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={remoteOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setRemoteOnly(!remoteOnly)}
                className="gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Remote Only
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  Clear Filters
                  <X className="h-4 w-4" />
                </Button>
              )}

              <div className="ml-auto text-sm text-muted-foreground">
                {filteredJobs.length} of {jobs.length} jobs
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Job Results */}
      {!isSearching && filteredJobs.length > 0 && (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.has(job.id);
            const matchScore = Math.floor(Math.random() * 30) + 70; // Mock match score

            return (
              <Card key={job.id} className="card-hover group">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          {isApplied && (
                            <Badge variant="secondary" className="gap-1">
                              <Check className="h-3 w-3" />
                              Applied
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground font-medium">{job.company}</p>
                      </div>

                      <Badge variant="outline" className={cn(
                        "gap-1",
                        matchScore >= 85 ? "bg-green-500/10 text-green-700 dark:text-green-400" :
                        matchScore >= 70 ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" :
                        "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                      )}>
                        <TrendingUp className="h-3 w-3" />
                        {matchScore}% Match
                      </Badge>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      {job.salary_min && job.salary_max && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                        </div>
                      )}
                      {job.contract_type && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.contract_type}
                        </div>
                      )}
                      {job.created && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(job.created).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleApply(job)}
                        disabled={isApplied}
                        className="gap-2"
                        size="sm"
                      >
                        <Check className="h-4 w-4" />
                        {isApplied ? "Applied" : "Quick Apply"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => window.open(job.redirect_url || job.url, "_blank")}
                      >
                        View Job
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isSearching && jobs.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Start Your Job Search</h3>
            <p className="text-muted-foreground">
              Enter keywords and select locations to find jobs that match your skills
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Results After Filter */}
      {!isSearching && jobs.length > 0 && filteredJobs.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Jobs Match Your Filters</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more results
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobSearchHub;
