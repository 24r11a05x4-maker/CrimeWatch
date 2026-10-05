import React from 'react';
import { useData } from '../../context/DataContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AnalyticsCharts } from '../../components/charts/AnalyticsCharts';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

export const PoliceAnalyticsPage: React.FC = () => {
  const { reports } = useData();

  return (
    <DashboardLayout
      allowedRoles={['Police Officer', 'Administrator']}
      title="Crime Analytics & Intelligence"
      subtitle="Historical incident trends, geographic concentrations, and investigative closure rates."
    >
      <div className="space-y-6">
        <AnalyticsCharts reports={reports} />
      </div>
    </DashboardLayout>
  );
};
