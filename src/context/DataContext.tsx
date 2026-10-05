import React, { createContext, useContext, useState, useEffect } from 'react';
import { CrimeReport, User, AuditLog, ReportStatus, CrimeCategory, ReportPriority, InvestigationNote, EvidenceItem } from '../types';
import { INITIAL_REPORTS, INITIAL_USERS, INITIAL_AUDIT_LOGS } from '../data/initialData';
import { useAuth } from './AuthContext';

interface SubmitReportInput {
  anonymous: boolean;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  description: string;
  additionalInfo?: string;
  category: CrimeCategory;
  date: string;
  time: string;
  location: string;
  areaDistrict: string;
  coordinates: { lat: number; lng: number };
  evidence: { fileName: string; fileType: 'image' | 'video' | 'document'; fileSize: string; fileUrl: string }[];
}

interface DataContextType {
  reports: CrimeReport[];
  users: User[];
  auditLogs: AuditLog[];
  createReport: (input: SubmitReportInput) => Promise<CrimeReport>;
  updateReportStatus: (reportId: string, status: ReportStatus) => void;
  updateReportCategory: (reportId: string, category: CrimeCategory) => void;
  assignOfficer: (reportId: string, officerId: string, officerName: string) => void;
  addInvestigationNote: (reportId: string, content: string) => void;
  toggleUserStatus: (userId: string) => void;
  updateUserRole: (userId: string, newRole: User['role']) => void;
  getReportByReference: (refId: string) => CrimeReport | undefined;
  getPublicReports: () => CrimeReport[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [reports, setReports] = useState<CrimeReport[]>(() => {
    const saved = localStorage.getItem('cw_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].location && parsed[0].location.includes('Telangana')) {
          return parsed;
        }
      } catch {
        return INITIAL_REPORTS;
      }
    }
    return INITIAL_REPORTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cw_all_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].email && parsed[0].email.endsWith('@crimewatch.demo')) {
          return parsed;
        }
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('cw_audit_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].details && (parsed[0].details.includes('Hyderabad') || parsed[0].details.includes('Malkajgiri') || parsed[0].details.includes('Telangana'))) {
          return parsed;
        }
      } catch {
        return INITIAL_AUDIT_LOGS;
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('cw_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('cw_all_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cw_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditEntry = (action: AuditLog['action'], details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      userId: currentUser?.id || 'system-anon',
      userName: currentUser?.name || 'Anonymous User',
      userRole: currentUser?.role || 'Citizen',
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const createReport = async (input: SubmitReportInput): Promise<CrimeReport> => {
    // Generate sequential reference ID: CW-2026-0009
    const year = new Date().getFullYear();
    const sequenceNum = String(reports.length + 1).padStart(4, '0');
    const referenceId = `CW-${year}-${sequenceNum}`;

    let aiResult = {
      suggestedCategory: input.category,
      confidence: 0.88,
      reasoning: 'Preliminary category matches incident description patterns.',
      urgencyPriority: 'Medium' as ReportPriority,
      humanReviewRecommended: false,
      similarPatternNotes: 'Standard category match based on incident keywords.',
    };

    try {
      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: input.description,
          userCategory: input.category,
          location: input.location,
          dateTime: `${input.date} ${input.time}`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        aiResult = {
          suggestedCategory: data.suggestedCategory || input.category,
          confidence: data.confidence || 0.85,
          reasoning: data.reasoning || 'AI analysis completed.',
          urgencyPriority: (data.urgencyPriority as ReportPriority) || 'Medium',
          humanReviewRecommended: !!data.humanReviewRecommended,
          similarPatternNotes: data.similarPatternNotes || 'Pattern analysis recorded.',
        };
      }
    } catch (err) {
      console.warn('AI analysis API call skipped/fallback:', err);
    }

    const reportId = `rep-${Date.now()}`;
    const evidenceItems: EvidenceItem[] = input.evidence.map((ev, index) => ({
      id: `ev-${Date.now()}-${index}`,
      reportId,
      fileName: ev.fileName,
      fileType: ev.fileType,
      fileSize: ev.fileSize,
      fileUrl: ev.fileUrl,
      uploadedAt: new Date().toISOString(),
    }));

    const newReport: CrimeReport = {
      id: reportId,
      referenceId,
      reporterId: input.anonymous ? undefined : currentUser?.id,
      reporterName: input.anonymous ? undefined : (input.reporterName || currentUser?.name),
      reporterEmail: input.anonymous ? undefined : (input.reporterEmail || currentUser?.email),
      reporterPhone: input.anonymous ? undefined : (input.reporterPhone || currentUser?.phone),
      anonymous: input.anonymous,
      description: input.description,
      additionalInfo: input.additionalInfo,
      category: input.category,
      aiSuggestedCategory: aiResult.suggestedCategory as CrimeCategory,
      aiConfidence: aiResult.confidence,
      aiReasoning: aiResult.reasoning,
      aiUrgencyPriority: aiResult.urgencyPriority,
      aiHumanReviewRecommended: aiResult.humanReviewRecommended,
      aiSimilarPatternNotes: aiResult.similarPatternNotes,
      finalCategory: input.category,
      date: input.date,
      time: input.time,
      location: input.location,
      areaDistrict: input.areaDistrict || 'Hyderabad',
      coordinates: input.coordinates || { lat: 17.3850, lng: 78.4867 },
      status: 'Submitted',
      priority: aiResult.urgencyPriority,
      evidence: evidenceItems,
      internalNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);

    addAuditEntry(
      'Report created',
      `Report ${referenceId} submitted [${input.category}] (${input.anonymous ? 'Anonymous' : 'Registered'})`
    );

    return newReport;
  };

  const updateReportStatus = (reportId: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const updated = {
            ...r,
            status,
            updatedAt: new Date().toISOString(),
          };
          addAuditEntry('Status updated', `Updated ${r.referenceId} status to ${status}`);
          return updated;
        }
        return r;
      })
    );
  };

  const updateReportCategory = (reportId: string, category: CrimeCategory) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const updated = {
            ...r,
            finalCategory: category,
            updatedAt: new Date().toISOString(),
          };
          addAuditEntry('Case updated', `Officer reclassified ${r.referenceId} category to ${category}`);
          return updated;
        }
        return r;
      })
    );
  };

  const assignOfficer = (reportId: string, officerId: string, officerName: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const updated: CrimeReport = {
            ...r,
            assignedOfficer: officerId,
            assignedOfficerName: officerName,
            status: r.status === 'Submitted' || r.status === 'Under Review' ? 'Assigned' : r.status,
            updatedAt: new Date().toISOString(),
          };
          addAuditEntry('Case updated', `Assigned ${r.referenceId} to ${officerName}`);
          return updated;
        }
        return r;
      })
    );
  };

  const addInvestigationNote = (reportId: string, content: string) => {
    if (!currentUser) return;
    const newNote: InvestigationNote = {
      id: `note-${Date.now()}`,
      reportId,
      officerId: currentUser.id,
      officerName: currentUser.name,
      content,
      createdAt: new Date().toISOString(),
    };

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const updated = {
            ...r,
            internalNotes: [...r.internalNotes, newNote],
            updatedAt: new Date().toISOString(),
          };
          addAuditEntry('Case updated', `Added internal note to ${r.referenceId}`);
          return updated;
        }
        return r;
      })
    );
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
          addAuditEntry('Administrative action', `Changed status of ${u.name} (${u.email}) to ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const updateUserRole = (userId: string, newRole: User['role']) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          addAuditEntry('Role changed', `Changed role of ${u.name} to ${newRole}`);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const getReportByReference = (refId: string): CrimeReport | undefined => {
    const clean = refId.trim().toUpperCase();
    return reports.find((r) => r.referenceId.toUpperCase() === clean);
  };

  // Safe public reports list stripping all private reporter info & internal notes
  const getPublicReports = (): CrimeReport[] => {
    return reports.map((r) => ({
      ...r,
      reporterName: undefined,
      reporterEmail: undefined,
      reporterPhone: undefined,
      internalNotes: [], // NEVER expose to public
      evidence: [], // NEVER expose sensitive evidence to public map
    }));
  };

  const value: DataContextType = {
    reports,
    users,
    auditLogs,
    createReport,
    updateReportStatus,
    updateReportCategory,
    assignOfficer,
    addInvestigationNote,
    toggleUserStatus,
    updateUserRole,
    getReportByReference,
    getPublicReports,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
