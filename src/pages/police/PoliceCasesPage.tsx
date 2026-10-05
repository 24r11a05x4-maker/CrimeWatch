import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigation } from '../../context/NavigationContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { Search, Filter, ChevronRight, ShieldAlert, Sparkles } from 'lucide-react';
import { CrimeCategory, ReportStatus } from '../../types';

export const PoliceCasesPage: React.FC = () => {
  const { reports } = useData();
  const { navigateTo, setSelectedReportId } = useNavigation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  const uniqueDistricts = Array.from(new Set(reports.map((r) => r.areaDistrict).filter(Boolean)));

  const filtered = reports.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && r.finalCategory !== categoryFilter) return false;
    if (locationFilter !== 'ALL' && r.areaDistrict !== locationFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.referenceId.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.finalCategory.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.assignedOfficerName && r.assignedOfficerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <DashboardLayout
      allowedRoles={['Police Officer']}
      title="Case Management Directory"
      subtitle="Examine, prioritize, and initiate authorized investigations across all intake cases."
    >
      <div className="space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reference ID, keyword, location, or assigned officer..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-3 rounded-xl focus:outline-none"
              >
                <option value="ALL">All Statuses ({reports.length})</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="Investigation in Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-3 rounded-xl focus:outline-none"
              >
                <option value="ALL">All Categories</option>
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

              {/* District Filter */}
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-3 rounded-xl focus:outline-none"
              >
                <option value="ALL">All Sectors</option>
                {uniqueDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Case Table */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/80 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setSelectedReportId(item.id);
                      navigateTo('police-detail', item.id);
                    }}
                    className="hover:bg-slate-750/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {item.referenceId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {item.finalCategory}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{item.date}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReportId(item.id);
                          navigateTo('police-detail', item.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white transition-colors font-medium text-xs inline-flex items-center gap-1"
                      >
                        Open Case <ChevronRight className="w-3.5 h-3.5" />
                      </button>
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
