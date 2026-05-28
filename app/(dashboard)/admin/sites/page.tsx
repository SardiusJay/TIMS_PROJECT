'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Download } from 'lucide-react';

export default function AdminSitesPage() {
  const { hasRole } = useAuth();

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">Access Denied: Admin only</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Registry</h1>
          <p className="text-muted-foreground mt-2">
            Manage all sites in your infrastructure inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Site
          </Button>
        </div>
      </div>

      {/* Placeholder content */}
      <Card>
        <CardHeader>
          <CardTitle>Sites List</CardTitle>
          <CardDescription>Manage and configure all managed sites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">Site management interface coming soon</p>
            <Button variant="outline">Learn more about site configuration</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
