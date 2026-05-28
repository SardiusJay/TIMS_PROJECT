'use client';

import { useState } from 'react';
import { Inspection } from '@/types/api';
import { useAPI } from '@/hooks/useAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { user, hasRole } = useAuth();
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { data: inspection, isLoading } = useAPI<Inspection>(
    `/inspections/${params.id}`
  );

  // Mock data
  const mockInspection: Inspection = {
    id: params.id,
    siteId: 'SITE001',
    engineerId: 'ENG001',
    templateId: 'TPL001',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    submissionTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 2 * 60 * 60000).toISOString(),
    status: 'pending_review',
    checklistResponses: [
      { itemId: 'item1', sectionId: 'sec1', itemType: 'CHECKBOX', response: 'true' },
      { itemId: 'item2', sectionId: 'sec1', itemType: 'TEXT', response: 'No visible damage' },
    ],
    defects: [
      {
        id: 'def1',
        location: 'Top of pole',
        description: 'Rust formation on mounting bracket',
        aiClassifications: [
          { class: 2, confidence: 0.92 },
          { class: 6, confidence: 0.85 },
        ],
        severity: 'high',
        photoIds: ['photo1'],
      },
    ],
    location: { latitude: 40.7128, longitude: -74.006, accuracy: 5.2 },
    photos: [
      {
        id: 'photo1',
        url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
        capturedAt: new Date().toISOString(),
        relatedDefectId: 'def1',
      },
    ],
  };

  const displayInspection = inspection || mockInspection;

  const handleApprove = async () => {
    setIsSubmittingReview(true);
    try {
      // TODO: Call API to approve
      console.log('[v0] Approving inspection', params.id);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReturn = async () => {
    setIsSubmittingReview(true);
    try {
      // TODO: Call API to return for correction
      console.log('[v0] Returning inspection for correction', params.id);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report {displayInspection.id}</h1>
          <p className="text-muted-foreground mt-2">
            Site: {displayInspection.siteId} · Submitted:{' '}
            {new Date(displayInspection.submissionTime).toLocaleString()}
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Status Alert */}
      {displayInspection.status === 'pending_review' && hasRole(['admin', 'supervisor']) && (
        <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900">
          <AlertDescription>
            This report is pending your review. Please review the details and defects before approving or returning for correction.
          </AlertDescription>
        </Alert>
      )}

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inspection Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Latitude:</strong> {displayInspection.location.latitude.toFixed(6)}
                </p>
                <p>
                  <strong>Longitude:</strong> {displayInspection.location.longitude.toFixed(6)}
                </p>
                {displayInspection.location.accuracy && (
                  <p>
                    <strong>Accuracy:</strong> ±{displayInspection.location.accuracy.toFixed(1)}m
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Defects */}
          {displayInspection.defects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detected Defects</CardTitle>
                <CardDescription>{displayInspection.defects.length} defect(s) found</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayInspection.defects.map((defect) => (
                  <div key={defect.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{defect.description}</p>
                        <p className="text-sm text-muted-foreground">{defect.location}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          defect.severity === 'critical'
                            ? 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
                            : defect.severity === 'high'
                            ? 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100'
                            : 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
                        }`}
                      >
                        {defect.severity.toUpperCase()}
                      </span>
                    </div>

                    {/* AI Classifications */}
                    <div className="bg-muted p-3 rounded text-sm space-y-1">
                      <p className="font-medium text-muted-foreground">AI Classifications:</p>
                      {defect.aiClassifications.map((classification, idx) => (
                        <p key={idx}>
                          Class {classification.class} - {(classification.confidence * 100).toFixed(0)}% confidence
                        </p>
                      ))}
                    </div>

                    {/* Photos */}
                    {defect.photoIds.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {defect.photoIds.map((photoId) => {
                          const photo = displayInspection.photos.find((p) => p.id === photoId);
                          return photo ? (
                            <img
                              key={photoId}
                              src={photo.url}
                              alt="Defect"
                              className="rounded w-full h-40 object-cover"
                            />
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {displayInspection.defects.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No defects detected in this inspection.
              </CardContent>
            </Card>
          )}

          {/* Checklist Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Checklist Responses</CardTitle>
              <CardDescription>
                {displayInspection.checklistResponses.length} item{displayInspection.checklistResponses.length !== 1 ? 's' : ''} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {displayInspection.checklistResponses.slice(0, 5).map((response) => (
                  <div key={response.itemId} className="flex justify-between items-start border-b pb-2">
                    <p className="text-sm">{response.itemId}</p>
                    <p className="text-sm text-muted-foreground">{String(response.response).substring(0, 30)}</p>
                  </div>
                ))}
              </div>
              {displayInspection.checklistResponses.length > 5 && (
                <p className="text-sm text-muted-foreground mt-3">
                  +{displayInspection.checklistResponses.length - 5} more responses
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Review Panel */}
        {(displayInspection.status === 'pending_review' || displayInspection.status === 'returned') &&
          hasRole(['admin', 'supervisor']) && (
          <div className="space-y-6">
            <Card className="border-yellow-200 dark:border-yellow-900">
              <CardHeader>
                <CardTitle className="text-base">Supervisor Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Review Comment</label>
                  <Textarea
                    placeholder="Add any review comments or notes..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleApprove}
                    disabled={isSubmittingReview}
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isSubmittingReview ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={handleReturn}
                    disabled={isSubmittingReview}
                    variant="outline"
                    className="w-full gap-2 border-red-200"
                  >
                    <XCircle className="h-4 w-4" />
                    {isSubmittingReview ? 'Returning...' : 'Return for Correction'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sidebar - Info Panel */}
        {(displayInspection.status === 'approved' ||
          !hasRole(['admin', 'supervisor'])) && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Report Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-semibold capitalize">
                    {displayInspection.status.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Defects</p>
                  <p className="text-2xl font-bold">{displayInspection.defects.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Inspection Duration</p>
                  <p className="font-semibold">
                    {Math.round(
                      (new Date(displayInspection.submissionTime).getTime() -
                        new Date(displayInspection.startTime).getTime()) /
                      (1000 * 60)
                    )}{' '}
                    minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
