'use client';

import { InspectionAnalyticsData } from '@/types/api';
import { useAPI } from '@/hooks/useAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function InspectionAnalyticsPage() {
  const { data: analytics, isLoading } = useAPI<InspectionAnalyticsData>(
    '/analytics/inspections'
  );

  const mockCompletionData = [
    { date: 'Week 1', completed: 145, target: 150 },
    { date: 'Week 2', completed: 152, target: 150 },
    { date: 'Week 3', completed: 148, target: 150 },
    { date: 'Week 4', completed: 158, target: 150 },
  ];

  const mockEngineersData = [
    { name: 'John Smith', inspections: 42, avgLatency: 2.5, completion: 98, detection: 8.5 },
    { name: 'Sarah Johnson', inspections: 38, avgLatency: 2.1, completion: 96, detection: 9.2 },
    { name: 'Mike Davis', inspections: 35, avgLatency: 3.2, completion: 94, detection: 7.8 },
    { name: 'Lisa Wong', inspections: 45, avgLatency: 2.8, completion: 97, detection: 9.1 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inspection Performance</h1>
        <p className="text-muted-foreground mt-2">
          Track field engineer performance and inspection metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">GPS Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.gpsCompliance || 94}%</p>
            <p className="text-xs text-muted-foreground mt-1">Inspections with valid GPS fix</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Submission Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2.4h</p>
            <p className="text-xs text-muted-foreground mt-1">From start to server receipt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">603</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">96%</p>
            <p className="text-xs text-muted-foreground mt-1">Avg checklist completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate Trend</CardTitle>
            <CardDescription>Weekly inspection completions vs target</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#3b82f6"
                    name="Completed"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist Completion by Section</CardTitle>
            <CardDescription>Identifying incomplete sections</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    analytics?.checklistCompletionBySection || [
                      { sectionName: 'Safety', completionPercent: 98 },
                      { sectionName: 'Structure', completionPercent: 96 },
                      { sectionName: 'Electrical', completionPercent: 94 },
                      { sectionName: 'Grounding', completionPercent: 91 },
                    ]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sectionName" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="completionPercent" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Engineer Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Engineer Leaderboard</CardTitle>
          <CardDescription>Performance metrics by field engineer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Engineer</th>
                  <th className="text-center py-3 px-4 font-medium">Inspections</th>
                  <th className="text-center py-3 px-4 font-medium">Avg Latency</th>
                  <th className="text-center py-3 px-4 font-medium">Completion %</th>
                  <th className="text-center py-3 px-4 font-medium">Defect Detection Rate</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  mockEngineersData.map((engineer, index) => (
                    <tr key={engineer.name} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <span className="font-medium">#{index + 1}</span> {engineer.name}
                      </td>
                      <td className="py-3 px-4 text-center font-bold">{engineer.inspections}</td>
                      <td className="py-3 px-4 text-center">{engineer.avgLatency}h</td>
                      <td className="py-3 px-4 text-center">{engineer.completion}%</td>
                      <td className="py-3 px-4 text-center font-bold text-green-600">
                        {engineer.detection}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
