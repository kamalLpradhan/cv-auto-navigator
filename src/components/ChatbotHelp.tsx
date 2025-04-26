
import { useState, useEffect } from "react";
import { MessageCircle, X, Bot, Send, Key, Loader2, Search } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Message = {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
};

export default function ChatbotHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [location, setLocation] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      text: "👋 Hi there! I'm your CV Navigator assistant powered by Gemini AI. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    // Check if API key is stored in localStorage
    const storedApiKey = localStorage.getItem("gemini_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      // Show API key dialog only when chat is opened for the first time
      const hasShownApiDialog = localStorage.getItem("has_shown_api_dialog");
      if (!hasShownApiDialog && isOpen) {
        setApiKeyDialogOpen(true);
        localStorage.setItem("has_shown_api_dialog", "true");
      }
    }
  }, [isOpen]);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setApiKeyDialogOpen(false);
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved successfully.",
      });
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key to continue.",
        variant: "destructive",
      });
    }
  };

  const generateGeminiResponse = async (userMessage: string) => {
    if (!apiKey) {
      setApiKeyDialogOpen(true);
      return null;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
                    text: `You are a helpful assistant for a CV Navigator application that helps users upload CVs and apply to jobs automatically. 
                    Only answer questions related to job applications, CV management, and career advice.
                    
                    User query: ${userMessage}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error:", errorData);
        
        if (response.status === 400 && errorData.error?.message?.includes("API key")) {
          toast({
            title: "Invalid API Key",
            description: "Your Gemini API key appears to be invalid. Please update it in settings.",
            variant: "destructive",
          });
          setApiKeyDialogOpen(true);
          return "I'm having trouble connecting to my AI brain. Please check your API key.";
        }
        
        return "I'm sorry, I encountered an error while processing your request. Please try again later.";
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "I'm sorry, I couldn't generate a response. Please try a different question.";
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "I'm sorry, there was an error processing your request. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const searchForJobInfo = async () => {
    if (!apiKey) {
      setApiKeyDialogOpen(true);
      return;
    }
    
    if (!jobRole.trim()) {
      toast({
        title: "Job Role Required",
        description: "Please enter a job role to search for.",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: `I am looking for a ${jobRole} job${location ? ' in ' + location : ''}. What should I know?`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add loading indicator message
    const loadingId = "loading-" + Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        type: "bot",
        text: "Searching for job information...",
        timestamp: new Date(),
      },
    ]);

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
                    text: `You are a helpful career advisor and job search expert. 
                    Provide detailed, actionable information about the following job role: "${jobRole}"${location ? ' in ' + location : ''}. 
                    
                    Include:
                    1. Key skills and qualifications typically required
                    2. Typical salary range and job market outlook
                    3. Important keywords to include in a CV/resume for this role
                    4. Tips for successful job applications
                    5. Common interview questions for this role
                    
                    Format your response in clear, organized sections.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error:", errorData);
        
        // Remove loading message and add error response
        setMessages((prev) => 
          prev.filter(msg => msg.id !== loadingId).concat({
            id: Date.now().toString(),
            type: "bot",
            text: "I encountered an error while searching for job information. Please try again later.",
            timestamp: new Date(),
          })
        );
        
        if (response.status === 400 && errorData.error?.message?.includes("API key")) {
          toast({
            title: "Invalid API Key",
            description: "Your Gemini API key appears to be invalid. Please update it in settings.",
            variant: "destructive",
          });
          setApiKeyDialogOpen(true);
        }
        
        return;
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
        // Remove loading message and add real response
        setMessages((prev) => 
          prev.filter(msg => msg.id !== loadingId).concat({
            id: Date.now().toString(),
            type: "bot",
            text: data.candidates[0].content.parts[0].text,
            timestamp: new Date(),
          })
        );
      } else {
        // Remove loading message and add error response
        setMessages((prev) => 
          prev.filter(msg => msg.id !== loadingId).concat({
            id: Date.now().toString(),
            type: "bot",
            text: "I'm sorry, I couldn't generate information about this job role. Please try a different search.",
            timestamp: new Date(),
          })
        );
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      
      // Remove loading message and add error response
      setMessages((prev) => 
        prev.filter(msg => msg.id !== loadingId).concat({
          id: Date.now().toString(),
          type: "bot",
          text: "I'm sorry, there was an error processing your request. Please try again later.",
          timestamp: new Date(),
        })
      );
    } finally {
      setIsLoading(false);
      setJobRole("");
      setLocation("");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Add loading indicator message
    const loadingId = "loading-" + Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        type: "bot",
        text: "Thinking...",
        timestamp: new Date(),
      },
    ]);

    // Get response from Gemini API
    const aiResponse = await generateGeminiResponse(userMessage.text);

    // Remove loading message and add real response
    setMessages((prev) => 
      prev.filter(msg => msg.id !== loadingId).concat({
        id: Date.now().toString(),
        type: "bot",
        text: aiResponse || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleJobKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      searchForJobInfo();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Show API key dialog if API key is not set
    if (open && !apiKey) {
      setApiKeyDialogOpen(true);
    }
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full shadow-lg"
            size="icon"
            aria-label="Open help chatbot"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                CV Navigator Assistant
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Gemini AI
                </span>
              </DrawerTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setApiKeyDialogOpen(true)}
                  aria-label="API Key Settings"
                >
                  <Key className="h-4 w-4" />
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close chatbot">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </div>
            
            <Tabs className="mt-4" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="general" className="flex-1">General Chat</TabsTrigger>
                <TabsTrigger value="jobsearch" className="flex-1">Job Search</TabsTrigger>
              </TabsList>
            </Tabs>
          </DrawerHeader>

          <TabsContent value="general" className="m-0">
            <ScrollArea className="p-4 max-h-[50vh]">
              <div className="flex flex-col gap-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.text === "Thinking..." || message.text === "Searching for job information..." ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {message.text}
                          </span>
                        ) : (
                          message.text
                        )}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DrawerFooter className="border-t pt-2">
              <div className="flex items-center gap-2">
                <Textarea
                  placeholder="Type your question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-h-[50px] max-h-[150px]"
                  disabled={isLoading || !apiKey}
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || !apiKey}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {!apiKey && (
                <p className="text-xs text-muted-foreground mt-2">
                  Please set your Gemini API key to use the chatbot
                </p>
              )}
            </DrawerFooter>
          </TabsContent>

          <TabsContent value="jobsearch" className="m-0">
            <div className="p-4">
              <div className="space-y-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="job-role">Job Role</Label>
                  <Input 
                    id="job-role" 
                    placeholder="E.g., Data Scientist, Marketing Manager" 
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    onKeyDown={handleJobKeyDown}
                    disabled={isLoading || !apiKey}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input 
                    id="location" 
                    placeholder="E.g., New York, Remote" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handleJobKeyDown}
                    disabled={isLoading || !apiKey}
                  />
                </div>
                <Button 
                  className="w-full flex items-center gap-2" 
                  onClick={searchForJobInfo}
                  disabled={!jobRole.trim() || isLoading || !apiKey}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search Job Information
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Enter a job role to get:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Required skills and qualifications</li>
                  <li>Salary range information</li>
                  <li>CV keywords for this role</li>
                  <li>Application tips</li>
                  <li>Common interview questions</li>
                </ul>
              </div>
            </div>

            <ScrollArea className="px-4 pb-4 max-h-[30vh]">
              <div className="flex flex-col gap-3">
                {messages.filter(msg => 
                  msg.type === "user" && msg.text.includes("I am looking for") ||
                  msg.type === "bot" && (
                    messages.some(userMsg => 
                      userMsg.type === "user" && 
                      userMsg.text.includes("I am looking for") && 
                      userMsg.timestamp < msg.timestamp
                    )
                  )
                ).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.text === "Searching for job information..." ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {message.text}
                          </span>
                        ) : (
                          message.text
                        )}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </DrawerContent>
      </Drawer>

      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gemini API Key</DialogTitle>
            <DialogDescription>
              Enter your Gemini API key to enable AI-powered responses. You can get an API key from{" "}
              <a 
                href="https://ai.google.dev/tutorials/setup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored only in your browser's local storage and is not sent to our servers.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveApiKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
