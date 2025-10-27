import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Eye, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PipelineStage {
  id: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  count: number;
}

const ApplicationPipeline = () => {
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: "applied",
      label: "Applied",
      icon: Send,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      count: 0,
    },
    {
      id: "viewed",
      label: "Viewed",
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      count: 0,
    },
    {
      id: "interview",
      label: "Interview",
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      count: 0,
    },
    {
      id: "offer",
      label: "Offer",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      count: 0,
    },
    {
      id: "rejected",
      label: "Rejected",
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      count: 0,
    },
  ]);

  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    const updatePipeline = () => {
      const applications = JSON.parse(localStorage.getItem("applications") || "[]");
      
      // Count by status
      const statusCounts: Record<string, number> = {};
      applications.forEach((app: any) => {
        const status = app.status?.toLowerCase() || "applied";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      // Update stage counts
      setStages((prev) =>
        prev.map((stage) => ({
          ...stage,
          count: statusCounts[stage.id] || 0,
        }))
      );

      // Get 3 most recent applications
      const sorted = [...applications].sort((a, b) => {
        const dateA = new Date(a.appliedDate || a.created_at).getTime();
        const dateB = new Date(b.appliedDate || b.created_at).getTime();
        return dateB - dateA;
      });
      setRecentApplications(sorted.slice(0, 3));
    };

    updatePipeline();

    const handleUpdate = () => {
      setTimeout(updatePipeline, 100);
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

  const totalApplications = stages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Application Pipeline
        </CardTitle>
        <CardDescription>
          Track your applications through each stage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pipeline Stages */}
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const percentage = totalApplications > 0
              ? Math.round((stage.count / totalApplications) * 100)
              : 0;

            return (
              <div key={stage.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", stage.bgColor)}>
                      <Icon className={cn("h-4 w-4", stage.color)} />
                    </div>
                    <div>
                      <p className="font-medium">{stage.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {stage.count} application{stage.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{percentage}%</Badge>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-500", stage.bgColor)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Divider */}
                {index < stages.length - 1 && (
                  <div className="flex items-center justify-center py-1">
                    <div className="h-4 w-px bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        {recentApplications.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-medium">Recent Activity</p>
            <div className="space-y-2">
              {recentApplications.map((app) => {
                const status = app.status?.toLowerCase() || "applied";
                const stage = stages.find((s) => s.id === status);
                const Icon = stage?.icon || Send;

                return (
                  <div
                    key={app.id || app.jobId}
                    className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className={cn("p-1.5 rounded", stage?.bgColor || "bg-blue-500/10")}>
                      <Icon className={cn("h-3 w-3", stage?.color || "text-blue-500")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{app.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {app.company}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {stage?.label || "Applied"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalApplications === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No applications yet. Start applying to see your pipeline!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationPipeline;
