'use client';

import { useState, useEffect } from 'react';
import { DashboardSummary } from '@/types/api';
import { KPICard } from '@/components/dashboard/KPICard';
import { AlertFeed, AlertItem } from '@/components/dashboard/AlertFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - in production this would come from the API
  const summary: DashboardSummary = {
    totalSites: 342,
    activeInspections: 28,
    openDefects: 156,
    overdueInspections: 12,
    criticalSites: 3,
    avgComplianceScore: 87.5,
    lastUpdate: new Date().toISOString(),
  };

  // Mock alerts for now - in production would fetch from /alerts/critical
  const mockAlerts: AlertItem[] = [
    {
      id: '1',
      siteId: 'SITE001',
      siteName: 'Tower A - Downtown',
      severity: 'critical',
      description: 'Structural damage detected on mounting bracket',
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      defectClass: 2,
    },
    {
      id: '2',
      siteId: 'SITE005',
      siteName: 'Tower B - Midtown',
      severity: 'high',
      description: 'Corroded antenna connector',
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      defectClass: 6,
    },
  ];

  // Generate mock sparkline data
  const mockSparkline = Array.from({ length: 12 }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 50,
  }));

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Real-time overview of your infrastructure management system
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Sites"
          value={summary?.totalSites ?? 0}
          trend={{ direction: 'up', percentage: 5 }}
          sparklineData={mockSparkline}
          isLoading={isLoading}
        />
        <KPICard
          title="Inspections (Month)"
          value={summary?.inspectionsThisMonth ?? 0}
          trend={{ direction: 'up', percentage: 12 }}
          sparklineData={mockSparkline}
          isLoading={isLoading}
        />
        <KPICard
          title="Open Defects"
          value={
            summary
              ? summary.openDefects.critical +
                summary.openDefects.high +
                summary.openDefects.medium +
                summary.openDefects.low
              : 0
          }
          trend={{ direction: 'down', percentage: 8 }}
          sparklineData={mockSparkline}
          isLoading={isLoading}
        />
        <KPICard
          title="Overdue Inspections"
          value={summary?.overdueInspections ?? 0}
          trend={{ direction: 'down', percentage: 15 }}
          sparklineData={mockSparkline}
          isLoading={isLoading}
        />
        <KPICard
          title="Critical Sites"
          value={summary?.sitesWithCriticalDefects ?? 0}
          trend={{ direction: 'up', percentage: 2 }}
          sparklineData={mockSparkline}
          isLoading={isLoading}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alerts */}
        <div className="lg:col-span-2">
          <AlertFeed alerts={mockAlerts} isLoading={isLoading} />
        </div>

        {/* Defect summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Defect Summary</CardTitle>
            <CardDescription>By severity level</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : summary ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Critical</span>
                  <span className="text-sm font-bold text-red-600">{summary.openDefects.critical}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">High</span>
                  <span className="text-sm font-bold text-orange-600">{summary.openDefects.high}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Medium</span>
                  <span className="text-sm font-bold text-yellow-600">{summary.openDefects.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Low</span>
                  <span className="text-sm font-bold text-blue-600">{summary.openDefects.low}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No data</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
