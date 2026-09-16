import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';
import { AdminDashboardStats } from './AdminDashboardStats';
import { AdminActivity } from './AdminActivity';
import { PlatformStatItem, AdminEventOverviewItem } from './mockAdminData';
import { adminService } from '../../api/services';

export interface AdminDashboardPageProps {
  onNavigateToOrganizers: () => void;
  onNavigateToAddOrganizer: () => void;
  onNavigateToEvents: (tab?: 'all' | 'upcoming' | 'active' | 'completed') => void;
  onNavigateToSettings: () => void;
  onNavigateToReports: () => void;
}

const INITIAL_STATS: PlatformStatItem[] = [
  {
    id: 'stat-organizers',
    label: 'Total Organizers',
    value: 0,
    subtext: '0 active on platform',
  },
  {
    id: 'stat-events',
    label: 'Total Events',
    value: 0,
    subtext: '0 active endurance rides',
  },
  {
    id: 'stat-riders',
    label: 'Registered Riders',
    value: 0,
    subtext: 'Riders across all events',
  },
  {
    id: 'stat-checkpoints',
    label: 'Checkpoints Configured',
    value: 0,
    subtext: 'Timing controls & hydration',
  },
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateToOrganizers,
  onNavigateToAddOrganizer,
  onNavigateToEvents,
  onNavigateToSettings,
  onNavigateToReports,
}) => {
  const [stats, setStats] = useState<PlatformStatItem[]>(INITIAL_STATS);
  const [eventOverview, setEventOverview] = useState<{
    upcomingCount: number;
    activeCount: number;
    completedCount: number;
    events: AdminEventOverviewItem[];
  }>({
    upcomingCount: 0,
    activeCount: 0,
    completedCount: 0,
    events: [],
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      adminService.getStats().catch(() => null),
      adminService.getAdminEvents().catch(() => []),
    ]).then(([data, events]) => {
      if (!isMounted) return;

      if (data) {
        setStats([
          {
            id: 'stat-organizers',
            label: 'Total Organizers',
            value: data.totalOrganizers,
            subtext: `${data.activeOrganizers} active on platform`,
          },
          {
            id: 'stat-events',
            label: 'Total Events',
            value: data.totalEvents,
            subtext: `${data.activeEvents} active endurance rides`,
          },
          {
            id: 'stat-riders',
            label: 'Registered Riders',
            value: data.totalRiders,
            subtext: 'Riders across all events',
          },
          {
            id: 'stat-checkpoints',
            label: 'Checkpoints Configured',
            value: data.totalCheckpoints,
            subtext: 'Timing controls & hydration',
          },
        ]);
      }

      if (Array.isArray(events)) {
        const upcoming = events.filter((e: any) => e.status === 'upcoming' || e.status === 'draft').length;
        const active = events.filter((e: any) => e.status === 'active').length;
        const completed = events.filter((e: any) => e.status === 'completed').length;

        const mappedEvents: AdminEventOverviewItem[] = events.slice(0, 5).map((e: any) => ({
          id: e.id,
          name: e.eventName,
          organizer: e.organizerName || 'Organizer Admin',
          location: e.location,
          distance: `${e.rideDistance} km`,
          status: e.status === 'active' ? 'active' : e.status === 'completed' ? 'completed' : 'upcoming',
          ridersCount: e.riderCount || 0,
          date: e.rideDate,
        }));

        setEventOverview({
          upcomingCount: upcoming,
          activeCount: active,
          completedCount: completed,
          events: mappedEvents,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header Banner */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3.5,
          pb: 2.5,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.02em',
              }}
            >
              Platform Dashboard
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: '9999px',
                backgroundColor: colors.brand.accentLight,
                color: colors.primary.main,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <ShieldOutlinedIcon sx={{ fontSize: 13 }} />
              Super Admin
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary }}>
            Monitor RideTrack organizers, events and platform activity.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <RideButton
            variant="secondary"
            size="sm"
            onClick={onNavigateToSettings}
          >
            <SettingsOutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
            System Settings
          </RideButton>

          <RideButton
            variant="secondary"
            size="sm"
            onClick={onNavigateToReports}
          >
            <BarChartOutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
            Reports
          </RideButton>

          <RideButton
            variant="primary"
            size="sm"
            onClick={onNavigateToAddOrganizer}
          >
            <PersonAddAlt1OutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
            + Add Organizer
          </RideButton>
        </Box>
      </Box>

      {/* Main 4 Metric Cards */}
      <AdminDashboardStats stats={stats} />

      {/* Platform Activity & Event Overview */}
      <AdminActivity
        activity={[]}
        overview={eventOverview}
        onNavigateToEvents={onNavigateToEvents}
        onNavigateToOrganizers={onNavigateToOrganizers}
      />
    </Box>
  );
};
