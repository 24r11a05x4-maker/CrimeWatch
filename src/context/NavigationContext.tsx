import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppPage =
  | 'home'
  | 'report'
  | 'track'
  | 'map'
  | 'login'
  | 'register'
  | 'privacy'
  | 'citizen-overview'
  | 'citizen-reports'
  | 'citizen-detail'
  | 'citizen-profile'
  | 'police-dashboard'
  | 'police-cases'
  | 'police-detail'
  | 'police-analytics'
  | 'police-profile'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-reports'
  | 'admin-audit'
  | 'admin-statistics';

interface NavigationContextType {
  currentPage: AppPage;
  navigateTo: (page: AppPage, reportId?: string) => void;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  trackRefQuery: string | null;
  setTrackRefQuery: (query: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [trackRefQuery, setTrackRefQuery] = useState<string | null>(null);

  // Sync scroll to top on navigation
  const navigateTo = (page: AppPage, reportId?: string) => {
    setCurrentPage(page);
    if (reportId !== undefined) {
      setSelectedReportId(reportId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedReportId,
        setSelectedReportId,
        trackRefQuery,
        setTrackRefQuery,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
