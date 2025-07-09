
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-background/70">
      <Header />
      
      <main className="flex-1 flex flex-col pt-20">
        <div className="container px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 mb-10">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Terms of Service</h1>
              <p className="text-muted-foreground md:text-lg">Last updated: April 3, 2025</p>
            </div>
            
            <Tabs defaultValue="general" className="mb-10">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6 prose dark:prose-invert max-w-none">
                <section>
                  <h2>1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using CV Navigator's services, you agree to be bound by these Terms of Service ("Terms"). 
                    If you do not agree to these Terms, do not access or use our services.
                  </p>
                </section>
                
                <section>
                  <h2>2. Changes to Terms</h2>
                  <p>
                    We may revise and update these Terms from time to time at our sole discretion. All changes are effective 
                    immediately when we post them. Your continued use of the services following the posting of revised Terms 
                    means that you accept and agree to the changes.
                  </p>
                </section>
                
                <section>
                  <h2>3. Accessing the Services</h2>
                  <p>
                    We reserve the right to withdraw or modify the services we provide, in our sole discretion without notice. 
                    We will not be liable if for any reason all or any part of the services are unavailable at any time or for any period.
                  </p>
                </section>
                
                <section>
                  <h2>4. Service Description</h2>
                  <p>
                    CV Navigator provides an automated job application service that allows users to upload their CVs and 
                    automatically apply to jobs. We do not guarantee employment or the accuracy, completeness, or utility of any content 
                    or applications submitted through our services.
                  </p>
                </section>
              </TabsContent>
              
              <TabsContent value="accounts" className="space-y-6 prose dark:prose-invert max-w-none">
                <section>
                  <h2>5. User Accounts</h2>
                  <p>
                    To access certain features of the services, you may be required to register for an account. You agree to 
                    provide accurate, current, and complete information during the registration process and to update such 
                    information to keep it accurate, current, and complete.
                  </p>
                </section>
                
                <section>
                  <h2>6. Account Security</h2>
                  <p>
                    You are responsible for safeguarding the password that you use to access the services and for any activities 
                    or actions under your account. We encourage you to use "strong" passwords (passwords that use a combination of 
                    upper and lower case letters, numbers, and symbols) with your account.
                  </p>
                </section>
                
                <section>
                  <h2>7. Account Termination</h2>
                  <p>
                    We reserve the right to terminate or suspend your access to all or part of the services for any or no reason, 
                    including without limitation, any violation of these Terms. We may, in our sole discretion, terminate your account
                    if you breach these Terms.
                  </p>
                </section>
                
                <section>
                  <h2>8. Social Sign-In</h2>
                  <p>
                    When you sign in using a third-party service (such as Google, GitHub, or X), you authorize us to access and store your 
                    information from that service as permitted by that service, and to use and disclose it in accordance with our Privacy Policy.
                  </p>
                </section>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-6 prose dark:prose-invert max-w-none">
                <section>
                  <h2>9. User Content</h2>
                  <p>
                    Our services allow you to upload, submit, store, send or receive content, including your CV, personal information, 
                    and other materials ("User Content"). You retain ownership of any intellectual property rights that you hold in that 
                    User Content.
                  </p>
                </section>
                
                <section>
                  <h2>10. License to User Content</h2>
                  <p>
                    When you upload, submit, store, send or receive User Content to or through our services, you give CV Navigator 
                    a worldwide license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly 
                    perform, publicly display and distribute such User Content solely for the purpose of providing and improving our services.
                  </p>
                </section>
                
                <section>
                  <h2>11. Content Restrictions</h2>
                  <p>
                    You agree not to upload, submit, store, send, or receive any User Content that:
                  </p>
                  <ul>
                    <li>Is false, misleading, or deceptive;</li>
                    <li>Is defamatory, obscene, pornographic, vulgar, or offensive;</li>
                    <li>Promotes discrimination, bigotry, racism, hatred, harassment, or harm against any individual or group;</li>
                    <li>Is violent or threatening or promotes violence or actions that are threatening to any person or entity;</li>
                    <li>Infringes any patent, trademark, trade secret, copyright, or other intellectual property rights;</li>
                    <li>Violates or encourages any conduct that would violate any applicable law or regulation.</li>
                  </ul>
                </section>
                
                <section>
                  <h2>12. Content Removal</h2>
                  <p>
                    We reserve the right to remove any User Content that violates these Terms or that we find objectionable 
                    for any reason, in our sole discretion.
                  </p>
                </section>
              </TabsContent>
              
              <TabsContent value="legal" className="space-y-6 prose dark:prose-invert max-w-none">
                <section>
                  <h2>13. Disclaimer of Warranties</h2>
                  <p>
                    THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
                    WITHOUT LIMITING THE FOREGOING, WE EXPLICITLY DISCLAIM ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                    PURPOSE, QUIET ENJOYMENT, OR NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE.
                  </p>
                </section>
                
                <section>
                  <h2>14. Limitation of Liability</h2>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CV NAVIGATOR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                    SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR 
                    INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                  </p>
                </section>
                
                <section>
                  <h2>15. Indemnification</h2>
                  <p>
                    You agree to defend, indemnify, and hold harmless CV Navigator and its officers, directors, employees, and agents, 
                    from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses arising 
                    from: (a) your use of and access to the services; (b) your violation of any term of these Terms; (c) your violation of 
                    any third-party right, including without limitation any copyright, property, or privacy right; or (d) any claim that your 
                    User Content caused damage to a third party.
                  </p>
                </section>
                
                <section>
                  <h2>16. Governing Law</h2>
                  <p>
                    These Terms shall be governed by the laws of the jurisdiction in which CV Navigator is registered, without respect 
                    to its conflict of laws principles. You agree to submit to the personal and exclusive jurisdiction of the courts 
                    located within that jurisdiction.
                  </p>
                </section>
                
                <section>
                  <h2>17. Dispute Resolution</h2>
                  <p>
                    Any dispute arising out of or relating to these Terms or our services shall first be resolved through good-faith 
                    negotiation. If such negotiation fails, the dispute shall be resolved through binding arbitration in accordance with 
                    the rules of the American Arbitration Association.
                  </p>
                </section>
                
                <section>
                  <h2>18. Severability</h2>
                  <p>
                    If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated 
                    to the minimum extent necessary so that these Terms will otherwise remain in full force and effect and enforceable.
                  </p>
                </section>
                
                <section>
                  <h2>19. Entire Agreement</h2>
                  <p>
                    These Terms constitute the entire agreement between you and CV Navigator regarding our services and supersede all prior 
                    and contemporaneous agreements, proposals, or representations, written or oral, concerning its subject matter.
                  </p>
                </section>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-8" />
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at:<br />
                legal@cvnavigator.com<br />
                123 Tech Avenue, San Francisco, CA 94107
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
