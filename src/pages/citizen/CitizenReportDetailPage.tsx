import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useData } from '../../context/DataContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  FileCheck,
  Lock,
  ExternalLink,
} from 'lucide-react';

export const CitizenReportDetailPage: React.FC = () => {
  const { selectedReportId, navigateTo, setTrackRefQuery } = useNavigation();
  const { reports } = useData();

  const report = reports.find((r) => r.id === selectedReportId);

  if (!report) {
    return (
      <DashboardLayout allowedRoles={['Citizen']} title="Report Details">
        <div className="bg-slate-800 p-8 rounded-2xl text-center space-y-4">
          <p className="text-slate-400">Report not found or invalid reference.</p>
          <button
            onClick={() => navigateTo('citizen-reports')}
            className="px-4 py-2 bg-blue-600 rounded-xl text-white text-xs font-semibold"
          >
            Back to My Reports
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      allowedRoles={['Citizen']}
      title={`Report ${report.referenceId}`}
      subtitle="Official citizen record and verified progress log."
    >
      <div className="space-y-6 max-w-4xl">
        {/* Back Link */}
        <button
          onClick={() => navigateTo('citizen-reports')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Reports</span>
        </button>

        {/* Top Summary Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-blue-400 font-semibold uppercase">
              Reference Number
            </div>
            <div className="text-3xl font-mono font-extrabold text-white mt-0.5">
              {report.referenceId}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {report.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {report.time}
              </span>
            </div>
          </div>

          <div className="sm:text-right space-y-2">
            <div className="text-xs text-slate-400">Department Status</div>
            <StatusBadge status={report.status} />
          </div>
        </div>

        {/* Incident Content */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white border-b border-slate-700 pb-3">
            Incident Description & Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
              <span className="text-slate-400 block mb-1">Crime Category</span>
              <span className="text-sm font-bold text-white">{report.finalCategory}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
              <span className="text-slate-400 block mb-1">Location / Sector</span>
              <span className="text-sm font-medium text-slate-200">{report.location}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Description Submitted
            </label>
            <p className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              {report.description}
            </p>
          </div>

          {report.additionalInfo && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Additional Information
              </label>
              <p className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-300 text-xs italic">
                {report.additionalInfo}
              </p>
            </div>
          )}

          {/* Evidence Attachments */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Attached Evidence ({report.evidence.length})
            </label>
            {report.evidence.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No evidence files attached to this report.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.evidence.map((ev) => (
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

        {/* Public Track Link */}
        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-slate-300">
            Need to share this report's public milestone status with your household or insurer?
          </span>
          <button
            onClick={() => {
              setTrackRefQuery(report.referenceId);
              navigateTo('track');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-white font-semibold transition-colors flex items-center space-x-1.5"
          >
            <span>Open Tracking Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Security / Confidentiality Assertion */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex items-start space-x-3 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-200">Investigative Segregation Notice:</span>
            <p>
              In accordance with Crime Watch specifications, active police notes, detective communications, and tactical inquiries are strictly kept confidential inside internal department consoles and are never visible on citizen screens.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
