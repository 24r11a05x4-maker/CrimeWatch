import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigation } from '../../context/NavigationContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { FileText, Search, Download, Filter, ChevronRight, EyeOff, UserCheck } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { reports } = useData();
  const { setSelectedReportId, navigateTo } = useNavigation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filtered = reports.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.referenceId.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.finalCategory.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportData = () => {
    // Generate JSON download
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `crime_watch_reports_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <DashboardLayout
      allowedRoles={['Administrator']}
      title="System Reports Master Record"
      subtitle="Complete encrypted audit records of all citizen and officer reports logged in the system."
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reference, keyword, location..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2 px-3 rounded-xl focus:outline-none"
            >
              <option value="ALL">All Statuses ({reports.length})</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="Investigation in Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-650 text-white font-medium text-xs rounded-xl flex items-center space-x-1.5 shrink-0 transition-colors shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'Exported!' : 'Export Master JSON'}</span>
          </button>
        </div>

        {/* Master Table */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/80 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Reporter Mode</th>
                  <th className="py-3 px-4">Date & Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4 text-right">Officer Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-750/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {r.referenceId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{r.finalCategory}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          r.anonymous ? 'text-emerald-400' : 'text-blue-300'
                        }`}
                      >
                        {r.anonymous ? <EyeOff className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        <span>{r.anonymous ? 'Anonymous' : 'Registered'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{r.date}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{r.location}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={r.priority} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-300">
                      {r.aiConfidence ? `${Math.round(r.aiConfidence * 100)}%` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-300">
                      {r.assignedOfficerName || (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
