import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Crown, Zap, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  plan_duration?: string;
  subscription_end?: string;
}

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData>({ subscribed: false });
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const plans = {
    basic: {
      name: "Basic",
      icon: <Star className="w-6 h-6" />,
      description: "Perfect for students starting their job search",
      weekly: { price: "₹49", originalPrice: "₹99" },
      "15-day": { price: "₹89", originalPrice: "₹149" },
      monthly: { price: "₹149", originalPrice: "₹249" },
      features: [
        "Up to 20 job applications per day",
        "Basic CV optimization",
        "Email support",
        "Job alerts",
        "Basic analytics"
      ]
    },
    premium: {
      name: "Premium",
      icon: <Crown className="w-6 h-6" />,
      description: "Best for serious job seekers",
      weekly: { price: "₹99", originalPrice: "₹149" },
      "15-day": { price: "₹179", originalPrice: "₹249" },
      monthly: { price: "₹299", originalPrice: "₹399" },
      features: [
        "Unlimited job applications",
        "Advanced CV optimization with AI",
        "Priority support",
        "Advanced job matching",
        "Detailed analytics & insights",
        "Interview preparation tips",
        "LinkedIn profile optimization"
      ],
      popular: true
    }
  };

  useEffect(() => {
    checkAuthAndSubscription();
  }, []);

  const checkAuthAndSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await checkSubscription();
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  const checkSubscription = async () => {
    setCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      setSubscription(data);
      console.log("Subscription status:", data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast.error("Failed to check subscription status");
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async (tier: string, duration: string) => {
    if (!user) {
      toast.error("Please login to subscribe");
      navigate("/");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier, duration }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Failed to create checkout session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Failed to open subscription management");
    } finally {
      setIsLoading(false);
    }
  };

  const PlanCard = ({ tier, plan, duration }: { tier: string, plan: any, duration: string }) => {
    const isCurrentPlan = subscription.subscribed && 
                          subscription.subscription_tier === tier && 
                          subscription.plan_duration === duration;

    return (
      <Card className={`relative h-full transition-all duration-300 hover:shadow-lg ${
        plan.popular ? 'border-primary shadow-md' : ''
      } ${isCurrentPlan ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge variant="default" className="bg-primary text-primary-foreground">
              Most Popular
            </Badge>
          </div>
        )}
        {isCurrentPlan && (
          <div className="absolute -top-3 right-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
              Your Plan
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2 text-primary">
            {plan.icon}
          </div>
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <CardDescription className="text-sm">{plan.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="text-center pb-4">
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-3xl font-bold text-primary">
                {plan[duration].price}
              </span>
              <span className="text-sm text-muted-foreground">/{duration}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm line-through text-muted-foreground">
                {plan[duration].originalPrice}
              </span>
              <Badge variant="secondary" className="text-xs">
                Save {Math.round((1 - parseInt(plan[duration].price.replace('₹', '')) / parseInt(plan[duration].originalPrice.replace('₹', ''))) * 100)}%
              </Badge>
            </div>
          </div>
          
          <ul className="space-y-2 text-sm text-left">
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="pt-0">
          {isCurrentPlan ? (
            <Button 
              onClick={handleManageSubscription}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
              Manage Subscription
            </Button>
          ) : (
            <Button 
              onClick={() => handleSubscribe(tier, duration)}
              disabled={isLoading || !user}
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
              {!user ? "Login to Subscribe" : "Get Started"}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Perfect Plan</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Affordable pricing designed for Indian students
          </p>
          
          {user && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                onClick={checkSubscription}
                disabled={checkingSubscription}
                variant="outline"
                size="sm"
              >
                {checkingSubscription ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Check Status
              </Button>
              
              {subscription.subscribed && (
                <div className="text-sm text-muted-foreground">
                  Current: {subscription.subscription_tier} ({subscription.plan_duration})
                  {subscription.subscription_end && (
                    <> until {new Date(subscription.subscription_end).toLocaleDateString()}</>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="15-day">15 Days</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          {["weekly", "15-day", "monthly"].map((duration) => (
            <TabsContent key={duration} value={duration}>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {Object.entries(plans).map(([tier, plan]) => (
                  <PlanCard key={tier} tier={tier} plan={plan} duration={duration} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-6">Why Choose Our Platform?</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Student-Friendly Pricing</h4>
              <p className="text-sm text-muted-foreground">
                Designed specifically for Indian students with pocket-friendly rates
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">AI-Powered Matching</h4>
              <p className="text-sm text-muted-foreground">
                Smart job matching based on your skills and preferences
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">24/7 Support</h4>
              <p className="text-sm text-muted-foreground">
                Get help whenever you need it with our dedicated support team
              </p>
            </div>
          </div>
        </div>

        {!user && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Ready to start your job search journey?
            </p>
            <Button onClick={() => navigate("/")} size="lg">
              Sign Up Now
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;