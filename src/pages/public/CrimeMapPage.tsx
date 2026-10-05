import React from 'react';
import { useData } from '../../context/DataContext';
import { CrimeMapComponent } from '../../components/map/CrimeMapComponent';
import { ShieldCheck, MapPin, Eye, Lock } from 'lucide-react';

export const CrimeMapPage: React.FC = () => {
  const { getPublicReports } = useData();
  const publicReports = getPublicReports();

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-blue-500" />
            <span>Public Incident Map</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore verified crime patterns, neighborhood incident distributions, and case resolutions.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Reporter Confidentiality Protected</span>
        </div>
      </div>

      {/* Main Interactive Map */}
      <CrimeMapComponent reports={publicReports} height="600px" />

      {/* Confidentiality Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Redacted Personal Data</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Victim and reporter identity, email addresses, phone numbers, and home addresses are permanently stripped from all public map displays.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Generalized Sectors</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Incident locations are grouped by municipal sectors and public transit corridors to protect neighborhood residents against private exposure.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Investigative Integrity</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Internal detective logs, witness statements, and evidence attachments are reserved exclusively for authorized police workstations.
          </p>
        </div>
      </div>
    </div>
  );
};
