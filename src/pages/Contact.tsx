
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll respond shortly.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-background/70">
      <Header />
      
      <main className="flex-1 flex flex-col pt-20">
        <div className="container px-4 md:px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
              <p className="text-muted-foreground md:text-lg">
                Have a question or feedback? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                      <Input 
                        id="subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <Textarea 
                        id="message" 
                        rows={5} 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Our Office</h3>
                  <p className="text-muted-foreground">
                    123 Tech Avenue<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground">
                    support@cvnavigator.com<br />
                    info@cvnavigator.com
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground">
                    +1 (555) 123-4567<br />
                    Mon-Fri: 9:00 AM - 5:00 PM PST
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">Twitter</a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">LinkedIn</a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">Facebook</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
