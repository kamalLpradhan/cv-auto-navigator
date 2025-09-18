-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on alerts" ON public.alerts;
DROP POLICY IF EXISTS "Allow all operations on network_health" ON public.network_health;
DROP POLICY IF EXISTS "Allow all operations on system_metrics" ON public.system_metrics;
DROP POLICY IF EXISTS "Allow all operations on power_logs" ON public.power_logs;

-- Create secure policies for alerts table
CREATE POLICY "Authenticated users can view alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create alerts"
ON public.alerts
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update alerts"
ON public.alerts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete alerts"
ON public.alerts
FOR DELETE
TO authenticated
USING (true);

-- Create secure policies for network_health table
CREATE POLICY "Authenticated users can view network health"
ON public.network_health
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert network health"
ON public.network_health
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update network health"
ON public.network_health
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete network health"
ON public.network_health
FOR DELETE
TO authenticated
USING (true);

-- Create secure policies for system_metrics table
CREATE POLICY "Authenticated users can view system metrics"
ON public.system_metrics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert system metrics"
ON public.system_metrics
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update system metrics"
ON public.system_metrics
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete system metrics"
ON public.system_metrics
FOR DELETE
TO authenticated
USING (true);

-- Create secure policies for power_logs table
CREATE POLICY "Authenticated users can view power logs"
ON public.power_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert power logs"
ON public.power_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update power logs"
ON public.power_logs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete power logs"
ON public.power_logs
FOR DELETE
TO authenticated
USING (true);