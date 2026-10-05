import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ReportCrimePage } from './pages/public/ReportCrimePage';
import { TrackReportPage } from './pages/public/TrackReportPage';
import { CrimeMapPage } from './pages/public/CrimeMapPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { PrivacyPage } from './pages/public/PrivacyPage';

// Citizen Pages
import { CitizenOverviewPage } from './pages/citizen/CitizenOverviewPage';
import { CitizenReportsPage } from './pages/citizen/CitizenReportsPage';
import { CitizenReportDetailPage } from './pages/citizen/CitizenReportDetailPage';
import { CitizenProfilePage } from './pages/citizen/CitizenProfilePage';

// Police Pages
import { PoliceDashboardPage } from './pages/police/PoliceDashboardPage';
import { PoliceCasesPage } from './pages/police/PoliceCasesPage';
import { PoliceCaseDetailPage } from './pages/police/PoliceCaseDetailPage';
import { PoliceAnalyticsPage } from './pages/police/PoliceAnalyticsPage';
import { PoliceProfilePage } from './pages/police/PoliceProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { AdminStatisticsPage } from './pages/admin/AdminStatisticsPage';
import { DemoGuideModal } from './components/common/DemoGuideModal';

const AppContent: React.FC = () => {
  const { currentPage } = useNavigation();

  const renderCurrentPage = () => {
    switch (currentPage) {
      // Public Area
      case 'home':
        return <HomePage />;
      case 'report':
        return <ReportCrimePage />;
      case 'track':
        return <TrackReportPage />;
      case 'map':
        return <CrimeMapPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'privacy':
        return <PrivacyPage />;

      // Citizen Dashboard
      case 'citizen-overview':
        return <CitizenOverviewPage />;
      case 'citizen-reports':
        return <CitizenReportsPage />;
      case 'citizen-detail':
        return <CitizenReportDetailPage />;
      case 'citizen-profile':
        return <CitizenProfilePage />;

      // Police Dashboard
      case 'police-dashboard':
        return <PoliceDashboardPage />;
      case 'police-cases':
        return <PoliceCasesPage />;
      case 'police-detail':
        return <PoliceCaseDetailPage />;
      case 'police-analytics':
        return <PoliceAnalyticsPage />;
      case 'police-profile':
        return <PoliceProfilePage />;

      // Admin Dashboard
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-reports':
        return <AdminReportsPage />;
      case 'admin-audit':
        return <AdminAuditPage />;
      case 'admin-statistics':
        return <AdminStatisticsPage />;

      default:
        return <HomePage />;
    }
  };

  const isDashboardView =
    currentPage.startsWith('citizen-') ||
    currentPage.startsWith('police-') ||
    currentPage.startsWith('admin-');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className={`flex-1 ${isDashboardView ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'}`}>
        {renderCurrentPage()}
      </main>
      <DemoGuideModal />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
