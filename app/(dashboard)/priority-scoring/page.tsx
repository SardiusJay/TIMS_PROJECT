'use client';

import { useState } from 'react';
import { PrioritySite, PrioritySitesResponse } from '@/types/api';
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
import { Download, FileJson } from 'lucide-react';

export default function PriorityScoringPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'mps' | 'name' | 'defects'>('mps');

  const { data: response, isLoading } = useAPI<PrioritySitesResponse>(
    '/analytics/sites/priority'
  );

  const sites = response?.sites ?? [];

  // Filter and sort sites
  const filteredSites = sites
    .filter((site) => selectedRegion === 'all' || site.region === selectedRegion)
    .sort((a, b) => {
      switch (sortBy) {
        case 'mps':
          return b.mpsScore - a.mpsScore;
        case 'name':
          return a.siteName.localeCompare(b.siteName);
        case 'defects':
          return b.defectCount - a.defectCount;
        default:
          return 0;
      }
    });

  const regions = Array.from(new Set(sites.map((s) => s.region)));

  // MPS scoring formula explanation
  const avgMpsScore =
    sites.length > 0
      ? (sites.reduce((sum, s) => sum + s.mpsScore, 0) / sites.length).toFixed(1)
      : '0';

  const handleExportCSV = () => {
    const headers = ['Rank', 'Site Name', 'Region', 'MPS Score', 'Tier', 'Defect Count'];
    const rows = filteredSites.map((site, index) => [
      index + 1,
      site.siteName,
      site.region,
      site.mpsScore.toFixed(2),
      site.mpsTier.toUpperCase(),
      site.defectCount,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `priority-sites-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Priority Scoring</h1>
          <p className="text-muted-foreground mt-2">
            Data-driven site maintenance prioritization based on MPS formula
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Score Formula Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-base">MPS Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="text-sm bg-white dark:bg-slate-900 p-3 rounded block overflow-x-auto">
            MPS = (0.40 × Defect Severity) + (0.25 × Days Since Inspection)
            <br />+ (0.20 × Site Criticality) + (0.15 × Open Defects)
          </code>
        </CardContent>
      </Card>

      {/* Filters and Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredSites.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg MPS Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgMpsScore}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {filteredSites.filter((s) => s.mpsTier === 'critical').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {filteredSites.filter((s) => s.mpsTier === 'high').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Region Filter</label>
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
          <label className="text-sm font-medium mb-2 block">Sort By</label>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mps">MPS Score</SelectItem>
              <SelectItem value="defects">Defect Count</SelectItem>
              <SelectItem value="name">Site Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <p className="text-sm text-muted-foreground">
            {filteredSites.length} site{filteredSites.length !== 1 ? 's' : ''} displayed
          </p>
        </div>
      </div>

      {/* Priority Sites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Rankings</CardTitle>
          <CardDescription>
            Sites ranked by maintenance priority score (highest first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Rank</th>
                  <th className="text-left py-3 px-4 font-medium">Site Name</th>
                  <th className="text-left py-3 px-4 font-medium">Region</th>
                  <th className="text-left py-3 px-4 font-medium">MPS Score</th>
                  <th className="text-left py-3 px-4 font-medium">Tier</th>
                  <th className="text-left py-3 px-4 font-medium">Defects</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Last Inspection</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading sites...
                    </td>
                  </tr>
                ) : filteredSites.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No sites match your filters
                    </td>
                  </tr>
                ) : (
                  filteredSites.map((site, index) => (
                    <tr key={site.siteId} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-bold">#{index + 1}</td>
                      <td className="py-3 px-4 font-medium">{site.siteName}</td>
                      <td className="py-3 px-4">{site.region}</td>
                      <td className="py-3 px-4 font-bold text-lg">{site.mpsScore.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            site.mpsTier === 'critical'
                              ? 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
                              : site.mpsTier === 'high'
                              ? 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100'
                              : site.mpsTier === 'medium'
                              ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
                              : 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
                          }`}
                        >
                          {site.mpsTier.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{site.defectCount}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            site.conditionStatus === 'normal'
                              ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
                              : site.conditionStatus === 'critical'
                              ? 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
                              : 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
                          }`}
                        >
                          {site.conditionStatus}
                        </span>
                      </td>
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
