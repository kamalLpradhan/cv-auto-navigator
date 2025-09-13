-- Fix the unrestricted UPDATE policy on subscribers table
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create a proper UPDATE policy that restricts to user's own subscription
CREATE POLICY "Users can update their own subscription"
ON public.subscribers
FOR UPDATE
TO authenticated
USING ((user_id = auth.uid()) OR (email = auth.email()))
WITH CHECK ((user_id = auth.uid()) OR (email = auth.email()));

-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;