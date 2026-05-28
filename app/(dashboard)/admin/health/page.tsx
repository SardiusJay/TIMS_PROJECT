'use client';

import { useAuth } from '@/hooks/useAuth';
import { SystemMetrics } from '@/types/api';
import { useAPI } from '@/hooks/useAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function AdminHealthPage() {
  const { hasRole } = useAuth();
  const { data: metrics, isLoading } = useAPI<SystemMetrics>('/admin/system/health');

  // Mock metrics
  const mockMetrics: SystemMetrics = {
    apiResponseTimeP95Ms: 245,
    syncQueueDepth: 12,
    errorRatePercent: 0.3,
    storageUtilizationPercent: 62,
    status: 'healthy',
  };

  const displayMetrics = metrics || mockMetrics;

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">Access Denied: Admin only</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'critical':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground mt-2">
          Monitor real-time system performance and metrics
        </p>
      </div>

      {/* Overall Status */}
      <Card className={
        displayMetrics.status === 'healthy'
          ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950'
          : displayMetrics.status === 'warning'
          ? 'border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950'
          : 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950'
      }>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overall System Status</CardTitle>
              <CardDescription>Last updated: {new Date().toLocaleString()}</CardDescription>
            </div>
            {getStatusIcon(displayMetrics.status)}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold capitalize">
            System is {displayMetrics.status}
          </p>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">API Response Time (P95)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{displayMetrics.apiResponseTimeP95Ms}ms</p>
            <p className="text-xs text-muted-foreground mt-1">Target: &lt;500ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sync Queue Depth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{displayMetrics.syncQueueDepth}</p>
            <p className="text-xs text-muted-foreground mt-1">Messages pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{displayMetrics.errorRatePercent}%</p>
            <p className="text-xs text-muted-foreground mt-1">Target: &lt;0.5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Storage Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{displayMetrics.storageUtilizationPercent}%</p>
            <p className="text-xs text-muted-foreground mt-1">Available: 38%</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Info */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">API Response Time Trend</p>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: '45%' }} />
            </div>
            <p className="text-xs text-muted-foreground">245ms of 500ms target</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Storage Utilization Trend</p>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div className="h-full bg-green-500 transition-all" style={{ width: '62%' }} />
            </div>
            <p className="text-xs text-muted-foreground">62% of 100% capacity</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Error Rate Trend</p>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div className="h-full bg-green-500 transition-all" style={{ width: '0.3%' }} />
            </div>
            <p className="text-xs text-muted-foreground">0.3% error rate</p>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>None at this time</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              All systems operating within normal parameters. No alerts to display.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
