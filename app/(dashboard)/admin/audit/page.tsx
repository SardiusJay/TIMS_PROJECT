'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function AdminAuditPage() {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  // Mock audit logs
  const mockLogs = [
    {
      id: 'log1',
      timestamp: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
      userName: 'John Smith',
      action: 'INSPECTION_APPROVED',
      resourceType: 'inspection',
      resourceId: 'INS001',
      ipAddress: '192.168.1.100',
    },
    {
      id: 'log2',
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
      userName: 'Sarah Johnson',
      action: 'REPORT_VIEWED',
      resourceType: 'report',
      resourceId: 'REP002',
      ipAddress: '192.168.1.101',
    },
    {
      id: 'log3',
      timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
      userName: 'Admin User',
      action: 'USER_CREATED',
      resourceType: 'user',
      resourceId: 'user_new_001',
      ipAddress: '192.168.1.102',
    },
    {
      id: 'log4',
      timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
      userName: 'Mike Davis',
      action: 'SITE_UPDATED',
      resourceType: 'site',
      resourceId: 'SITE005',
      ipAddress: '192.168.1.103',
    },
  ];

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">Access Denied: Admin only</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground mt-2">
          Track all user actions and system events
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <Input
            placeholder="Search by user or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Action Type</label>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="INSPECTION_APPROVED">Inspection Approved</SelectItem>
              <SelectItem value="REPORT_VIEWED">Report Viewed</SelectItem>
              <SelectItem value="USER_CREATED">User Created</SelectItem>
              <SelectItem value="SITE_UPDATED">Site Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>All system actions and user events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Action</th>
                  <th className="text-left py-3 px-4 font-medium">Resource</th>
                  <th className="text-left py-3 px-4 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {mockLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  mockLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium">{log.userName}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-medium text-blue-900 dark:text-blue-100">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-xs text-muted-foreground">{log.resourceType}</p>
                          <p className="font-mono text-xs">{log.resourceId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">{log.ipAddress}</td>
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
