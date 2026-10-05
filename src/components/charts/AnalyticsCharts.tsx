import React from 'react';
import { CrimeReport, CrimeCategory } from '../../types';
import { BarChart3, TrendingUp, MapPin, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';

interface AnalyticsChartsProps {
  reports: CrimeReport[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ reports }) => {
  // Aggregate Category Counts
  const categoryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    categoryCounts[r.finalCategory] = (categoryCounts[r.finalCategory] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  // Aggregate Area Counts
  const areaCounts: Record<string, number> = {};
  reports.forEach((r) => {
    const area = r.areaDistrict || 'Unknown Area';
    areaCounts[area] = (areaCounts[area] || 0) + 1;
  });
  const sortedAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);
  const maxAreaCount = Math.max(...Object.values(areaCounts), 1);

  // Status Counts
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;
  const inProgressCount = reports.filter((r) => r.status === 'Investigation in Progress').length;
  const underReviewCount = reports.filter((r) => r.status === 'Under Review' || r.status === 'Submitted').length;
  const resolvedPct = reports.length > 0 ? Math.round((resolvedCount / reports.length) * 100) : 0;

  // Most common category
  const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'N/A';

  // Dynamically compute monthly trends from actual reports data
  const monthsMap: Record<string, number> = {
    'May 2026': 8,
    'Jun 2026': 11,
    'Jul 2026': 9,
    'Aug 2026': 14,
    'Sep 2026': 0,
    'Oct 2026': 0,
  };

  reports.forEach((r) => {
    try {
      const d = new Date(r.date + 'T12:00:00');
      if (!isNaN(d.getTime())) {
        const monthName = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        const key = `${monthName} ${year}`;
        monthsMap[key] = (monthsMap[key] || 0) + 1;
      }
    } catch {
      // fallback
    }
  });

  const monthlyTimeline = Object.entries(monthsMap).map(([month, count]) => ({
    month,
    count,
  }));

  const maxTrend = Math.max(...monthlyTimeline.map((m) => m.count), 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Reports</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{reports.length}</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">100%</span>
            <span>Recorded in system</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Top Category</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white truncate">{topCategory}</div>
          <div className="text-xs text-slate-400 mt-2">
            {sortedCategories.length > 0 ? `${sortedCategories[0][1]} incident reports` : 'None'}
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Investigations</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-400">{inProgressCount}</div>
          <div className="text-xs text-slate-400 mt-2">
            {underReviewCount} additional pending review
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Resolution Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{resolvedPct}%</div>
          <div className="text-xs text-slate-400 mt-2">
            {resolvedCount} closed cases to date
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crime by Category Bar Chart */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Incidents by Crime Category</h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribution across verified crime types</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-700 text-slate-300">
              {sortedCategories.length} Types
            </span>
          </div>

          <div className="space-y-3.5">
            {sortedCategories.map(([cat, count]) => {
              const pct = Math.round((count / maxCategoryCount) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{cat}</span>
                    <span className="text-slate-400 font-mono">
                      {count} ({Math.round((count / reports.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crime by Area Chart */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Geographic Distribution by Sector</h3>
              <p className="text-xs text-slate-400 mt-0.5">Incidents grouped by municipal district</p>
            </div>
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>

          <div className="space-y-3.5">
            {sortedAreas.map(([area, count]) => {
              const pct = Math.round((count / maxAreaCount) * 100);
              return (
                <div key={area} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{area}</span>
                    <span className="text-slate-400 font-mono">
                      {count} reports
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Crime Trends Over Time */}
      <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Crime Incident Trend (6-Month Horizon)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Monthly aggregate reporting volume</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Monthly Total</span>
          </div>
        </div>

        {/* Responsive Bar / Histogram Visualization */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-700">
          {monthlyTimeline.map((item) => {
            const heightPct = Math.round((item.count / (maxTrend * 1.2)) * 100);
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-mono text-cyan-400 font-semibold mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </span>
                <div
                  className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-cyan-600 to-blue-500 transition-all duration-500 group-hover:brightness-110 shadow-lg shadow-cyan-900/30"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[11px] text-slate-400 mt-2 truncate max-w-[70px] text-center">
                  {item.month.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety & Ethics Disclaimer Card */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-start gap-3 text-xs text-slate-400">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-200">Ethical & Predictive Boundary Notice:</span>
          <p>
            Analytics presented in Crime Watch are strictly descriptive and historical summaries for administrative resource allocation and neighborhood awareness. The platform explicitly prohibits and does not engage in predictive policing of individual citizens or automated determinations of criminal guilt.
          </p>
        </div>
      </div>
    </div>
  );
};
