import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Shield,
  ShieldCheck,
  User,
  Sparkles,
  Lock,
  PlusCircle,
  AlertTriangle,
  FileCheck,
  Check,
  UserCheck,
  EyeOff,
  Edit3,
} from 'lucide-react';
import { ReportStatus, CrimeCategory } from '../../types';

export const PoliceCaseDetailPage: React.FC = () => {
  const { selectedReportId, navigateTo } = useNavigation();
  const { reports, updateReportStatus, updateReportCategory, assignOfficer, addInvestigationNote, users } =
    useData();
  const { currentUser } = useAuth();

  const caseItem = reports.find((r) => r.id === selectedReportId);

  // Local state for actions
  const [newStatus, setNewStatus] = useState<ReportStatus>(caseItem?.status || 'Submitted');
  const [newCategory, setNewCategory] = useState<CrimeCategory>(caseItem?.finalCategory || 'Theft');
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(
    caseItem?.assignedOfficer || currentUser?.id || ''
  );
  const [internalNoteText, setInternalNoteText] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!caseItem) {
    return (
      <DashboardLayout allowedRoles={['Police Officer']} title="Case Not Found">
        <div className="bg-slate-800 p-8 rounded-2xl text-center space-y-4">
          <p className="text-slate-400">The requested case could not be located in the intake queue.</p>
          <button
            onClick={() => navigateTo('police-cases')}
            className="px-4 py-2 bg-blue-600 rounded-xl text-white text-xs font-semibold"
          >
            Back to Case Directory
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const policeOfficers = users.filter((u) => u.role === 'Police Officer');

  const showFeedback = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    updateReportStatus(caseItem.id, newStatus);
    showFeedback(`Status updated to "${newStatus}"`);
  };

  const handleCategoryReclassify = (e: React.FormEvent) => {
    e.preventDefault();
    updateReportCategory(caseItem.id, newCategory);
    showFeedback(`Case category reclassified to "${newCategory}"`);
  };

  const handleAcceptAiClassification = () => {
    if (caseItem.aiSuggestedCategory) {
      updateReportCategory(caseItem.id, caseItem.aiSuggestedCategory);
      setNewCategory(caseItem.aiSuggestedCategory);
      showFeedback(`Accepted AI classification: "${caseItem.aiSuggestedCategory}"`);
    }
  };

  const handleOfficerAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const officer = users.find((u) => u.id === selectedOfficerId);
    if (officer) {
      assignOfficer(caseItem.id, officer.id, officer.name);
      showFeedback(`Case assigned to ${officer.name}`);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNoteText.trim()) return;
    addInvestigationNote(caseItem.id, internalNoteText.trim());
    setInternalNoteText('');
    showFeedback('Internal investigation note appended.');
  };

  return (
    <DashboardLayout
      allowedRoles={['Police Officer']}
      title={`Case File ${caseItem.referenceId}`}
      subtitle="Authorized Law Enforcement Terminal • All investigative actions are cryptographically audited."
    >
      <div className="space-y-6 max-w-5xl">
        {/* Back Navigation & Feedback */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('police-cases')}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cases Directory</span>
          </button>

          {actionMessage && (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{actionMessage}</span>
            </div>
          )}
        </div>

        {/* Top Case Identity Bar */}
        <div className="bg-slate-800/90 border border-slate-700/80 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-blue-400 uppercase">
              <span>Intake ID:</span>
              <span>{caseItem.id}</span>
            </div>
            <div className="text-3xl font-mono font-black text-white mt-0.5">
              {caseItem.referenceId}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {caseItem.date} ({caseItem.time})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {caseItem.location} ({caseItem.areaDistrict})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Priority</span>
              <PriorityBadge priority={caseItem.priority} />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Status</span>
              <StatusBadge status={caseItem.status} />
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Citizen Incident Data + AI Analysis (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Citizen-Visible Information Box */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Citizen Incident Report</span>
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                  Citizen-Visible Data
                </span>
              </div>

              {/* Reporter Identity Mode Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Reporter Mode
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                      caseItem.anonymous
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {caseItem.anonymous ? <EyeOff className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    <span>{caseItem.anonymous ? 'Anonymous Submission' : 'Registered Citizen'}</span>
                  </span>
                </div>

                {!caseItem.anonymous ? (
                  <div className="pt-2 border-t border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Name:</span>
                      <span className="font-semibold text-white">{caseItem.reporterName || 'Ananya Reddy'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Email:</span>
                      <span>{caseItem.reporterEmail || 'ananya@crimewatch.demo'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Phone:</span>
                      <span>{caseItem.reporterPhone || '+91 98XXX XXXXX'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 italic">
                    Reporter opted for anonymous reporting. Identity headers and contact credentials have been purged in compliance with privacy mandates.
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Incident Narrative
                </label>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {caseItem.description}
                </div>
              </div>

              {caseItem.additionalInfo && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Additional Context / Witness Info
                  </label>
                  <p className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-300 text-xs italic">
                    {caseItem.additionalInfo}
                  </p>
                </div>
              )}

              {/* Evidence Section */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Authorized Evidence Attachments ({caseItem.evidence.length})
                </label>
                {caseItem.evidence.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                    No evidence attachments provided for this case.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {caseItem.evidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-medium text-white block truncate">
                              {ev.fileName}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase">
                              {ev.fileType} • {ev.fileSize}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Classification Analysis Card */}
            <div className="bg-slate-800/80 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">AI Suggested Classification</h3>
                    <span className="text-xs text-purple-300 font-mono">Gemini Engine Evaluation (Advisory Only)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {caseItem.aiConfidence && (
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      Confidence: {Math.round(caseItem.aiConfidence * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200">
                <strong>Advisory Notice:</strong> This is an <em>AI Suggested Classification</em>, not a final crime decision. The AI engine does not establish legal guilt, identify individuals as criminals, or override human officer judgment.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <span className="text-slate-400 block mb-1">AI Suggested Classification</span>
                  <span className="text-sm font-bold text-purple-300">
                    {caseItem.aiSuggestedCategory || caseItem.category}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Currently Verified Category</span>
                  <span className="text-sm font-bold text-white">{caseItem.finalCategory}</span>
                </div>
              </div>

              {caseItem.aiReasoning && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-purple-300 block">Automated Incident Reasoning:</span>
                  <p className="leading-relaxed">{caseItem.aiReasoning}</p>
                </div>
              )}

              {caseItem.aiSimilarPatternNotes && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold block mb-0.5">Pattern Detection Note:</span>
                  <p>{caseItem.aiSimilarPatternNotes}</p>
                </div>
              )}

              {caseItem.aiHumanReviewRecommended && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="font-semibold">Human Review Recommended:</span>
                  <span>Ambiguity or borderline confidence detected. Investigator discretion required.</span>
                </div>
              )}

              {/* Action to accept AI category if different */}
              {caseItem.aiSuggestedCategory && caseItem.aiSuggestedCategory !== caseItem.finalCategory && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleAcceptAiClassification}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply AI Suggested Category ({caseItem.aiSuggestedCategory})</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Internal Police Workflows & Notes (1 Col) */}
          <div className="space-y-6">
            {/* Police Actions Console */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-slate-700 pb-3 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <span>Investigator Actions</span>
              </h3>

              {/* 1. Update Status Form */}
              <form onSubmit={handleStatusChange} className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Change Case Status</label>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Investigation in Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </form>

              {/* 2. Reclassify Category Form */}
              <form onSubmit={handleCategoryReclassify} className="space-y-2 pt-2 border-t border-slate-700/80">
                <label className="block text-xs font-semibold text-slate-300">Reclassify Category</label>
                <div className="flex gap-2">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CrimeCategory)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Theft">Theft</option>
                    <option value="Vehicle Theft">Vehicle Theft</option>
                    <option value="Assault">Assault</option>
                    <option value="Burglary">Burglary</option>
                    <option value="Vandalism">Vandalism</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>

              {/* 3. Assign Officer Form */}
              <form onSubmit={handleOfficerAssign} className="space-y-2 pt-2 border-t border-slate-700/80">
                <label className="block text-xs font-semibold text-slate-300">Assign Lead Officer</label>
                <div className="flex gap-2">
                  <select
                    value={selectedOfficerId}
                    onChange={(e) => setSelectedOfficerId(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="">Select Investigator</option>
                    {policeOfficers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.badgeNumber || 'Officer'})
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Assign
                  </button>
                </div>
                {caseItem.assignedOfficerName && (
                  <span className="text-[11px] text-slate-400 block">
                    Current Lead: <strong>{caseItem.assignedOfficerName}</strong>
                  </span>
                )}
              </form>
            </div>

            {/* STRICTLY INTERNAL INVESTIGATION NOTES */}
            <div className="bg-slate-800/80 border border-red-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Internal Police Notes
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/60">
                  Law Enforcement Only
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal">
                Notes added here are strictly confidential to authorized police personnel. They will <strong>NEVER</strong> be displayed on citizen portals or public tracking pages.
              </p>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={3}
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Record forensic details, witness contacts, or dispatch updates..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!internalNoteText.trim()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors shadow-md shadow-red-900/40 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Append Internal Note</span>
                  </button>
                </div>
              </form>

              {/* Notes Timeline List */}
              <div className="space-y-3 pt-3 border-t border-slate-700/80">
                {caseItem.internalNotes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-4">
                    No internal notes logged on this case yet.
                  </p>
                ) : (
                  caseItem.internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/80 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-slate-200">{note.officerName}</span>
                        <span className="text-[10px] font-mono">
                          {new Date(note.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
