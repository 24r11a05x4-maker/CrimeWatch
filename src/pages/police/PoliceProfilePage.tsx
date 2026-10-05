import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Shield, BadgeCheck, Mail, Phone, Building, Lock } from 'lucide-react';

export const PoliceProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <DashboardLayout
      allowedRoles={['Police Officer']}
      title="Officer Credentials"
      subtitle="Authorized Department Personnel Record • Crime Watch Secure Clearance."
    >
      <div className="max-w-2xl space-y-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center space-x-4 border-b border-slate-700 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xl text-2xl font-bold">
              {currentUser?.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{currentUser?.name}</h2>
              <div className="flex items-center space-x-2 text-xs text-blue-400 font-mono mt-0.5">
                <BadgeCheck className="w-4 h-4" />
                <span>Badge #{currentUser?.badgeNumber || 'CW-8492'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Assigned Department
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-400" />
                {currentUser?.department || 'Metro Central Investigations'}
              </span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Clearance Tier
              </span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                Sworn Investigator (Level 2)
              </span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Department Email
              </span>
              <span className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {currentUser?.email}
              </span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Duty Phone
              </span>
              <span className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                {currentUser?.phone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
