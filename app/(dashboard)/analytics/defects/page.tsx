'use client';

import { useState } from 'react';
import { DefectAnalyticsData } from '@/types/api';
import { useAPI } from '@/hooks/useAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

export default function DefectAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('monthly');
  const { data: analytics, isLoading } = useAPI<DefectAnalyticsData>(
    '/analytics/defects'
  );

  const mockFrequencyData = [
    { month: 'Jan', total: 45, 'Class 2': 12, 'Class 6': 8 },
    { month: 'Feb', total: 52, 'Class 2': 15, 'Class 6': 10 },
    { month: 'Mar', total: 48, 'Class 2': 13, 'Class 6': 9 },
    { month: 'Apr', total: 61, 'Class 2': 18, 'Class 6': 12 },
    { month: 'May', total: 55, 'Class 2': 14, 'Class 6': 11 },
    { month: 'Jun', total: 58, 'Class 2': 16, 'Class 6': 10 },
  ];

  const severityData = [
    { name: 'Critical', value: analytics?.severityDistribution?.critical || 24 },
    { name: 'High', value: analytics?.severityDistribution?.high || 42 },
    { name: 'Medium', value: analytics?.severityDistribution?.medium || 85 },
    { name: 'Low', value: analytics?.severityDistribution?.low || 120 },
  ];

  const topSitesData = analytics?.topSites || [
    { siteId: 'SITE001', siteName: 'Tower A', defectCount: 45 },
    { siteId: 'SITE002', siteName: 'Tower B', defectCount: 38 },
    { siteId: 'SITE003', siteName: 'Tower C', defectCount: 32 },
    { siteId: 'SITE004', siteName: 'Tower D', defectCount: 28 },
    { siteId: 'SITE005', siteName: 'Tower E', defectCount: 25 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Defect Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analysis of defects across your infrastructure
          </p>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Frequency and Severity Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Defect Frequency Trend</CardTitle>
            <CardDescription>Defects detected over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Class 2" stackId="a" fill="#ef4444" />
                  <Bar dataKey="Class 6" stackId="a" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>Current defect breakdown by severity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Sites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Sites by Defect Count</CardTitle>
          <CardDescription>Sites with the highest defect volumes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Rank</th>
                  <th className="text-left py-3 px-4 font-medium">Site Name</th>
                  <th className="text-left py-3 px-4 font-medium">Defect Count</th>
                  <th className="text-left py-3 px-4 font-medium">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  topSitesData.map((site, index) => {
                    const totalDefects = topSitesData.reduce((sum, s) => sum + s.defectCount, 0);
                    const percentage = ((site.defectCount / totalDefects) * 100).toFixed(1);
                    return (
                      <tr key={site.siteId} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">#{index + 1}</td>
                        <td className="py-3 px-4">{site.siteName}</td>
                        <td className="py-3 px-4 font-bold">{site.defectCount}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-32 bg-muted rounded overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Classification Stats */}
      <Card>
        <CardHeader>
          <CardTitle>AI Classification Performance</CardTitle>
          <CardDescription>AI predictions validated by supervisors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-2">Classification Agreement Rate</p>
              <p className="text-4xl font-bold">{analytics?.aiClassificationAgreement || 87}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-2">Out of 1,247 classifications</p>
              <p className="text-lg font-semibold">{Math.round((analytics?.aiClassificationAgreement || 87) * 12.47)} accepted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
