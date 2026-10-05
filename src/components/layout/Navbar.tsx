import React, { useState } from 'react';
import { Shield, Menu, X, User, LogOut, ChevronDown, Activity, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation, AppPage } from '../../context/NavigationContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout, demoLogin } = useAuth();
  const { t } = useLanguage();
  const { currentPage, navigateTo } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getDashboardDestination = (): AppPage => {
    if (!currentUser) return 'login';
    if (currentUser.role === 'Police Officer') return 'police-dashboard';
    if (currentUser.role === 'Administrator') return 'admin-dashboard';
    return 'citizen-overview';
  };

  const navLinks = [
    { label: t.nav.home, page: 'home' as AppPage },
    { label: t.nav.reportCrime, page: 'report' as AppPage },
    { label: t.nav.trackReport, page: 'track' as AppPage },
    { label: t.nav.crimeMap, page: 'map' as AppPage },
  ];

  const handleRoleSwitch = (role: UserRole) => {
    demoLogin(role);
    setRoleMenuOpen(false);
    if (role === 'Police Officer') navigateTo('police-dashboard');
    else if (role === 'Administrator') navigateTo('admin-dashboard');
    else navigateTo('citizen-overview');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/30 border border-blue-500/40">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Crime Watch
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSelector />

            {isAuthenticated && currentUser ? (
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateTo(getDashboardDestination())}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sm font-medium text-slate-200 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600/40 flex items-center justify-center text-xs font-semibold text-blue-300">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="max-w-[120px] truncate">{currentUser.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60">
                      {currentUser.role}
                    </span>
                  </button>

                  {/* Switch Role Quick Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                      title="Quick Switch Role"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {roleMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                          Switch Role (Demo)
                        </div>
                        <button
                          onClick={() => handleRoleSwitch('Citizen')}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-750 ${
                            currentUser.role === 'Citizen' ? 'text-blue-400 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          <span>Citizen (Ananya Reddy)</span>
                          {currentUser.role === 'Citizen' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('Police Officer')}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-750 ${
                            currentUser.role === 'Police Officer' ? 'text-blue-400 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          <span>Police (Sub-Insp. Arjun Rao)</span>
                          {currentUser.role === 'Police Officer' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('Administrator')}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-750 ${
                            currentUser.role === 'Administrator' ? 'text-blue-400 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          <span>Admin (Joint Comm. Priya Nair)</span>
                          {currentUser.role === 'Administrator' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </button>
                        <div className="border-t border-slate-700/60 my-1"></div>
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            logout();
                            navigateTo('home');
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-slate-750 flex items-center space-x-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t.nav.logout}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateTo('login')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => navigateTo('register')}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/40 transition-colors"
                >
                  {t.nav.register}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  navigateTo(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                  currentPage === link.page
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {isAuthenticated && currentUser ? (
              <>
                <button
                  onClick={() => {
                    navigateTo(getDashboardDestination());
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 text-slate-200 font-medium flex items-center justify-between"
                >
                  <span>{currentUser.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-900 text-blue-300">
                    {currentUser.role}
                  </span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      demoLogin('Citizen');
                      navigateTo('citizen-overview');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 text-xs bg-slate-800 rounded text-slate-300"
                  >
                    Citizen
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('Police Officer');
                      navigateTo('police-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 text-xs bg-slate-800 rounded text-slate-300"
                  >
                    Police
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('Administrator');
                      navigateTo('admin-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 text-xs bg-slate-800 rounded text-slate-300"
                  >
                    Admin
                  </button>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigateTo('home');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.logout}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigateTo('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center text-sm font-medium bg-slate-800 text-slate-200 rounded-lg"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => {
                    navigateTo('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center text-sm font-medium bg-blue-600 text-white rounded-lg"
                >
                  {t.nav.register}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
