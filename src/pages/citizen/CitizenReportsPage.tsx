import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigation } from '../../context/NavigationContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Filter, ChevronRight, FileText, PlusCircle } from 'lucide-react';
import { CrimeCategory, ReportStatus } from '../../types';

export const CitizenReportsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports } = useData();
  const { navigateTo, setSelectedReportId } = useNavigation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter reports submitted by this user
  const myReports = reports.filter(
    (r) => !r.anonymous && (r.reporterId === currentUser?.id || r.reporterEmail === currentUser?.email)
  );

  const filtered = myReports.filter((r) => {
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

  return (
    <DashboardLayout
      allowedRoles={['Citizen']}
      title="My Reports"
      subtitle="View, search, and track all incidents filed through your citizen account."
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl shadow-lg">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reference, description..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2 px-3 rounded-xl focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="Investigation in Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <button
            onClick={() => navigateTo('report')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl flex items-center space-x-1.5 shrink-0 transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>

        {/* Reports Table / Cards */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12 p-6 space-y-2">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No reports match your filters</h3>
              <p className="text-xs text-slate-400">Try altering your search keyword or status criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/80 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => {
                        setSelectedReportId(r.id);
                        navigateTo('citizen-detail', r.id);
                      }}
                      className="hover:bg-slate-750/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                        {r.referenceId}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">{r.finalCategory}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {r.date} ({r.time})
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-[200px] truncate">
                        {r.location}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1">
                          Details <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
