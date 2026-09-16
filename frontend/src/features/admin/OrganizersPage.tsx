import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { colors } from '../../theme/colors';
import { AdminDashboardStats } from './AdminDashboardStats';
import { OrganizerFilters } from './OrganizerFilters';
import { OrganizerTable } from './OrganizerTable';
import { AdminEmptyState } from './AdminEmptyState';
import { MockOrganizer, PlatformStatItem } from './mockAdminData';
import { adminService } from '../../api/services';

export interface OrganizersPageProps {
  onNavigateToAddOrganizer: () => void;
  onViewOrganizer: (organizerId: string) => void;
}

export const OrganizersPage: React.FC<OrganizersPageProps> = ({
  onNavigateToAddOrganizer,
  onViewOrganizer,
}) => {
  const [organizersList, setOrganizersList] = useState<MockOrganizer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    adminService
      .getOrganizers()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          const mapped: MockOrganizer[] = data.map((org: any) => ({
            id: org.id,
            name: org.name,
            email: org.email,
            mobile: org.mobile || '',
            organization: org.organization || 'Independent Organizer',
            eventsCount: org.eventsCount || 0,
            activeEventsCount: org.activeEventsCount || 0,
            completedEventsCount: org.completedEventsCount || 0,
            totalRiders: org.totalRiders || 0,
            status: (org.status === 'Active' ? 'Active' : org.status === 'Inactive' ? 'Inactive' : 'Pending') as any,
            joinedDate: org.joinedDate || new Date().toLocaleDateString(),
            recentEvents: org.recentEvents || [],
          }));
          setOrganizersList(mapped);
        } else {
          setOrganizersList([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load organizers:', err);
        if (isMounted) setOrganizersList([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const dynamicStats: PlatformStatItem[] = useMemo(() => {
    const total = organizersList.length;
    const active = organizersList.filter((o) => o.status === 'Active').length;
    const totalEvents = organizersList.reduce((acc, o) => acc + (o.eventsCount || 0), 0);
    const totalRiders = organizersList.reduce((acc, o) => acc + (o.totalRiders || 0), 0);

    return [
      {
        id: 'stat-total-orgs',
        label: 'Total Organizers',
        value: total,
        subtext: 'Registered organizers',
      },
      {
        id: 'stat-active-orgs',
        label: 'Active Organizers',
        value: active,
        subtext: 'Currently hosting events',
      },
      {
        id: 'stat-events-hosted',
        label: 'Events Hosted',
        value: totalEvents,
        subtext: 'Across all organizers',
      },
      {
        id: 'stat-total-riders',
        label: 'Total Riders Served',
        value: totalRiders,
        subtext: 'Registered cyclists',
      },
    ];
  }, [organizersList]);

  const filteredOrganizers = useMemo(() => {
    return organizersList.filter((org) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.organization && org.organization.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'All' || org.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, organizersList]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
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
            Organizers
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
              color: colors.brand.accentHover,
              border: `1px solid #BAE6FD`,
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 13 }} />
            Super Admin
          </Box>
        </Box>
        <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary }}>
          Manage RideTrack organizer accounts and access.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <AdminDashboardStats stats={dynamicStats} />

      {/* Filters & Actions */}
      <OrganizerFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddOrganizer={onNavigateToAddOrganizer}
      />

      {/* Organizer Table or Empty State */}
      {filteredOrganizers.length > 0 ? (
        <OrganizerTable
          organizers={filteredOrganizers}
          onViewOrganizer={onViewOrganizer}
        />
      ) : (
        <AdminEmptyState
          type="organizer"
          onAction={onNavigateToAddOrganizer}
        />
      )}
    </Box>
  );
};
