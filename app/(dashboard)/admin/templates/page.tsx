'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2 } from 'lucide-react';

export default function AdminTemplatesPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Checklist Templates</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage inspection checklist templates
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Placeholder content */}
      <Card>
        <CardHeader>
          <CardTitle>Templates List</CardTitle>
          <CardDescription>All inspection checklist templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">Template editor interface coming soon</p>
            <Button variant="outline">Learn more about templates</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
