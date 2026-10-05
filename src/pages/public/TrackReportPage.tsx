import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigation } from '../../context/NavigationContext';
import { ReportStatus, CrimeReport } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export const TrackReportPage: React.FC = () => {
  const { getReportByReference, reports } = useData();
  const { trackRefQuery, setTrackRefQuery } = useNavigation();
  const { t } = useLanguage();

  const [inputRef, setInputRef] = useState<string>(trackRefQuery || '');
  const [searchedReport, setSearchedReport] = useState<CrimeReport | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    if (trackRefQuery) {
      setInputRef(trackRefQuery);
      const rep = getReportByReference(trackRefQuery);
      if (rep) {
        setSearchedReport(rep);
        setHasSearched(true);
      }
    }
  }, [trackRefQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.trim()) return;

    const rep = getReportByReference(inputRef);
    setSearchedReport(rep || null);
    setHasSearched(true);
  };

  // Define the standard 6-stage timeline
  const timelineStages: { key: string; label: string; description: string }[] = [
    {
      key: 'Submitted',
      label: 'Submitted',
      description: 'Report recorded and assigned a unique reference ID.',
    },
    {
      key: 'AI Analysis',
      label: 'AI Suggested Classification',
      description: 'Automated initial category suggestion and advisory priority assessment completed.',
    },
    {
      key: 'Under Review',
      label: 'Under Review',
      description: 'Desk officer reviewing initial details and confirming jurisdiction.',
    },
    {
      key: 'Assigned',
      label: 'Assigned to Investigator',
      description: 'Case transferred to investigative unit for active handling.',
    },
    {
      key: 'Investigation in Progress',
      label: 'Investigation in Progress',
      description: 'Active inquiries, witness outreach, and evidence collection.',
    },
    {
      key: 'Resolved',
      label: 'Resolved / Closed',
      description: 'Official findings finalized and case closed by department.',
    },
  ];

  // Helper to determine stage state
  const getStageStatus = (stageKey: string, reportStatus: ReportStatus) => {
    const statusOrder: Record<ReportStatus, number> = {
      Submitted: 1,
      'Under Review': 3,
      Assigned: 4,
      'Investigation in Progress': 5,
      Resolved: 6,
    };

    const currentLevel = statusOrder[reportStatus] || 1;

    let stageLevel = 1;
    if (stageKey === 'Submitted') stageLevel = 1;
    else if (stageKey === 'AI Analysis') stageLevel = 2; // Always reached once submitted
    else if (stageKey === 'Under Review') stageLevel = 3;
    else if (stageKey === 'Assigned') stageLevel = 4;
    else if (stageKey === 'Investigation in Progress') stageLevel = 5;
    else if (stageKey === 'Resolved') stageLevel = 6;

    if (stageLevel < currentLevel) return 'completed';
    if (stageLevel === currentLevel) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Track Your Report</h1>
        <p className="text-sm text-slate-400">
          Enter your Crime Watch reference number to view real-time status updates and official progress.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputRef}
              onChange={(e) => setInputRef(e.target.value)}
              placeholder="e.g. CW-2026-0001"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-900/30 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Track Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Reference Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400">Sample Reference IDs:</span>
          {reports.slice(0, 4).map((r) => (
            <button
              key={r.referenceId}
              type="button"
              onClick={() => {
                setInputRef(r.referenceId);
                setSearchedReport(r);
                setHasSearched(true);
              }}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-750 text-blue-400 border border-slate-700 font-mono text-[11px] cursor-pointer"
            >
              {r.referenceId}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {hasSearched && (
        <div className="space-y-6">
          {searchedReport ? (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Report Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700">
                <div>
                  <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">
                    Official Reference Number
                  </span>
                  <div className="text-3xl font-mono font-black text-white mt-0.5">
                    {searchedReport.referenceId}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reported on {searchedReport.date} at {searchedReport.time}</span>
                  </div>
                </div>

                <div className="sm:text-right space-y-1.5">
                  <div className="text-xs text-slate-400">Current Phase</div>
                  <StatusBadge status={searchedReport.status} />
                </div>
              </div>

              {/* Public Incident Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
                    Verified Category
                  </span>
                  <span className="text-base font-bold text-white">{searchedReport.finalCategory}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
                    General Area
                  </span>
                  <span className="text-sm font-medium text-slate-200">{searchedReport.areaDistrict}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
                    Submission Mode
                  </span>
                  <span className="text-sm font-medium text-emerald-400">
                    {searchedReport.anonymous ? 'Anonymous Report' : 'Registered Citizen'}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Investigation Progress Timeline
                </h3>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-700 before:z-0">
                  {timelineStages.map((stage, idx) => {
                    const state = getStageStatus(stage.key, searchedReport.status);
                    return (
                      <div key={idx} className="relative z-10 flex items-start space-x-4">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                            state === 'completed'
                              ? 'bg-emerald-600 border-emerald-400 text-white'
                              : state === 'current'
                              ? 'bg-blue-600 border-blue-400 text-white animate-pulse'
                              : 'bg-slate-800 border-slate-700 text-slate-500'
                          }`}
                        >
                          {state === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>

                        <div
                          className={`flex-1 p-3.5 rounded-xl border transition-all ${
                            state === 'current'
                              ? 'bg-blue-950/30 border-blue-500/40 text-blue-100 shadow-md'
                              : state === 'completed'
                              ? 'bg-slate-900/90 border-slate-700/80 text-slate-200'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{stage.label}</span>
                            {state === 'current' && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/40 text-blue-300 border border-blue-500/40">
                                Current Status
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{stage.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Citizen Confidentiality Notice */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-400 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block mb-0.5">Information Privacy Boundary:</strong>
                  In accordance with Crime Watch SRS confidentiality mandates, this tracking portal displays only citizen-appropriate case status milestones. Internal investigative notes, detective logs, sensitive evidence files, and reporter personal identifiers are strictly restricted to authorized police terminals.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No Report Found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                We could not locate any incident matching reference ID <code className="text-blue-400">{inputRef}</code>. Please ensure the reference number is entered correctly (e.g., CW-2026-0001).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
