import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Users, Search, Shield, UserCheck, UserX, Edit2, Check, AlertCircle } from 'lucide-react';
import { User, UserRole, UserStatus } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const { users, toggleUserStatus, updateUserRole } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<UserRole>('Citizen');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRoleSave = (userId: string) => {
    updateUserRole(userId, tempRole);
    setEditingUserId(null);
    showNotify('User role updated successfully.');
  };

  return (
    <DashboardLayout
      allowedRoles={['Administrator']}
      title="User Management"
      subtitle="Govern platform user permissions, toggle access statuses, and reassign organizational roles."
    >
      <div className="space-y-6">
        {notification && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2 px-3 rounded-xl focus:outline-none"
            >
              <option value="ALL">All Roles ({users.length})</option>
              <option value="Citizen">Citizens</option>
              <option value="Police Officer">Police Officers</option>
              <option value="Administrator">Administrators</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/80 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((user) => {
                  const isEditing = editingUserId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-750/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{user.name}</div>
                        {user.badgeNumber && (
                          <span className="text-[10px] text-blue-400 font-mono">
                            Badge: {user.badgeNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={tempRole}
                              onChange={(e) => setTempRole(e.target.value as UserRole)}
                              className="bg-slate-900 border border-blue-500 text-white rounded p-1 text-xs"
                            >
                              <option value="Citizen">Citizen</option>
                              <option value="Police Officer">Police Officer</option>
                              <option value="Administrator">Administrator</option>
                            </select>
                            <button
                              onClick={() => handleRoleSave(user.id)}
                              className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500"
                              title="Save role"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="p-1 rounded bg-slate-700 text-slate-300 hover:text-white"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                              user.role === 'Administrator'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : user.role === 'Police Officer'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            user.status === 'Active'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              user.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'
                            }`}
                          />
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {/* Change Role Button */}
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setTempRole(user.role);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-650 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
                          >
                            Change Role
                          </button>
                        )}

                        {/* Toggle Status Button */}
                        <button
                          onClick={() => {
                            toggleUserStatus(user.id);
                            showNotify(
                              `Account ${user.name} toggled to ${
                                user.status === 'Active' ? 'Disabled' : 'Active'
                              }`
                            );
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            user.status === 'Active'
                              ? 'bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-800/40'
                              : 'bg-emerald-900/30 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40'
                          }`}
                        >
                          {user.status === 'Active' ? 'Disable Account' : 'Enable Account'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
