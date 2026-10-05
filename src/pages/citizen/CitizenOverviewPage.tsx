import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigation } from '../../context/NavigationContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FileText, PlusCircle, CheckCircle2, Clock, MapPin, ChevronRight, ShieldAlert } from 'lucide-react';

export const CitizenOverviewPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports } = useData();
  const { navigateTo, setSelectedReportId } = useNavigation();

  // Filter reports submitted by this user (or anonymous reports demo-assigned)
  const myReports = reports.filter(
    (r) => !r.anonymous && (r.reporterId === currentUser?.id || r.reporterEmail === currentUser?.email)
  );

  const activeReports = myReports.filter((r) => r.status !== 'Resolved');
  const resolvedReports = myReports.filter((r) => r.status === 'Resolved');

  return (
    <DashboardLayout
      allowedRoles={['Citizen']}
      title="Citizen Dashboard"
      subtitle={`Welcome back, ${currentUser?.name || 'Citizen'}. Monitor your submitted incident reports and community safety updates.`}
    >
      <div className="space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>My Reports</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{myReports.length}</div>
            <div className="text-xs text-slate-400 mt-2">Incidents filed by your account</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Active Inquiries</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{activeReports.length}</div>
            <div className="text-xs text-slate-400 mt-2">Under review or active investigation</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Resolved Cases</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{resolvedReports.length}</div>
            <div className="text-xs text-slate-400 mt-2">Closed with official department conclusion</div>
          </div>
        </div>

        {/* Quick Action Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Witness or Experience an Incident?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Submit an encrypted report with optional photos and automatic AI assistance.
            </p>
          </div>
          <button
            onClick={() => navigateTo('report')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-900/40 flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File New Report</span>
          </button>
        </div>

        {/* Recent Reports List */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Recent Filed Reports</h2>
              <p className="text-xs text-slate-400">Reports submitted from this citizen account</p>
            </div>
            <button
              onClick={() => navigateTo('citizen-reports')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              View All ({myReports.length})
            </button>
          </div>

          {myReports.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">No incident reports filed under this account yet.</p>
              <button
                onClick={() => navigateTo('report')}
                className="text-xs text-blue-400 hover:underline"
              >
                Submit your first report now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {myReports.slice(0, 4).map((report) => (
                <div
                  key={report.id}
                  onClick={() => {
                    setSelectedReportId(report.id);
                    navigateTo('citizen-detail', report.id);
                  }}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-750/50 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-blue-400 font-semibold">
                        {report.referenceId}
                      </span>
                      <span className="text-xs font-bold text-white">{report.finalCategory}</span>
                      <StatusBadge status={report.status} />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-lg">
                      {report.description}
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-3">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.location}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
