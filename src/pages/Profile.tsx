
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

const Profile = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

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
      avatar
    };
    
    login(updatedUser);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
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
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
