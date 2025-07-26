import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { tier, duration } = await req.json();
    logStep("Received request", { tier, duration });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Define pricing
    const pricing = {
      basic: {
        weekly: 4900, // ₹49 in paisa
        "15-day": 8900, // ₹89 in paisa
        monthly: 14900, // ₹149 in paisa
      },
      premium: {
        weekly: 9900, // ₹99 in paisa
        "15-day": 17900, // ₹179 in paisa
        monthly: 29900, // ₹299 in paisa
      }
    };

    const amount = pricing[tier as keyof typeof pricing][duration as keyof typeof pricing.basic];
    if (!amount) throw new Error("Invalid tier or duration");

    // Determine billing interval for Stripe
    let interval: "week" | "month" = "month";
    let intervalCount = 1;
    
    if (duration === "weekly") {
      interval = "week";
      intervalCount = 1;
    } else if (duration === "15-day") {
      interval = "week";
      intervalCount = 2; // Approximately 2 weeks for 15 days
    } else if (duration === "monthly") {
      interval = "month";
      intervalCount = 1;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { 
              name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan - ${duration}`,
              description: `Job Search Platform ${tier} subscription for ${duration}`
            },
            unit_amount: amount,
            recurring: { 
              interval: interval,
              interval_count: intervalCount
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/pricing?success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      metadata: {
        tier: tier,
        duration: duration,
        user_id: user.id
      }
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});