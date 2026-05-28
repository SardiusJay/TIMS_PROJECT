'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export interface AlertItem {
  id: string;
  siteId: string;
  siteName: string;
  severity: 'critical' | 'high';
  description: string;
  timestamp: string;
  defectClass: number;
}

interface AlertFeedProps {
  alerts: AlertItem[];
  isLoading?: boolean;
}

export function AlertFeed({ alerts, isLoading }: AlertFeedProps) {
  const severityColor = {
    critical: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
    high: 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950',
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Critical Alerts</CardTitle>
          <CardDescription>Real-time alerts for Class 2 & 6 defects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading alerts...</div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Critical Alerts</CardTitle>
          <CardDescription>Real-time alerts for Class 2 & 6 defects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No critical alerts at this time</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          Critical Alerts
        </CardTitle>
        <CardDescription>Real-time alerts for Class 2 & 6 defects ({alerts.length})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={`${severityColor[alert.severity]}`}>
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{alert.siteName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Class {alert.defectClass} · {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      alert.severity === 'critical'
                        ? 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100'
                        : 'bg-orange-200 text-orange-900 dark:bg-orange-900 dark:text-orange-100'
                    }`}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
