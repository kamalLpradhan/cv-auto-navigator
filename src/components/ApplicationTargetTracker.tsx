
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";
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
    // Generate last 4 weeks
    for (let i = 4; i >= 0; i--) {
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() - (i * 7));
      
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      
      const weekLabel = `Week ${4-i+1}`;
      
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
      const endDate = new Date(now.getFullYear(), now.getMonth() - i, 0);
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      
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
    const data = groupApplicationsByDate(applications, timeframe);
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
  
  // Calculate progress percentage against target
  const currentPeriodApplied = chartData.length > 0 ? chartData[chartData.length - 1]?.applied || 0 : 0;
  const targetProgress = Math.min(Math.round((currentPeriodApplied / targetValue) * 100), 100);

  return (
    <Card className="glass-panel">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Application Target Tracker</CardTitle>
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
              <div className="text-2xl font-bold">{currentPeriodApplied}</div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Applied this {timeframe === 'weekly' ? 'week' : 'month'}</span>
                <span className="text-xs font-medium">Target: {targetValue}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="font-medium">{targetProgress}% of target</span>
                <span className="text-muted-foreground">{currentPeriodApplied}/{targetValue}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${targetProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground">Failed/Rejected</div>
              <div className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{totalFailed}</div>
            </div>
          </div>

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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTargetTracker;
