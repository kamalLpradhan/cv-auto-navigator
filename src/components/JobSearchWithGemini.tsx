import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Search, BriefcaseBusiness, MapPin, Sparkles, Loader2, Clock, Bot, AlertCircle, Settings, TrendingUp, Target } from 'lucide-react';
import { applyToJob } from '@/utils/applicationService';
import { debounce } from 'lodash';
import { searchJobs } from '@/utils/googleSearchService';
import { analyzeCVJobMatch } from '@/utils/cvAnalysisService';
import { useAuth } from '@/providers/AuthProvider';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: string;
  canAutoApply: boolean;
  source?: string;
  sourceId?: string;
  applyUrl?: string;
  geminiAnalysis?: string;
  cvMatchAnalysis?: {
    matchPercentage: number;
    strengths: string[];
    gaps: string[];
    improvements: string[];
    keywordsMatch: {
      matched: string[];
      missing: string[];
    };
  };
}

const JobSearchWithGemini = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isApplying, setIsApplying] = useState<Record<string, boolean>>({});
  const [appliedJobs, setAppliedJobs] = useState<Record<string, { success: boolean; message?: string }>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<Record<string, boolean>>({});
  const [isCVAnalyzing, setIsCVAnalyzing] = useState<Record<string, boolean>>({});
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [searchEngineId, setSearchEngineId] = useState('');
  const [showSearchError, setShowSearchError] = useState(false);
  const [autoAnalyzeCV, setAutoAnalyzeCV] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const storedApiKey = localStorage.getItem("gemini_api_key");
    if (storedApiKey) {
      setGeminiApiKey(storedApiKey);
    }
    
    const storedSearchEngineId = localStorage.getItem('searchEngineId');
    if (storedSearchEngineId) {
      setSearchEngineId(storedSearchEngineId);
    }
  }, []);

  const updateSearchEngineId = () => {
    const instructionText = `Please enter your Google Custom Search Engine ID.

Instructions:
1. Go to https://cse.google.com/
2. Click "Add" to create a new search engine
3. Add sites like: linkedin.com/jobs/*, indeed.com/*, glassdoor.com/*, jobs.google.com/*
4. After creating, go to "Setup" → "Basic" 
5. Copy the "Search engine ID" (looks like: 017576662512468239146:omuauf_lfve)
6. Paste ONLY the ID below (not the HTML embed code)

Current ID: ${searchEngineId}`;

    const id = prompt(instructionText, searchEngineId);
    if (id !== null) { // User didn't cancel
      // Clean the input in case they pasted HTML
      const cleanedId = id.replace(/[^a-zA-Z0-9:_-]/g, '');
      localStorage.setItem('searchEngineId', cleanedId);
      setSearchEngineId(cleanedId);
      setShowSearchError(false);
      toast({
        title: "Search Engine ID Updated",
        description: "Your Google Custom Search Engine ID has been updated. Try searching again.",
      });
    }
  };

  const analyzeJobWithGemini = async (job: Job) => {
    if (!geminiApiKey) {
      toast({
        title: "Gemini API Key Required",
        description: "Please set your Gemini API key in the chatbot settings",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(prev => ({ ...prev, [job.id]: true }));

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this job posting and provide insights for a job applicant:
                    
                    Job Title: ${job.title}
                    Company: ${job.company}
                    Location: ${job.location}
                    Description: ${job.description}
                    
                    Please provide:
                    1. Key skills and qualifications this role requires
                    2. What makes this position attractive
                    3. Potential growth opportunities
                    4. Tips for applying successfully
                    5. Market competitiveness (1-10 scale)
                    
                    Keep the response concise but informative.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze job with Gemini');
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
        const analysis = data.candidates[0].content.parts[0].text;
        
        // Update the job with Gemini analysis
        setSearchResults(prev => 
          prev.map(j => 
            j.id === job.id 
              ? { ...j, geminiAnalysis: analysis }
              : j
          )
        );

        toast({
          title: "AI Analysis Complete",
          description: "Gemini has analyzed this job posting for you",
        });
      }
    } catch (error) {
      console.error("Error analyzing job with Gemini:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze job with Gemini AI",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [job.id]: false }));
    }
  };

  const analyzeCVMatch = async (job: Job) => {
    if (!geminiApiKey) {
      toast({
        title: "Gemini API Key Required",
        description: "Please set your Gemini API key in the chatbot settings",
        variant: "destructive",
      });
      return;
    }

    const cvData = localStorage.getItem('cv');
    if (!cvData) {
      toast({
        title: "CV Not Found",
        description: "Please upload your CV to get match analysis",
        variant: "destructive",
      });
      return;
    }

    setIsCVAnalyzing(prev => ({ ...prev, [job.id]: true }));

    try {
      const parsedCV = JSON.parse(cvData);
      const analysis = await analyzeCVJobMatch(
        job.description,
        job.title,
        parsedCV,
        geminiApiKey
      );

      setSearchResults(prev => 
        prev.map(j => 
          j.id === job.id 
            ? { ...j, cvMatchAnalysis: analysis }
            : j
        )
      );

      toast({
        title: "CV Match Analysis Complete",
        description: `${analysis.matchPercentage}% match with this position`,
      });
    } catch (error) {
      console.error("Error analyzing CV match:", error);
      toast({
        title: "CV Analysis Failed",
        description: "Failed to analyze CV match with this job",
        variant: "destructive",
      });
    } finally {
      setIsCVAnalyzing(prev => ({ ...prev, [job.id]: false }));
    }
  };

  const performSearch = useCallback(async (term: string, loc: string) => {
    if (!term && !loc) return;
    
    setIsSearching(true);
    setShowSearchError(false);
    try {
      const searchResults = await searchJobs(term, loc, searchEngineId);
      setSearchResults(searchResults);
      
      if (searchResults.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria",
          variant: "default",
        });
      } else if (autoAnalyzeCV && geminiApiKey && localStorage.getItem('cv')) {
        // Auto-analyze CV match for first 3 jobs
        searchResults.slice(0, 3).forEach(job => {
          setTimeout(() => analyzeCVMatch(job), Math.random() * 2000);
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while searching for jobs";
      
      if (errorMessage.includes('Invalid Google Custom Search Engine ID') || 
          errorMessage.includes('invalid argument') ||
          errorMessage.includes('Invalid Value')) {
        setShowSearchError(true);
        toast({
          title: "Search Configuration Error",
          description: "The Google Custom Search Engine ID is invalid. Please configure it below.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Search Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSearching(false);
    }
  }, [toast, searchEngineId, autoAnalyzeCV, geminiApiKey]);

  const debouncedSearch = useCallback(
    debounce((term: string, loc: string) => {
      performSearch(term, loc);
    }, 500),
    [performSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm, location);
    return () => debouncedSearch.cancel();
  }, [searchTerm, location, debouncedSearch]);

  const handleApply = async (job: Job) => {
    setIsApplying(prev => ({ ...prev, [job.id]: true }));
    
    try {
      const result = await applyToJob(job);
      setAppliedJobs(prev => ({
        ...prev,
        [job.id]: { success: true }
      }));
      
      toast({
        title: "Application Submitted",
        description: `Your application for ${job.title} at ${job.company} was submitted successfully.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Application error:", error);
      setAppliedJobs(prev => ({
        ...prev,
        [job.id]: { success: false, message: "Failed to apply" }
      }));
      
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(prev => ({ ...prev, [job.id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="glass-panel mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="job-search" className="text-sm font-medium mb-1.5">
                Job Title, Skills, or Company
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="job-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Product Manager, Growth Manager"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="location-search" className="text-sm font-medium mb-1.5">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="location-search"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, Remote"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          {showSearchError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    Search Configuration Required
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    The Google Custom Search Engine ID is invalid or not working. You need to set up your own:
                  </p>
                  <ol className="text-sm text-red-700 dark:text-red-300 mb-4 list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://cse.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Custom Search</a></li>
                    <li>Create a new search engine</li>
                    <li>Add job sites: linkedin.com/jobs/*, indeed.com/*, glassdoor.com/*, jobs.google.com/*</li>
                    <li>Copy your Search Engine ID (NOT the HTML embed code)</li>
                    <li>Paste it using the button below</li>
                  </ol>
                  <Button onClick={updateSearchEngineId} size="sm" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Search Engine ID
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {!geminiApiKey && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 Set your Gemini API key in the chatbot (bottom-right) to get AI-powered job analysis and CV matching
              </p>
            </div>
          )}

          {geminiApiKey && localStorage.getItem('cv') && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-800 dark:text-green-200">
                  🎯 Auto CV-Job matching is enabled for better job recommendations
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoAnalyzeCV(!autoAnalyzeCV)}
                >
                  {autoAnalyzeCV ? 'Disable' : 'Enable'} Auto-Analysis
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isSearching && (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Searching for jobs...</p>
          </div>
        </div>
      )}

      {searchResults.length > 0 && !isSearching && (
        <div className="space-y-4 animate-fade-in">
          {searchResults.map((job) => (
            <Card key={job.id} className="overflow-hidden card-hover">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <BriefcaseBusiness size={15} />
                        <span>{job.company}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                        <MapPin size={15} />
                        <span>{job.location}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                        <Clock size={15} />
                        <span>{formatDate(job.postedDate)}</span>
                      </div>
                      
                      <h3 className="text-xl font-medium mb-3">{job.title}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {job.type}
                        </span>

                        {job.cvMatchAnalysis && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 ${getMatchColor(job.cvMatchAnalysis.matchPercentage)}`}>
                            <Target className="mr-1 h-3 w-3" />
                            {job.cvMatchAnalysis.matchPercentage}% CV Match
                          </span>
                        )}
                        
                        {geminiApiKey && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => analyzeJobWithGemini(job)}
                              disabled={isAnalyzing[job.id] || !!job.geminiAnalysis}
                              className="h-6 text-xs"
                            >
                              {isAnalyzing[job.id] ? (
                                <>
                                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  Analyzing...
                                </>
                              ) : job.geminiAnalysis ? (
                                <>
                                  <Bot className="mr-1 h-3 w-3" />
                                  AI Analyzed
                                </>
                              ) : (
                                <>
                                  <Sparkles className="mr-1 h-3 w-3" />
                                  Analyze Job
                                </>
                              )}
                            </Button>

                            {localStorage.getItem('cv') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => analyzeCVMatch(job)}
                                disabled={isCVAnalyzing[job.id] || !!job.cvMatchAnalysis}
                                className="h-6 text-xs"
                              >
                                {isCVAnalyzing[job.id] ? (
                                  <>
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    Matching...
                                  </>
                                ) : job.cvMatchAnalysis ? (
                                  <>
                                    <TrendingUp className="mr-1 h-3 w-3" />
                                    CV Matched
                                  </>
                                ) : (
                                  <>
                                    <Target className="mr-1 h-3 w-3" />
                                    Match CV
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:text-right">
                      {appliedJobs[job.id] ? (
                        <div className={`text-sm py-1 px-3 rounded ${
                          appliedJobs[job.id].success 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {appliedJobs[job.id].success ? 'Applied' : 'Application Failed'}
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleApply(job)}
                          disabled={isApplying[job.id]}
                          className="mt-2 md:mt-0"
                        >
                          {isApplying[job.id] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Applying...
                            </>
                          ) : 'Apply Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-3">{job.description}</p>
                    
                    {job.cvMatchAnalysis && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span className="font-medium text-purple-800 dark:text-purple-300">
                            CV Match Analysis ({job.cvMatchAnalysis.matchPercentage}% Match)
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <h4 className="font-medium text-green-700 dark:text-green-300 mb-1">✅ Strengths</h4>
                            <ul className="list-disc list-inside space-y-1 text-green-600 dark:text-green-400">
                              {job.cvMatchAnalysis.strengths.map((strength, i) => (
                                <li key={i}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">⚠️ Gaps</h4>
                            <ul className="list-disc list-inside space-y-1 text-red-600 dark:text-red-400">
                              {job.cvMatchAnalysis.gaps.map((gap, i) => (
                                <li key={i}>{gap}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="md:col-span-2">
                            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Improvements</h4>
                            <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                              {job.cvMatchAnalysis.improvements.map((improvement, i) => (
                                <li key={i}>{improvement}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {job.geminiAnalysis && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span className="font-medium text-purple-800 dark:text-purple-300">Gemini AI Analysis</span>
                        </div>
                        <div className="text-sm text-purple-900 dark:text-purple-100 whitespace-pre-wrap">
                          {job.geminiAnalysis}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {job.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {searchResults.length === 0 && !isSearching && (
        <div className="text-center py-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Search className="text-muted-foreground" size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or location
          </p>
        </div>
      )}
    </div>
  );
};

export default JobSearchWithGemini;
