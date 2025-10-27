import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Send, Eye, Calendar, Target } from "lucide-react";
import { useState, useEffect } from "react";

interface ApplicationStats {
  total: number;
  thisWeek: number;
  pending: number;
  viewed: number;
  interviews: number;
  responseRate: number;
}

const ApplicationStatsWidget = () => {
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    thisWeek: 0,
    pending: 0,
    viewed: 0,
    interviews: 0,
    responseRate: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const applications = JSON.parse(localStorage.getItem("applications") || "[]");
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const thisWeek = applications.filter((app: any) => {
        const appliedDate = new Date(app.appliedDate || app.created_at);
        return appliedDate >= oneWeekAgo;
      }).length;

      const statusCounts = applications.reduce(
        (acc: any, app: any) => {
          const status = app.status?.toLowerCase() || "pending";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {}
      );

      const viewed = statusCounts.viewed || 0;
      const interviews = statusCounts.interview || 0;
      const responseRate = applications.length > 0
        ? Math.round(((viewed + interviews) / applications.length) * 100)
        : 0;

      setStats({
        total: applications.length,
        thisWeek,
        pending: statusCounts.pending || statusCounts.applied || 0,
        viewed,
        interviews,
        responseRate,
      });
    };

    calculateStats();

    // Listen for application updates
    const handleUpdate = () => {
      setTimeout(calculateStats, 100);
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("applicationAdded", handleUpdate);
    window.addEventListener("applicationsRefresh", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("applicationAdded", handleUpdate);
      window.removeEventListener("applicationsRefresh", handleUpdate);
    };
  }, []);

  const statCards = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: Send,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "This Week",
      value: stats.thisWeek,
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Viewed",
      value: stats.viewed,
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Interviews",
      value: stats.interviews,
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="card-hover">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    {stat.label === "This Week" && stat.value > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Response Rate Card */}
      {stats.total > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Response Rate</p>
                <p className="text-3xl font-bold text-primary">{stats.responseRate}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {stats.viewed + stats.interviews} responses
                </p>
                <p className="text-xs text-muted-foreground">
                  out of {stats.total} applications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationStatsWidget;
