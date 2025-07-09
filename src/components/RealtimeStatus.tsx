
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, Bell } from 'lucide-react';
import { useRealtime } from '@/providers/RealtimeProvider';

const RealtimeStatus = () => {
  const { isConnected, newJobsCount, lastUpdate, refreshJobSearch, markJobsAsViewed } = useRealtime();

  return (
    <div className="flex items-center gap-2">
      {/* Connection Status */}
      <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnected ? 'Live' : 'Offline'}
      </Badge>

      {/* New Jobs Notification */}
      {newJobsCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={markJobsAsViewed}
          className="relative flex items-center gap-1"
        >
          <Bell className="h-3 w-3" />
          {newJobsCount} new
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
        </Button>
      )}

      {/* Manual Refresh */}
      <Button
        variant="ghost"
        size="sm"
        onClick={refreshJobSearch}
        className="flex items-center gap-1"
      >
        <RefreshCw className="h-3 w-3" />
        Refresh
      </Button>

      {/* Last Update Time */}
      {lastUpdate && (
        <span className="text-xs text-muted-foreground">
          Updated: {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default RealtimeStatus;
