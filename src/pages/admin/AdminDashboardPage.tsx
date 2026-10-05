import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigation } from '../../context/NavigationContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Users,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  Activity,
  UserCheck,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { users, reports, auditLogs } = useData();
  const { navigateTo } = useNavigation();

  // User counts
  const totalUsers = users.length;
  const citizenCount = users.filter((u) => u.role === 'Citizen').length;
  const policeCount = users.filter((u) => u.role === 'Police Officer').length;
  const adminCount = users.filter((u) => u.role === 'Administrator').length;

  // Report counts
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status !== 'Resolved').length;
  const resolvedCases = reports.filter((r) => r.status === 'Resolved').length;

  return (
    <DashboardLayout
      allowedRoles={['Administrator']}
      title="System Oversight & Governance"
      subtitle="Public safety infrastructure management, audit log streaming, and role governance."
    >
      <div className="space-y-8">
        {/* User Statistics Row */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Platform User Demographics</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
              <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
                Total Accounts
              </span>
              <div className="text-3xl font-black text-white">{totalUsers}</div>
              <span className="text-xs text-slate-400 mt-1 block">Registered in directory</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
              <span className="text-[11px] font-semibold uppercase text-blue-400 block mb-1">
                Citizens
              </span>
              <div className="text-3xl font-black text-blue-400">{citizenCount}</div>
              <span className="text-xs text-slate-400 mt-1 block">Community reporters</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
              <span className="text-[11px] font-semibold uppercase text-purple-400 block mb-1">
                Police Officers
              </span>
              <div className="text-3xl font-black text-purple-400">{policeCount}</div>
              <span className="text-xs text-slate-400 mt-1 block">Sworn personnel</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
              <span className="text-[11px] font-semibold uppercase text-emerald-400 block mb-1">
                Administrators
              </span>
              <div className="text-3xl font-black text-emerald-400">{adminCount}</div>
              <span className="text-xs text-slate-400 mt-1 block">Governance level</span>
            </div>
          </div>
        </div>

        {/* Report Status Statistics Row */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Incident Volume Metrics</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
              <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
                Total Incident Reports
              </span>
              <div className="text-3xl font-black text-white">{totalReports}</div>
              <span className="text-xs text-slate-400 mt-1 block">Ingested by system</span>
            </div>

            <div className="bg-slate-800/80 border border-amber-500/30 p-5 rounded-2xl shadow-lg">
              <span className="text-[11px] font-semibold uppercase text-amber-300 block mb-1">
                Pending Active Reports
              </span>
              <div className="text-3xl font-black text-amber-300">{pendingReports}</div>
              <span className="text-xs text-slate-400 mt-1 block">Awaiting or under inquiry</span>
            </div>

            <div className="bg-slate-800/80 border border-emerald-500/30 p-5 rounded-2xl shadow-lg">
              <span className="text-[11px] font-semibold uppercase text-emerald-400 block mb-1">
                Resolved & Documented Cases
              </span>
              <div className="text-3xl font-black text-emerald-400">{resolvedCases}</div>
              <span className="text-xs text-slate-400 mt-1 block">Final findings posted</span>
            </div>
          </div>
        </div>

        {/* Recent Audit Activity Stream */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Security & Audit Activity Stream</span>
              </h2>
              <p className="text-xs text-slate-400">
                Tamper-evident logs of authentications, case updates, and administrative changes.
              </p>
            </div>
            <button
              onClick={() => navigateTo('admin-audit')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Full Security Ledger ({auditLogs.length})
            </button>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">{log.userName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-blue-300 border border-slate-700">
                      {log.userRole}
                    </span>
                    <span className="text-[11px] font-bold text-amber-300">{log.action}</span>
                  </div>
                  <p className="text-slate-400">{log.details}</p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
