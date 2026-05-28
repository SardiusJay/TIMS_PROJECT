'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Inspection, InspectionsListResponse } from '@/types/api';
import { useAPI } from '@/hooks/useAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Eye, Download } from 'lucide-react';

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: response, isLoading } = useAPI<InspectionsListResponse>(
    '/inspections'
  );

  const inspections = response?.inspections ?? [];

  // Mock data for now
  const mockInspections: Inspection[] = [
    {
      id: 'INS001',
      siteId: 'SITE001',
      engineerId: 'ENG001',
      templateId: 'TPL001',
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
      submissionTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 2 * 60 * 60000).toISOString(),
      status: 'approved',
      checklistResponses: [],
      defects: [],
      location: { latitude: 40.7128, longitude: -74.006 },
      photos: [],
    },
    {
      id: 'INS002',
      siteId: 'SITE002',
      engineerId: 'ENG002',
      templateId: 'TPL001',
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(),
      submissionTime: new Date(Date.now() - 1 * 24 * 60 * 60000 + 1.5 * 60 * 60000).toISOString(),
      status: 'pending_review',
      checklistResponses: [],
      defects: [],
      location: { latitude: 40.7589, longitude: -73.9851 },
      photos: [],
    },
    {
      id: 'INS003',
      siteId: 'SITE003',
      engineerId: 'ENG003',
      templateId: 'TPL001',
      startTime: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
      submissionTime: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
      status: 'pending_review',
      checklistResponses: [],
      defects: [],
      location: { latitude: 40.758, longitude: -73.985 },
      photos: [],
    },
  ];

  const displayData = inspections.length > 0 ? inspections : mockInspections;

  // Filter inspections
  const filteredInspections = displayData
    .filter((insp) => statusFilter === 'all' || insp.status === statusFilter)
    .filter((insp) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        insp.id.toLowerCase().includes(searchLower) ||
        insp.siteId.toLowerCase().includes(searchLower)
      );
    });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100';
      case 'returned':
        return 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inspection Reports</h1>
        <p className="text-muted-foreground mt-2">
          Manage and review all submitted inspection reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{displayData.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {displayData.filter((r) => r.status === 'pending_review').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {displayData.filter((r) => r.status === 'approved').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">Search Reports</label>
          <Input
            placeholder="Search by Report ID or Site ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Filter by Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports List</CardTitle>
          <CardDescription>
            {filteredInspections.length} report{filteredInspections.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Report ID</th>
                  <th className="text-left py-3 px-4 font-medium">Site ID</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading reports...
                    </td>
                  </tr>
                ) : filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      No reports match your filters
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((inspection) => (
                    <tr key={inspection.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{inspection.id}</td>
                      <td className="py-3 px-4">{inspection.siteId}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${getStatusBadgeColor(
                            inspection.status
                          )}`}
                        >
                          {inspection.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(inspection.submissionTime).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/reports/${inspection.id}`}>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </div>
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
