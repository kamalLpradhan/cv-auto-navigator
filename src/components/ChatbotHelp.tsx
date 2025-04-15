
import { useState, useEffect } from "react";
import { MessageCircle, X, Bot, Send, Key, Loader2 } from "lucide-react";
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
          </DrawerHeader>

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
                      {message.text === "Thinking..." ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Thinking...
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
