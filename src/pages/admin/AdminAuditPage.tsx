import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Lock, Search, Filter, ShieldCheck, Clock, Terminal } from 'lucide-react';
import { AuditLog } from '../../types';

export const AdminAuditPage: React.FC = () => {
  const { auditLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filtered = auditLogs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        (log.ipAddress && log.ipAddress.includes(q))
      );
    }
    return true;
  });

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'Login':
      case 'Logout':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'Report created':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'Case updated':
      case 'Status updated':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Role changed':
      case 'Administrative action':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <DashboardLayout
      allowedRoles={['Administrator']}
      title="Security & Audit Trail"
      subtitle="Immutable cryptographic access logging for administrative compliance, accountability, and forensic integrity."
    >
      <div className="space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, action details, IP address..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2 px-3 rounded-xl focus:outline-none"
            >
              <option value="ALL">All Event Types ({auditLogs.length})</option>
              <option value="Login">Login</option>
              <option value="Logout">Logout</option>
              <option value="Report created">Report Created</option>
              <option value="Case updated">Case Updated</option>
              <option value="Status updated">Status Updated</option>
              <option value="Role changed">Role Changed</option>
              <option value="Administrative action">Administrative Action</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/80 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Action Details</th>
                  <th className="py-3 px-4 text-right">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-750/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{log.userName}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate">{log.details}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">
                      {log.ipAddress || '127.0.0.1'}
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
