export type UserRole = 'Citizen' | 'Police Officer' | 'Administrator';

export type UserStatus = 'Active' | 'Disabled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  badgeNumber?: string;
  department?: string;
  createdAt: string;
}

export type CrimeCategory =
  | 'Theft'
  | 'Vehicle Theft'
  | 'Assault'
  | 'Burglary'
  | 'Vandalism'
  | 'Fraud'
  | 'Cyber Crime'
  | 'Harassment'
  | 'Other';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'Investigation in Progress'
  | 'Resolved';

export type ReportPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface EvidenceItem {
  id: string;
  reportId: string;
  fileName: string;
  fileType: 'image' | 'video' | 'document';
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface InvestigationNote {
  id: string;
  reportId: string;
  officerId: string;
  officerName: string;
  content: string;
  createdAt: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CrimeReport {
  id: string;
  referenceId: string; // e.g. CW-2026-0001
  reporterId?: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  anonymous: boolean;
  description: string;
  additionalInfo?: string;
  category: CrimeCategory;
  aiSuggestedCategory?: CrimeCategory;
  aiConfidence?: number;
  aiReasoning?: string;
  aiUrgencyPriority?: ReportPriority;
  aiHumanReviewRecommended?: boolean;
  aiSimilarPatternNotes?: string;
  finalCategory: CrimeCategory;
  date: string;
  time: string;
  location: string;
  areaDistrict: string;
  coordinates: Coordinates;
  status: ReportStatus;
  priority: ReportPriority;
  assignedOfficer?: string;
  assignedOfficerName?: string;
  evidence: EvidenceItem[];
  internalNotes: InvestigationNote[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'Login' | 'Logout' | 'Report created' | 'Case updated' | 'Role changed' | 'Status updated' | 'Administrative action';
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export type LanguageCode = 'en' | 'hi' | 'te';
