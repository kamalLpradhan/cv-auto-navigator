
import { useState } from "react";
import { MessageCircle, X, Bot, Send } from "lucide-react";
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

type Message = {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
};

export default function ChatbotHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      text: "👋 Hi there! I'm your CV Navigator assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
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

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        cv: "You can upload your CV on the Upload page. We'll analyze it and use it to match you with suitable job positions.",
        job: "You can search for jobs on the Apply page. We'll help you find and apply to positions that match your profile.",
        apply: "On the Apply page, you can see jobs and use our auto-apply feature. For jobs that can't be applied to automatically, we'll guide you through the manual process.",
        track: "You can track all your applications on the Dashboard page. It shows the status of each application and provides contact information when available.",
        contact: "You can see contact information for recruiters on the Dashboard page. If an email isn't available, we'll try to find their LinkedIn profile.",
        default: "I'm here to help with your job search. You can ask me about uploading your CV, finding jobs, tracking applications, or any other features of CV Navigator.",
      };

      // Simple keyword matching for demo purposes
      const keyword = Object.keys(botResponses).find(key => 
        inputValue.toLowerCase().includes(key)
      ) || "default";

      const botMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        text: botResponses[keyword],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
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
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" aria-label="Close chatbot">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
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
                  <p className="text-sm">{message.text}</p>
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
            <Input
              placeholder="Type your question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
