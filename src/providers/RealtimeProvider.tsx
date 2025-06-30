
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealtimeContextType {
  isConnected: boolean;
  newJobsCount: number;
  lastUpdate: Date | null;
  refreshJobSearch: () => void;
  markJobsAsViewed: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [newJobsCount, setNewJobsCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create a channel for real-time updates
    const channel = supabase
      .channel('job-updates')
      .on('broadcast', { event: 'new-jobs' }, (payload) => {
        console.log('New jobs found:', payload);
        setNewJobsCount(prev => prev + payload.count);
        setLastUpdate(new Date());
        
        toast({
          title: "New Jobs Found!",
          description: `${payload.count} new job(s) matching your criteria`,
        });
      })
      .on('broadcast', { event: 'application-update' }, (payload) => {
        console.log('Application status updated:', payload);
        
        // Trigger application refresh
        window.dispatchEvent(new CustomEvent('applicationsRefresh'));
        
        toast({
          title: "Application Updated",
          description: `Status changed to: ${payload.status}`,
        });
      })
      .subscribe((status) => {
        console.log('Realtime connection status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Set up periodic job search polling
    const pollInterval = setInterval(() => {
      // Trigger automatic job search refresh
      window.dispatchEvent(new CustomEvent('autoJobRefresh'));
      setLastUpdate(new Date());
    }, 300000); // Every 5 minutes

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [toast]);

  const refreshJobSearch = () => {
    window.dispatchEvent(new CustomEvent('manualJobRefresh'));
    setLastUpdate(new Date());
  };

  const markJobsAsViewed = () => {
    setNewJobsCount(0);
  };

  return (
    <RealtimeContext.Provider value={{
      isConnected,
      newJobsCount,
      lastUpdate,
      refreshJobSearch,
      markJobsAsViewed
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};
