-- Fix critical security vulnerability: Restrict subscription insertions to authenticated users only
-- Drop the insecure policy that allows anyone to insert
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create a secure INSERT policy that only allows authenticated users to create their own subscription
CREATE POLICY "Users can insert their own subscription" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    email = auth.email()
  )
);

-- Also add a DELETE policy for completeness (users should be able to delete their own subscription)
CREATE POLICY "Users can delete their own subscription" 
ON public.subscribers 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    email = auth.email()
  )
);