-- Tighten RLS for public.users to prevent public access to emails
-- Drop overly-permissive policies
DROP POLICY IF EXISTS "Enable to read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable to readd access for all users" ON public.users;

-- Restrict SELECT to the logged-in user's own row (matched by email)
CREATE POLICY "Users can read their own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.email() = email);

-- Restrict INSERT so users can only create a row for their own email
CREATE POLICY "Users can insert their own record"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.email() = email);

-- Keep existing UPDATE policy in place (already constrained by email)
-- No change required here.
