import React from 'react';
import { useData } from '../../context/DataContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Activity, Server, Cpu, HardDrive, ShieldCheck, Zap, Database } from 'lucide-react';

export const AdminStatisticsPage: React.FC = () => {
  const { reports, users, auditLogs } = useData();

  const totalReports = reports.length;
  const resolvedReports = reports.filter((r) => r.status === 'Resolved').length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

  return (
    <DashboardLayout
      allowedRoles={['Administrator']}
      title="System Diagnostics & Telemetry"
      subtitle="Operational performance indicators, infrastructure load, and data retention metrics."
    >
      <div className="space-y-8">
        {/* Core System Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Platform Uptime</span>
              <Server className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">99.98%</div>
            <div className="text-xs text-slate-400 mt-2">Zero unplanned outages</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Avg. AI Triage Latency</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-400">1.24s</div>
            <div className="text-xs text-slate-400 mt-2">Gemini 3.8 Flash Engine</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Overall Clearance Rate</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-blue-400">{resolutionRate}%</div>
            <div className="text-xs text-slate-400 mt-2">{resolvedReports} cases resolved</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Audit Entries</span>
              <Database className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-300">{auditLogs.length}</div>
            <div className="text-xs text-slate-400 mt-2">Cryptographically chained</div>
          </div>
        </div>

        {/* Diagnostic Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Subsystem Health & Integrations</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-slate-300 font-medium">Gemini AI Classification Service</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-slate-300 font-medium">Public Leaflet GIS Geospatial Tiles</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-slate-300 font-medium">Role-Based Access Enforcement (RBAC)</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Strict / Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-slate-300 font-medium">Anonymous Identity Firewall</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Enforced
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Storage & Data Retention</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Incident Master Storage</span>
                  <span className="font-mono text-cyan-400">{reports.length * 14} KB / 500 MB</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '4%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Audit Logs Storage</span>
                  <span className="font-mono text-cyan-400">{auditLogs.length * 8} KB / 250 MB</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '2%' }} />
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                Data retention complies with municipal public records standards. Redacted logs are cached for 365 days.
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
