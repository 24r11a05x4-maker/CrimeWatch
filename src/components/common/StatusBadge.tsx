import React from 'react';
import { ReportStatus, ReportPriority } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
  const { t } = useLanguage();

  const getStyle = () => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Under Review':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Assigned':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Investigation in Progress':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Resolved':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {t.statusLabels[status] || status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: ReportPriority }> = ({ priority }) => {
  const getStyle = () => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Low':
        return 'bg-slate-600/30 text-slate-300 border-slate-500/30';
      default:
        return 'bg-slate-700/50 text-slate-400 border-slate-600';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStyle()}`}>
      {priority}
    </span>
  );
};
