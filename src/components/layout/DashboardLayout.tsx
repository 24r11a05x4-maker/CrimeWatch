import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MapPin,
  User as UserIcon,
  ShieldAlert,
  BarChart3,
  Users,
  Lock,
  LogOut,
  ChevronRight,
  Shield,
  Activity,
  Menu,
  X,
  AlertOctagon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, AppPage } from '../../context/NavigationContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';

interface SidebarItem {
  id: AppPage;
  label: string;
  icon: React.ElementType;
}

export const DashboardLayout: React.FC<{
  children: React.ReactNode;
  allowedRoles: UserRole[];
  title: string;
  subtitle?: string;
}> = ({ children, allowedRoles, title, subtitle }) => {
  const { currentUser, logout, isCitizen, isPolice, isAdmin, demoLogin } = useAuth();
  const { currentPage, navigateTo } = useNavigation();
  const { t } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Strict role verification check
  const hasAccess = currentUser && allowedRoles.includes(currentUser.role);

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-slate-800/90 border border-slate-700 p-8 rounded-2xl shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Please log in to your Crime Watch account to access this area.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigateTo('login')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-900/40"
            >
              Go to Login
            </button>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-700/60">
              Or quick login with demo role:
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  demoLogin('Citizen');
                  navigateTo('citizen-overview');
                }}
                className="flex-1 py-1.5 text-xs bg-slate-700 hover:bg-slate-650 text-slate-200 rounded-lg transition-colors"
              >
                Citizen
              </button>
              <button
                onClick={() => {
                  demoLogin('Police Officer');
                  navigateTo('police-dashboard');
                }}
                className="flex-1 py-1.5 text-xs bg-slate-700 hover:bg-slate-650 text-slate-200 rounded-lg transition-colors"
              >
                Police
              </button>
              <button
                onClick={() => {
                  demoLogin('Administrator');
                  navigateTo('admin-dashboard');
                }}
                className="flex-1 py-1.5 text-xs bg-slate-700 hover:bg-slate-650 text-slate-200 rounded-lg transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-slate-800/90 border border-red-500/30 p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
            <AlertOctagon className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-300 mb-4">
            Your current role (<span className="text-amber-400 font-semibold">{currentUser.role}</span>) does not have authorization to view this interface.
          </p>
          <div className="p-3 bg-slate-900/80 rounded-xl text-xs text-slate-400 text-left mb-6 space-y-1 border border-slate-700">
            <div>• Citizens cannot access police or admin pages.</div>
            <div>• Police officers cannot access administrator-only controls.</div>
            <div>• Role restrictions are enforced at both navigation and page levels.</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                if (isCitizen) navigateTo('citizen-overview');
                else if (isPolice) navigateTo('police-dashboard');
                else navigateTo('admin-dashboard');
              }}
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
            >
              Return to My Authorized Dashboard
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="py-2.5 px-5 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-300 font-medium text-sm transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar items based on role
  let sidebarItems: SidebarItem[] = [];

  if (isCitizen) {
    sidebarItems = [
      { id: 'citizen-overview', label: t.nav.overview, icon: LayoutDashboard },
      { id: 'citizen-reports', label: t.nav.myReports, icon: FileText },
      { id: 'report', label: t.nav.reportCrime, icon: PlusCircle },
      { id: 'map', label: t.nav.crimeMap, icon: MapPin },
      { id: 'citizen-profile', label: t.nav.profile, icon: UserIcon },
    ];
  } else if (isPolice) {
    sidebarItems = [
      { id: 'police-dashboard', label: 'Command Center', icon: LayoutDashboard },
      { id: 'police-cases', label: t.nav.cases, icon: ShieldAlert },
      { id: 'map', label: t.nav.crimeMap, icon: MapPin },
      { id: 'police-analytics', label: t.nav.analytics, icon: BarChart3 },
      { id: 'police-profile', label: t.nav.profile, icon: UserIcon },
    ];
  } else if (isAdmin) {
    sidebarItems = [
      { id: 'admin-dashboard', label: 'Admin Overview', icon: LayoutDashboard },
      { id: 'admin-users', label: t.nav.users, icon: Users },
      { id: 'admin-reports', label: t.nav.reports, icon: FileText },
      { id: 'admin-audit', label: t.nav.securityAudit, icon: Lock },
      { id: 'admin-statistics', label: t.nav.statistics, icon: Activity },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Toggle Bar */}
      <div className="md:hidden bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center space-x-2 text-sm text-slate-200"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="font-semibold">{title}</span>
        </button>
        <span className="text-xs px-2.5 py-1 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
          {currentUser.role}
        </span>
      </div>

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed md:sticky top-16 md:top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-slate-950/95 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* User Badge Section */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="font-medium text-sm text-white truncate">{currentUser.name}</div>
              <div className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                <span>{currentUser.role}</span>
              </div>
            </div>
          </div>
          {currentUser.department && (
            <div className="mt-2 text-[11px] text-slate-400 truncate bg-slate-800/60 px-2 py-1 rounded border border-slate-700/50">
              {currentUser.department}
            </div>
          )}
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-200" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom Switch Role & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/20 space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2">
            Academic Demo Switch
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                demoLogin('Citizen');
                navigateTo('citizen-overview');
              }}
              className={`py-1 text-[11px] rounded ${
                isCitizen ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => {
                demoLogin('Police Officer');
                navigateTo('police-dashboard');
              }}
              className={`py-1 text-[11px] rounded ${
                isPolice ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Police
            </button>
            <button
              onClick={() => {
                demoLogin('Administrator');
                navigateTo('admin-dashboard');
              }}
              className={`py-1 text-[11px] rounded ${
                isAdmin ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>
          <button
            onClick={() => {
              logout();
              navigateTo('home');
            }}
            className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.nav.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                System Active
              </span>
            </div>
          </div>

          {/* Children View */}
          {children}
        </div>
      </main>
    </div>
  );
};
