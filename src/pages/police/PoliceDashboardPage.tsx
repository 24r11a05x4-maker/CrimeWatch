import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigation } from '../../context/NavigationContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';

export const PoliceDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports } = useData();
  const { navigateTo, setSelectedReportId } = useNavigation();

  const totalReports = reports.length;
  const newReports = reports.filter((r) => r.status === 'Submitted').length;
  const underReview = reports.filter((r) => r.status === 'Under Review').length;
  const assignedCases = reports.filter((r) => r.status === 'Assigned').length;
  const inProgressCases = reports.filter((r) => r.status === 'Investigation in Progress').length;
  const resolvedCases = reports.filter((r) => r.status === 'Resolved').length;

  return (
    <DashboardLayout
      allowedRoles={['Police Officer']}
      title="Law Enforcement Command Center"
      subtitle={`Investigator terminal active • Logged in as ${currentUser?.name} (${currentUser?.badgeNumber || 'CW-8492'})`}
    >
      <div className="space-y-8">
        {/* 6 Required Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Total Reports */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl shadow-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Total Reports
            </span>
            <div className="text-2xl font-black text-white">{totalReports}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">In intake database</span>
          </div>

          {/* 2. New Reports */}
          <div className="bg-slate-800/80 border border-blue-500/30 p-4 rounded-2xl shadow-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 block mb-1">
              New Reports
            </span>
            <div className="text-2xl font-black text-blue-400">{newReports}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Awaiting triage</span>
          </div>

          {/* 3. Under Review */}
          <div className="bg-slate-800/80 border border-amber-500/30 p-4 rounded-2xl shadow-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-1">
              Under Review
            </span>
            <div className="text-2xl font-black text-amber-300">{underReview}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Desk evaluation</span>
          </div>

          {/* 4. Assigned Cases */}
          <div className="bg-slate-800/80 border border-purple-500/30 p-4 rounded-2xl shadow-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 block mb-1">
              Assigned
            </span>
            <div className="text-2xl font-black text-purple-300">{assignedCases}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Officer allocated</span>
          </div>

          {/* 5. In Progress */}
          <div className="bg-slate-800/80 border border-cyan-500/30 p-4 rounded-2xl shadow-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300 block mb-1">
              In Progress
            </span>
            <div className="text-2xl font-black text-cyan-300">{inProgressCases}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Active investigation</span>
          </div>

          {/* 6. Resolved */}
          <div className="bg-slate-800/80 border border-emerald-500/30 p-4 rounded-2xl shadow-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
              Resolved Cases
            </span>
            <div className="text-2xl font-black text-emerald-400">{resolvedCases}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Closed & documented</span>
          </div>
        </div>

        {/* Priority Action Cases Section */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span>Active Investigative Case Queue</span>
              </h2>
              <p className="text-xs text-slate-400">
                Incoming and prioritized incidents requiring investigator review or action.
              </p>
            </div>
            <button
              onClick={() => navigateTo('police-cases')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Open Full Case Directory ({reports.length})
            </button>
          </div>

          {/* Table */}
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
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {reports.slice(0, 6).map((caseItem) => (
                  <tr
                    key={caseItem.id}
                    onClick={() => {
                      setSelectedReportId(caseItem.id);
                      navigateTo('police-detail', caseItem.id);
                    }}
                    className="hover:bg-slate-750/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">
                      {caseItem.referenceId}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {caseItem.finalCategory}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-[180px] truncate">
                      {caseItem.location}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{caseItem.date}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={caseItem.status} />
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={caseItem.priority} />
                    </td>
                    <td className="py-3 px-4 font-mono text-purple-300">
                      {caseItem.aiConfidence ? `${Math.round(caseItem.aiConfidence * 100)}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReportId(caseItem.id);
                          navigateTo('police-detail', caseItem.id);
                        }}
                        className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg font-medium text-xs transition-colors inline-flex items-center gap-1"
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

        {/* Quick Links Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => navigateTo('map')}
            className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/40 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Geographic Incident Map</span>
              </h3>
              <p className="text-xs text-slate-400">
                Visualize report clusters across municipal sectors and transit corridors.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>

          <div
            onClick={() => navigateTo('police-analytics')}
            className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-purple-500/40 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Department Analytics</span>
              </h3>
              <p className="text-xs text-slate-400">
                Examine crime distribution charts, category breakdowns, and resolution rates.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
