'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Site } from '@/types/api';
import { useAPI } from '@/hooks/useAPI';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Dynamic import to avoid SSR issues with Leaflet
const SiteMapContainer = dynamic(() => import('@/components/sites/SiteMapContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-muted">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default function SiteMapPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch sites
  const { data: sitesResponse, isLoading } = useAPI<{ sites: Site[]; total: number }>(
    '/sites'
  );

  const sites = sitesResponse?.sites ?? [];

  // Filter sites
  const filteredSites = sites.filter((site) => {
    if (selectedRegion !== 'all' && site.region !== selectedRegion) return false;
    if (selectedStatus !== 'all' && site.conditionStatus !== selectedStatus) return false;
    return true;
  });

  // Get unique regions
  const regions = Array.from(new Set(sites.map((s) => s.region)));

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sites Map</h1>
        <p className="text-muted-foreground mt-2">
          Geographic overview of all managed sites
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">Region</label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Site Map</CardTitle>
          <CardDescription>
            {filteredSites.length} site{filteredSites.length !== 1 ? 's' : ''} displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <SiteMapContainer
            sites={filteredSites}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Site Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Site Summary</CardTitle>
          <CardDescription>Quick overview of filtered sites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Site Name</th>
                  <th className="text-left py-3 px-4 font-medium">Region</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Defects</th>
                  <th className="text-left py-3 px-4 font-medium">Last Inspection</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading sites...
                    </td>
                  </tr>
                ) : filteredSites.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      No sites match your filters
                    </td>
                  </tr>
                ) : (
                  filteredSites.map((site) => (
                    <tr key={site.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{site.name}</td>
                      <td className="py-3 px-4">{site.region}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            site.conditionStatus === 'normal'
                              ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
                              : site.conditionStatus === 'minor'
                              ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                              : site.conditionStatus === 'moderate'
                              ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
                              : 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
                          }`}
                        >
                          {site.conditionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{site.defectCount}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {site.lastInspectionDate
                          ? new Date(site.lastInspectionDate).toLocaleDateString()
                          : 'Never'}
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
