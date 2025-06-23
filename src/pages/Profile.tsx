
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Linkedin, Globe, Github, Twitter } from "lucide-react";

const Profile = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  
  // Social media and job website profiles
  const [linkedinProfile, setLinkedinProfile] = useState(user?.linkedinProfile || "");
  const [githubProfile, setGithubProfile] = useState(user?.githubProfile || "");
  const [portfolioWebsite, setPortfolioWebsite] = useState(user?.portfolioWebsite || "");
  const [twitterProfile, setTwitterProfile] = useState(user?.twitterProfile || "");
  const [indeedProfile, setIndeedProfile] = useState(user?.indeedProfile || "");
  const [glassdoorProfile, setGlassdoorProfile] = useState(user?.glassdoorProfile || "");

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">You need to be logged in to access this page</h1>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      email,
      avatar,
      linkedinProfile,
      githubProfile,
      portfolioWebsite,
      twitterProfile,
      indeedProfile,
      glassdoorProfile
    };
    
    // Save to localStorage for application tracking
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    
    login(updatedUser);
    
    toast({
      title: "Profile updated",
      description: "Your profile information and social media profiles have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      {avatar ? (
                        <AvatarImage src={avatar} alt={name} />
                      ) : (
                        <AvatarFallback className="text-xl">
                          {name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        id="avatar"
                        placeholder="Avatar URL (e.g. https://example.com/avatar.jpg)"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter a URL to your profile picture
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media & Professional Profiles
                </CardTitle>
                <CardDescription>
                  Add your social media and job website profiles. This information will be automatically used when tracking your job applications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/your-profile"
                      value={linkedinProfile}
                      onChange={(e) => setLinkedinProfile(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub Profile
                    </Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/your-username"
                      value={githubProfile}
                      onChange={(e) => setGithubProfile(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="portfolio" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Portfolio Website
                    </Label>
                    <Input
                      id="portfolio"
                      placeholder="https://your-portfolio.com"
                      value={portfolioWebsite}
                      onChange={(e) => setPortfolioWebsite(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-blue-400" />
                      Twitter Profile
                    </Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/your-handle"
                      value={twitterProfile}
                      onChange={(e) => setTwitterProfile(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="indeed" className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-700" />
                      Indeed Profile
                    </Label>
                    <Input
                      id="indeed"
                      placeholder="https://indeed.com/r/your-profile"
                      value={indeedProfile}
                      onChange={(e) => setIndeedProfile(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="glassdoor" className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-green-600" />
                      Glassdoor Profile
                    </Label>
                    <Input
                      id="glassdoor"
                      placeholder="https://glassdoor.com/profile/your-profile"
                      value={glassdoorProfile}
                      onChange={(e) => setGlassdoorProfile(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> These profiles will be automatically included when you apply to jobs, 
                    helping you track where you've applied and maintaining consistent profile information across platforms.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
              <Button onClick={handleSave}>Save All Changes</Button>
            </CardFooter>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
