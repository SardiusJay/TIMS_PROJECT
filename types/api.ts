// Authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

// User & RBAC
export type UserRole = 'admin' | 'operations_manager' | 'supervisor' | 'engineer';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  assignedRegion?: string;
  assignedSites?: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Sites
export interface Site {
  id: string;
  siteId: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  type: string; // e.g., "BTS", "RBS", "Macro"
  equipmentTypes: string[];
  assignedEngineers: string[];
  lastInspectionDate?: string;
  conditionStatus: 'normal' | 'minor' | 'moderate' | 'critical';
  defectCount: number;
  criticalDefectCount: number;
}

export interface SitesListResponse {
  sites: Site[];
  total: number;
  cursor?: string;
}

// Inspections & Reports
export interface Inspection {
  id: string;
  siteId: string;
  engineerId: string;
  templateId: string;
  startTime: string;
  submissionTime: string;
  status: 'draft' | 'submitted' | 'pending_review' | 'approved' | 'returned';
  checklistResponses: ChecklistResponse[];
  defects: DefectRecord[];
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  photos: Photo[];
}

export interface ChecklistResponse {
  itemId: string;
  sectionId: string;
  itemType: 'TEXT' | 'CHECKBOX' | 'PHOTO' | 'MULTISELECT';
  response: string | boolean | string[];
  notes?: string;
}

export interface DefectRecord {
  id: string;
  location: string;
  description: string;
  aiClassifications: {
    class: number; // 0-7
    confidence: number;
  }[];
  manualClassification?: {
    class: number;
    overriddenAt: string;
  };
  severity: 'critical' | 'high' | 'medium' | 'low';
  photoIds: string[];
}

export interface Photo {
  id: string;
  url: string;
  capturedAt: string;
  relatedDefectId?: string;
}

export interface InspectionsListResponse {
  inspections: Inspection[];
  total: number;
  cursor?: string;
}

// Analytics
export interface DashboardSummary {
  totalSites: number;
  inspectionsThisMonth: number;
  openDefects: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  overdueInspections: number;
  sitesWithCriticalDefects: number;
  trends: {
    defectsLast6Months: Array<{ month: string; count: number }>;
    completionRate: number;
  };
}

export interface DefectAnalyticsData {
  frequencyByMonth: Array<{ month: string; count: number; byClass: Record<string, number> }>;
  severityDistribution: Record<'critical' | 'high' | 'medium' | 'low', number>;
  byRegion: Array<{ region: string; defects: Record<string, number> }>;
  timeToResolution: { mean: number; median: number; p95: number };
  topSites: Array<{ siteId: string; siteName: string; defectCount: number }>;
  aiClassificationAgreement: number;
}

export interface InspectionAnalyticsData {
  completionRateTrend: Array<{ date: string; completed: number; target: number }>;
  submissionLatency: Array<{ hours: number; count: number }>;
  engineerLeaderboard: Array<{
    engineerId: string;
    engineerName: string;
    inspectionCount: number;
    avgLatencyHours: number;
    checklistCompletionPercent: number;
    defectDetectionRate: number;
  }>;
  gpsCompliance: number;
  checklistCompletionBySection: Array<{ sectionName: string; completionPercent: number }>;
}

export interface PrioritySite {
  siteId: string;
  siteName: string;
  region: string;
  mpsScore: number;
  mpsTier: 'critical' | 'high' | 'medium' | 'low';
  lastInspectionDate?: string;
  defectCount: number;
  conditionStatus: 'normal' | 'minor' | 'moderate' | 'critical';
}

export interface PrioritySitesResponse {
  sites: PrioritySite[];
  total: number;
}

// System Health
export interface SystemMetrics {
  apiResponseTimeP95Ms: number;
  syncQueueDepth: number;
  errorRatePercent: number;
  storageUtilizationPercent: number;
  status: 'healthy' | 'warning' | 'critical';
}

// Audit Log
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
}

export interface AuditLogsResponse {
  logs: AuditLogEntry[];
  total: number;
  cursor?: string;
}
