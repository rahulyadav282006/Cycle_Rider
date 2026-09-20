import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileHeader } from './MobileHeader';
import { MobileDrawer } from './MobileDrawer';
import { BottomNav } from './BottomNav';
import { colors } from '../../theme/colors';

export interface AppShellProps {
  children: React.ReactNode;
  activeNavId?: string;
  onNavChange?: (id: string) => void;
  pageTitle?: string;
  breadcrumb?: string[];
  onLogout?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeNavId = 'dashboard',
  onNavChange,
  pageTitle = 'RideTrack Application Shell',
  breadcrumb = ['RideTrack', 'Visual Foundation'],
  onLogout,
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(activeNavId);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('ridetrack_sidebar_collapsed') === 'true';
  });

  const currentActiveId = onNavChange ? activeNavId : internalActiveId;

  const handleNavigate = (id: string) => {
    if (onNavChange) {
      onNavChange(id);
    } else {
      setInternalActiveId(id);
    }
  };

  const handleToggleSidebar = () => {
    setDesktopSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('ridetrack_sidebar_collapsed', String(next));
      return next;
    });
  };

  const currentSidebarWidth = desktopSidebarCollapsed ? 72 : 240;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.surface.page,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* 1. Mobile Header (Visible on < md) */}
      <MobileHeader onOpenMenu={() => setMobileDrawerOpen(true)} />

      {/* 2. Mobile Drawer */}
      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activeId={currentActiveId}
        onNavigate={handleNavigate}
      />

      {/* 3. Desktop Layout Body */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: '100vh' }}>
        {/* Desktop Fixed Sidebar (Hidden on < md) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: currentSidebarWidth,
            flexShrink: 0,
            transition: 'width 0.2s ease-in-out',
          }}
        >
          <Sidebar
            activeId={currentActiveId}
            onNavigate={handleNavigate}
            onLogout={onLogout}
            collapsed={desktopSidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
          />
        </Box>

        {/* Main Content Column */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            pb: { xs: '64px', md: 0 },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {/* Desktop Top Header (Hidden on < md) */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <TopHeader
              pageTitle={pageTitle}
              breadcrumb={breadcrumb}
              onToggleSidebar={handleToggleSidebar}
            />
          </Box>

          {/* Page Viewport Area */}
          <Box sx={{ flex: 1, width: '100%' }}>
            {children}
          </Box>
        </Box>
      </Box>

      {/* 4. Mobile Bottom Navigation (Visible on < md) */}
      <BottomNav activeId={currentActiveId} onNavigate={handleNavigate} />
    </Box>
  );
};
