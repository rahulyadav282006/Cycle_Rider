import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { AdminShell, AdminPrototypeState } from './AdminShell';
import { AdminDashboardPage } from './AdminDashboardPage';
import { OrganizersPage } from './OrganizersPage';
import { AddOrganizerPage } from './AddOrganizerPage';
import { OrganizerDetailsPage } from './OrganizerDetailsPage';
import { AdminEventsPage } from './AdminEventsPage';
import { SystemSettingsPage } from './SystemSettingsPage';
import { PlatformReportsPage } from './PlatformReportsPage';
import { PlatformReportDetail } from './PlatformReportDetail';
import { AdminEmptyState } from './AdminEmptyState';

export interface AdminModuleProps {
  onExitAdmin?: () => void;
  onLogout?: () => void;
  onNavigateToEventDetails?: (eventId: string) => void;
}

export const AdminModule: React.FC<AdminModuleProps> = ({
  onExitAdmin,
  onLogout,
  onNavigateToEventDetails,
}) => {
  // Determine initial state from URL pathname
  const getInitialState = (): AdminPrototypeState => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/organizers/new')) return 'add_organizer';
    if (path.includes('/organizers/org-') || path.match(/\/organizers\/[a-z0-9-]+/)) return 'organizer_details';
    if (path.includes('/organizers')) return 'organizers';
    if (path.includes('/events')) return 'all_events';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/reports/platform-summary')) return 'report_detail';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/empty')) return 'empty_states';
    return 'dashboard';
  };

  const [activeState, setActiveState] = useState<AdminPrototypeState>(getInitialState);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string>('ORG-001');
  const [emptyStateType, setEmptyStateType] = useState<'organizer' | 'event' | 'report' | 'search'>('organizer');

  // Sync state with browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/organizers/new')) {
        setActiveState('add_organizer');
      } else if (path.includes('/organizers/org-') || path.match(/\/organizers\/[a-z0-9-]+/)) {
        setActiveState('organizer_details');
        const match = window.location.pathname.match(/\/organizers\/([A-Za-z0-9-]+)/i);
        if (match && match[1]) setSelectedOrganizerId(match[1].toUpperCase());
      } else if (path.includes('/organizers')) {
        setActiveState('organizers');
      } else if (path.includes('/events')) {
        setActiveState('all_events');
      } else if (path.includes('/settings')) {
        setActiveState('settings');
      } else if (path.includes('/reports/platform-summary')) {
        setActiveState('report_detail');
      } else if (path.includes('/reports')) {
        setActiveState('reports');
      } else if (path.includes('/empty')) {
        setActiveState('empty_states');
      } else {
        setActiveState('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleStateChange = (state: AdminPrototypeState) => {
    setActiveState(state);
    let targetPath = '/admin/dashboard';
    if (state === 'organizers') targetPath = '/admin/organizers';
    else if (state === 'add_organizer') targetPath = '/admin/organizers/new';
    else if (state === 'organizer_details') targetPath = `/admin/organizers/${selectedOrganizerId}`;
    else if (state === 'all_events') targetPath = '/admin/events';
    else if (state === 'settings') targetPath = '/admin/settings';
    else if (state === 'reports') targetPath = '/admin/reports';
    else if (state === 'report_detail') targetPath = '/admin/reports/platform-summary';
    else if (state === 'empty_states') targetPath = '/admin/empty-states';

    window.history.pushState(null, '', targetPath);
  };

  // Map state to active shell nav item
  const getActiveNavId = (): 'dashboard' | 'organizers' | 'events' | 'reports' | 'settings' => {
    if (activeState === 'organizers' || activeState === 'add_organizer' || activeState === 'organizer_details') {
      return 'organizers';
    }
    if (activeState === 'all_events') return 'events';
    if (activeState === 'settings') return 'settings';
    if (activeState === 'reports' || activeState === 'report_detail') return 'reports';
    return 'dashboard';
  };

  const handleNavClick = (id: 'dashboard' | 'organizers' | 'events' | 'reports' | 'settings') => {
    if (id === 'dashboard') handleStateChange('dashboard');
    else if (id === 'organizers') handleStateChange('organizers');
    else if (id === 'events') handleStateChange('all_events');
    else if (id === 'reports') handleStateChange('reports');
    else if (id === 'settings') handleStateChange('settings');
  };

  return (
    <AdminShell
      activeNavId={getActiveNavId()}
      onNavigate={handleNavClick}
      activePrototypeState={activeState}
      onPrototypeStateChange={handleStateChange}
      onExitAdmin={onExitAdmin}
      onLogout={onLogout}
    >
      {/* 1. Dashboard State */}
      {activeState === 'dashboard' && (
        <AdminDashboardPage
          onNavigateToOrganizers={() => handleStateChange('organizers')}
          onNavigateToAddOrganizer={() => handleStateChange('add_organizer')}
          onNavigateToEvents={() => handleStateChange('all_events')}
          onNavigateToSettings={() => handleStateChange('settings')}
          onNavigateToReports={() => handleStateChange('reports')}
        />
      )}

      {/* 2. Organizers State */}
      {activeState === 'organizers' && (
        <OrganizersPage
          onNavigateToAddOrganizer={() => handleStateChange('add_organizer')}
          onViewOrganizer={(id) => {
            setSelectedOrganizerId(id);
            handleStateChange('organizer_details');
          }}
        />
      )}

      {/* 3. Add Organizer State */}
      {activeState === 'add_organizer' && (
        <AddOrganizerPage
          onCancel={() => handleStateChange('organizers')}
          onSuccessReturn={() => handleStateChange('organizers')}
        />
      )}

      {/* 4. Organizer Details State */}
      {activeState === 'organizer_details' && (
        <OrganizerDetailsPage
          organizerId={selectedOrganizerId}
          onBack={() => handleStateChange('organizers')}
          onViewEvent={(eventId) => {
            if (onNavigateToEventDetails) {
              onNavigateToEventDetails(eventId);
            } else {
              handleStateChange('all_events');
            }
          }}
        />
      )}

      {/* 5. All Events State */}
      {activeState === 'all_events' && (
        <AdminEventsPage
          onViewEvent={(eventId) => {
            if (onNavigateToEventDetails) {
              onNavigateToEventDetails(eventId);
            }
          }}
        />
      )}

      {/* 6. System Settings State */}
      {activeState === 'settings' && <SystemSettingsPage />}

      {/* 7. Platform Reports State */}
      {activeState === 'reports' && (
        <PlatformReportsPage
          onViewReport={() => handleStateChange('report_detail')}
          onDownloadReport={() => {}}
        />
      )}

      {/* 8. Platform Report Detail State */}
      {activeState === 'report_detail' && (
        <PlatformReportDetail onBack={() => handleStateChange('reports')} />
      )}

      {/* 9. Empty States Preview (Screen 7) */}
      {activeState === 'empty_states' && (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 900, mx: 'auto' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={emptyStateType}
              onChange={(_, val) => setEmptyStateType(val)}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="organizer" label="1. No Organizers" />
              <Tab value="event" label="2. No Events" />
              <Tab value="report" label="3. No Platform Report Data" />
              <Tab value="search" label="4. No Search Results" />
            </Tabs>
          </Box>

          <AdminEmptyState
            type={emptyStateType}
            onAction={() => {
              if (emptyStateType === 'organizer') handleStateChange('add_organizer');
              else if (emptyStateType === 'event') handleStateChange('all_events');
              else if (emptyStateType === 'report') handleStateChange('reports');
            }}
            onClearFilters={() => handleStateChange('all_events')}
          />
        </Box>
      )}
    </AdminShell>
  );
};
