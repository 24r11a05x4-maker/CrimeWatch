import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { User, Mail, Phone, ShieldCheck, Bell, Lock, Check } from 'lucide-react';

export const CitizenProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [notifyStatusChange, setNotifyStatusChange] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout
      allowedRoles={['Citizen']}
      title="Citizen Profile"
      subtitle="Manage your personal contact information and communication preferences."
    >
      <div className="max-w-2xl space-y-6">
        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Profile settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-700 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Contact Information
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address (Primary Identity)
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 text-sm text-slate-400 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Email is locked to your authenticated login.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3 pt-4 border-t border-slate-700">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" />
              Case Notifications
            </h3>

            <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-900 rounded-xl border border-slate-700">
              <input
                type="checkbox"
                checked={notifyStatusChange}
                onChange={(e) => setNotifyStatusChange(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
              />
              <span className="text-xs text-slate-300">
                Email me when police update the investigation status on my filed reports
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-700 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
