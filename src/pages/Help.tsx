
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Help = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-background/70">
      <Header />
      
      <main className="flex-1 flex flex-col pt-20">
        <div className="container px-4 md:px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Help Center</h1>
              <p className="text-muted-foreground md:text-lg">Find answers to common questions about using CV Navigator.</p>
            </div>
            
            <div className="space-y-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I upload my CV?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Upload page, then drag and drop your CV file or click to select it from your computer. 
                    We accept PDF, DOCX, and TXT formats. After uploading, our system will automatically extract your information.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How does the automatic job application work?</AccordionTrigger>
                  <AccordionContent>
                    Once your CV is uploaded, browse available jobs in the Apply section. When you find a job you like, 
                    click "Apply" and our system will automatically submit your CV to that position, saving you time on filling out applications manually.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I track my job applications?</AccordionTrigger>
                  <AccordionContent>
                    Yes! The Dashboard section provides a comprehensive overview of all your applications, 
                    including their status and any updates. You can filter by job source, status, and date applied.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    We take data security very seriously. Your CV and personal information are encrypted and stored securely. 
                    We never share your information with third parties without your explicit consent. Please see our Privacy Policy for more details.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
                <p className="text-muted-foreground mb-6">Our support team is here to help you with any other questions you might have.</p>
                <Button asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help;
