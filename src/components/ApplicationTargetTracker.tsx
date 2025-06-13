
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, Target, CheckCircle2 } from "lucide-react";
import { Application } from './ApplicationTracker';

interface ApplicationTargetTrackerProps {
  applications: Application[];
}

// Helper function to group applications by date
const groupApplicationsByDate = (applications: Application[], timeframe: 'weekly' | 'monthly') => {
  if (!applications || applications.length === 0) return [];

  const now = new Date();
  const result: { name: string; applied: number; reviewed: number; failed: number; interviews: number; }[] = [];

  // Create date ranges based on timeframe
  if (timeframe === 'weekly') {
    // Generate last 5 weeks
    for (let i = 4; i >= 0; i--) {
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() - (i * 7));
      
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      
      const weekLabel = `Week ${5-i}`;
      
      const applied = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate >= startDate && appDate <= endDate;
      }).length;
      
      const reviewed = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate >= startDate && appDate <= endDate && app.status === 'In Review';
      }).length;
      
      const failed = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate >= startDate && appDate <= endDate && (app.status === 'Failed' || app.status === 'Rejected');
      }).length;
      
      const interviews = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate >= startDate && appDate <= endDate && app.status === 'Interview';
      }).length;
      
      result.push({
        name: weekLabel,
        applied,
        reviewed,
        failed,
        interviews
      });
    }
  } else {
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      
      const monthLabel = startDate.toLocaleString('default', { month: 'short' });
      
      const applied = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate.getMonth() === startDate.getMonth() && 
               appDate.getFullYear() === startDate.getFullYear();
      }).length;
      
      const reviewed = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate.getMonth() === startDate.getMonth() && 
               appDate.getFullYear() === startDate.getFullYear() && 
               app.status === 'In Review';
      }).length;
      
      const failed = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate.getMonth() === startDate.getMonth() && 
               appDate.getFullYear() === startDate.getFullYear() && 
               (app.status === 'Failed' || app.status === 'Rejected');
      }).length;
      
      const interviews = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate.getMonth() === startDate.getMonth() && 
               appDate.getFullYear() === startDate.getFullYear() && 
               app.status === 'Interview';
      }).length;
      
      result.push({
        name: monthLabel,
        applied,
        reviewed,
        failed,
        interviews
      });
    }
  }
  
  return result;
};

const ApplicationTargetTracker = ({ applications }: ApplicationTargetTrackerProps) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    console.log('ApplicationTargetTracker - Received applications:', applications.length);
    const data = groupApplicationsByDate(applications, timeframe);
    console.log('ApplicationTargetTracker - Generated chart data:', data);
    setChartData(data);
  }, [applications, timeframe]);

  // Application target metrics
  const weeklyTarget = 10;
  const monthlyTarget = 40;
  const targetValue = timeframe === 'weekly' ? weeklyTarget : monthlyTarget;

  // Calculate totals
  const totalApplied = applications.length;
  const totalReviewed = applications.filter(app => app.status === 'In Review').length;
  const totalInterviews = applications.filter(app => app.status === 'Interview').length;
  const totalFailed = applications.filter(app => app.status === 'Failed' || app.status === 'Rejected').length;
  const totalOffers = applications.filter(app => app.status === 'Offer').length;
  
  // Calculate current period applications
  const now = new Date();
  let currentPeriodApplied = 0;
  
  if (timeframe === 'weekly') {
    // Current week (last 7 days)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    currentPeriodApplied = applications.filter(app => {
      const appDate = new Date(app.appliedDate);
      return appDate >= weekAgo && appDate <= now;
    }).length;
  } else {
    // Current month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentPeriodApplied = applications.filter(app => {
      const appDate = new Date(app.appliedDate);
      return appDate.getMonth() === now.getMonth() && 
             appDate.getFullYear() === now.getFullYear();
    }).length;
  }
  
  // Calculate progress percentage against target
  const targetProgress = Math.min(Math.round((currentPeriodApplied / targetValue) * 100), 100);

  // Get recent applications (last 5)
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  return (
    <Card className="glass-panel">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Application Target Tracker
        </CardTitle>
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as 'weekly' | 'monthly')}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Target progress */}
          <div className="flex flex-wrap gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary">{currentPeriodApplied}</div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Applied this {timeframe === 'weekly' ? 'week' : 'month'}</span>
                <span className="text-xs font-medium">Target: {targetValue}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {targetProgress}% of target
                </span>
                <span className="text-muted-foreground">{currentPeriodApplied}/{targetValue}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    targetProgress >= 100 ? 'bg-green-500' : 
                    targetProgress >= 75 ? 'bg-blue-500' : 
                    targetProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(targetProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground">Total Applied</div>
              <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{totalApplied}</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground">In Review</div>
              <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{totalReviewed}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground">Interviews</div>
              <div className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">{totalInterviews}</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground">Offers</div>
              <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">{totalOffers}</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground">Failed/Rejected</div>
              <div className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{totalFailed}</div>
            </div>
          </div>

          {/* Recent Applications */}
          {recentApplications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Recent Applications
              </h3>
              <div className="space-y-2">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{app.jobTitle}</div>
                      <div className="text-sm text-muted-foreground">{app.company}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                        app.status === 'Applied' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        app.status === 'In Review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        app.status === 'Interview' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        app.status === 'Offer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {app.status}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="h-80 w-full">
            <ChartContainer 
              config={{
                applied: { label: "Applications", color: "#3b82f6" },
                reviewed: { label: "In Review", color: "#f59e0b" },
                failed: { label: "Failed", color: "#ef4444" },
                interviews: { label: "Interviews", color: "#10b981" }
              }}
            >
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="applied" name="Applied" fill="var(--color-applied)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reviewed" name="In Review" fill="var(--color-reviewed)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="Failed" fill="var(--color-failed)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interviews" name="Interviews" fill="var(--color-interviews)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                {timeframe === 'weekly' ? 'Last 5 weeks' : 'Last 6 months'}
              </span>
            </div>
            <div className="text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTargetTracker;
