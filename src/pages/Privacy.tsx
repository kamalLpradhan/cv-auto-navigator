
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-background/70">
      <Header />
      
      <main className="flex-1 flex flex-col pt-20">
        <div className="container px-4 md:px-6 py-12">
          <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:font-heading">
            <div className="space-y-4 mb-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl not-prose">Privacy Policy</h1>
              <p className="text-muted-foreground md:text-lg not-prose">Last updated: April 3, 2025</p>
            </div>
            
            <section className="mb-8">
              <h2>1. Introduction</h2>
              <p>
                CV Navigator ("we," "us," or "our") respects your privacy and is committed to protecting it through our compliance with this policy.
                This policy describes the types of information we may collect from you or that you may provide when you use our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>2. Information We Collect</h2>
              <p>We collect several types of information from and about users of our website, including information:</p>
              <ul>
                <li>By which you may be personally identified, such as name, email address, and resume/CV content ("personal information");</li>
                <li>That is about you but individually does not identify you, such as job search criteria and preferences;</li>
                <li>About your internet connection, the equipment you use to access our website, and usage details.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>3. How We Use Your Information</h2>
              <p>We use information that we collect about you or that you provide to us, including any personal information:</p>
              <ul>
                <li>To present our website and its contents to you;</li>
                <li>To provide you with information, products, or services that you request from us;</li>
                <li>To fulfill the purposes for which you provided it, such as enabling automatic job applications;</li>
                <li>To provide you with notices about your account;</li>
                <li>To improve our website and user experience;</li>
                <li>In any other way we may describe when you provide the information;</li>
                <li>For any other purpose with your consent.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>4. Disclosure of Your Information</h2>
              <p>We may disclose personal information that we collect or you provide as described in this privacy policy:</p>
              <ul>
                <li>To employers when you apply for jobs through our service;</li>
                <li>To comply with any court order, law, or legal process;</li>
                <li>To enforce our rights arising from any contracts entered into between you and us;</li>
                <li>If we believe disclosure is necessary to protect the rights, property, or safety of CV Navigator, our users, or others.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>5. Data Security</h2>
              <p>
                We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. 
                All information you provide to us is stored on secure servers behind firewalls.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>6. Your Choices About Our Collection and Use of Your Information</h2>
              <p>
                You can choose not to provide us with certain personal information, but that may result in you being unable to use certain features of our website.
                You can access and update your personal information by logging into your account settings.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>7. Changes to Our Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. If we make material changes to how we treat our users' personal information,
                we will notify you through a notice on the website home page.
              </p>
            </section>
            
            <section>
              <h2>8. Contact Information</h2>
              <p>
                To ask questions or comment about this privacy policy and our privacy practices, contact us at:<br />
                privacy@cvnavigator.com
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
