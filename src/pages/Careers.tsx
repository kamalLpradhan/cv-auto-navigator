
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin } from "lucide-react";

const Careers = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-background/70">
      <Header />
      
      <main className="flex-1 flex flex-col pt-20">
        <div className="container px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 mb-12 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Careers</h1>
              <p className="text-muted-foreground md:text-lg">
                Join our team and help shape the future of career navigation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Us for Career Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">
                      careers@cvnavigator.com
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">HR Department</h3>
                    <p className="text-muted-foreground">
                      hr@cvnavigator.com
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Our Office
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    123 Tech Avenue<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Join Us?</h2>
              <p className="text-muted-foreground mb-6">
                Send your resume and cover letter to our careers email, and we'll get back to you soon!
              </p>
              <a 
                href="mailto:careers@cvnavigator.com" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Your Application
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
