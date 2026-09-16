import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { colors } from '../../theme/colors';
import { AdminDashboardStats } from './AdminDashboardStats';
import { AdminEmptyState } from './AdminEmptyState';
import { RideBadge } from '../../components/ui/RideBadge';
import { RideButton } from '../../components/ui/RideButton';
import { adminService } from '../../api/services';
import { PlatformStatItem } from './mockAdminData';

export type AdminEventsPrototypeState = 'populated' | 'empty' | 'no_search_results';

export interface AdminEventsPageProps {
  onViewEvent: (eventId: string) => void;
  initialStatusFilter?: string;
  showPrototypeSwitcher?: boolean;
}

export interface AdminEventRow {
  id: string;
  name: string;
  organizer: string;
  organizerId: string;
  date: string;
  location: string;
  distance: string;
  ridersCount?: number;
  checkpointsCount?: number;
  status: string;
  createdAt?: string;
}

export const AdminEventsPage: React.FC<AdminEventsPageProps> = ({
  onViewEvent,
  initialStatusFilter = 'All',
  showPrototypeSwitcher = false,
}) => {
  const [events, setEvents] = useState<AdminEventRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [prototypeState, setPrototypeState] = useState<AdminEventsPrototypeState>('populated');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [organizerFilter, setOrganizerFilter] = useState<string>('All');

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAdminEvents();
        if (isMounted) {
          setEvents(data || []);
        }
      } catch (err: any) {
        console.error('Failed to load admin events:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSetPrototypeState = (st: AdminEventsPrototypeState) => {
    setPrototypeState(st);
    if (st === 'populated') {
      setSearchQuery('');
      setStatusFilter('All');
      setOrganizerFilter('All');
    } else if (st === 'empty') {
      setSearchQuery('');
      setStatusFilter('All');
      setOrganizerFilter('All');
    } else if (st === 'no_search_results') {
      setSearchQuery('NonExistentRideQueryXYZ');
      setStatusFilter('All');
      setOrganizerFilter('All');
    }
  };

  // Unique organizers list for dropdown
  const organizersList = useMemo(() => {
    const orgs = Array.from(new Set(events.map((e) => e.organizer).filter(Boolean)));
    return ['All', ...orgs];
  }, [events]);

  const stats: PlatformStatItem[] = useMemo(() => {
    const total = events.length;
    const published = events.filter((e) => {
      const s = (e.status || '').toLowerCase();
      return s === 'published' || s === 'upcoming';
    }).length;
    const live = events.filter((e) => {
      const s = (e.status || '').toLowerCase();
      return s === 'live' || s === 'active';
    }).length;
    const completed = events.filter((e) => {
      const s = (e.status || '').toLowerCase();
      return s === 'completed';
    }).length;

    return [
      { id: 'ev-tot', label: 'Total Events', value: total, subtext: 'Platform wide' },
      { id: 'ev-pub', label: 'Published', value: published, subtext: 'Open for registration' },
      { id: 'ev-live', label: 'Live Events', value: live, subtext: 'Currently active events' },
      { id: 'ev-cmp', label: 'Completed', value: completed, subtext: 'Completed events' },
    ];
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (prototypeState === 'empty') return [];

    return events.filter((ev) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        (ev.name && ev.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ev.location && ev.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'All' || (ev.status && ev.status.toLowerCase() === statusFilter.toLowerCase());

      const matchesOrganizer =
        organizerFilter === 'All' || ev.organizer === organizerFilter;

      return matchesSearch && matchesStatus && matchesOrganizer;
    });
  }, [events, prototypeState, searchQuery, statusFilter, organizerFilter]);

  // Event lifecycle status badges: Draft, Published, Live, Completed, Cancelled
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'draft':
        return <RideBadge status="draft" label="Draft" size="sm" />;
      case 'published':
      case 'upcoming':
        return <RideBadge status="published" label="Published" size="sm" />;
      case 'live':
      case 'active':
        return <RideBadge status="live" label="Live" size="sm" />;
      case 'completed':
        return <RideBadge status="completed" label="Completed" size="sm" />;
      case 'cancelled':
      case 'archived':
        return <RideBadge status="cancelled" label="Cancelled" size="sm" />;
      default:
        return <RideBadge status="draft" label={status || 'Draft'} size="sm" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} sx={{ color: colors.primary.main }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Prototype State Switcher (optional / hidden in production) */}
      {showPrototypeSwitcher && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 3,
            p: 1.25,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
            <LayersOutlinedIcon sx={{ fontSize: 16, color: colors.primary.main }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.secondary,
                textTransform: 'uppercase',
              }}
            >
              All Events States:
            </Typography>
          </Box>
          {(
            [
              { key: 'populated', label: '1. Populated' },
              { key: 'empty', label: '2. Empty State' },
              { key: 'no_search_results', label: '3. No Search Results' },
            ] as const
          ).map((st) => {
            const isSelected = prototypeState === st.key;
            return (
              <Box
                key={st.key}
                component="button"
                type="button"
                onClick={() => handleSetPrototypeState(st.key)}
                sx={{
                  px: 1.25,
                  py: 0.35,
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  border: '1px solid',
                  borderColor: isSelected ? colors.primary.main : colors.surface.borderStrong,
                  backgroundColor: isSelected ? colors.brand.accentLight : 'transparent',
                  color: isSelected ? colors.primary.dark : colors.text.secondary,
                  cursor: 'pointer',
                }}
              >
                {st.label}
              </Box>
            );
          })}
        </Box>
      )}

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
            All Events
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
          View all events across RideTrack.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <AdminDashboardStats stats={stats} />

      {/* Toolbar Filters: Search, Organizer, Status */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', flex: 1, gap: 1.5, flexWrap: 'wrap' }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search event name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: { xs: '100%', sm: 280, md: 340 },
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '0.875rem',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: colors.text.muted }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Organizer Filter */}
          <TextField
            select
            size="small"
            label="Organizer"
            value={organizerFilter}
            onChange={(e) => setOrganizerFilter(e.target.value)}
            sx={{
              minWidth: 170,
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '0.875rem',
              },
            }}
          >
            {organizersList.map((org) => (
              <MenuItem key={org} value={org}>
                {org === 'All' ? 'All Organizers' : org}
              </MenuItem>
            ))}
          </TextField>

          {/* Status Filter following RideTrack event lifecycle */}
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              minWidth: 160,
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '0.875rem',
              },
            }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Published">Published</MenuItem>
            <MenuItem value="Live">Live</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
        </Box>
      </Box>

      {/* Events Table or Empty State */}
      {events.length === 0 || prototypeState === 'empty' ? (
        <AdminEmptyState type="event" />
      ) : filteredEvents.length > 0 ? (
        <TableContainer
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
            overflowX: 'auto',
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.surface.subtle }}>
                <TableCell sx={{ py: 1.5, px: 2.5, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Event
                </TableCell>
                <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Organizer
                </TableCell>
                <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Date
                </TableCell>
                <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Location
                </TableCell>
                <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Distance
                </TableCell>
                <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ py: 1.5, px: 2.5, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((ev) => (
                <TableRow
                  key={ev.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(241, 245, 249, 0.6)',
                    },
                  }}
                >
                  <TableCell sx={{ py: 2, px: 2.5, fontWeight: 700, color: colors.text.primary, borderBottom: `1px solid ${colors.surface.border}` }}>
                    {ev.name}
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 2, fontSize: '0.875rem', color: colors.text.secondary, borderBottom: `1px solid ${colors.surface.border}` }}>
                    {ev.organizer}
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 2, fontSize: '0.875rem', color: colors.text.secondary, borderBottom: `1px solid ${colors.surface.border}` }}>
                    {ev.date}
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 2, fontSize: '0.875rem', color: colors.text.secondary, borderBottom: `1px solid ${colors.surface.border}` }}>
                    {ev.location}
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 2, fontSize: '0.875rem', color: colors.text.secondary, borderBottom: `1px solid ${colors.surface.border}` }}>
                    {ev.distance}
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 2, borderBottom: `1px solid ${colors.surface.border}` }}>
                    {getStatusBadge(ev.status)}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2, px: 2.5, borderBottom: `1px solid ${colors.surface.border}` }}>
                    <RideButton
                      variant="secondary"
                      size="sm"
                      onClick={() => onViewEvent(ev.id)}
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      View
                    </RideButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <AdminEmptyState
          type="search"
          onClearFilters={() => {
            setSearchQuery('');
            setStatusFilter('All');
            setOrganizerFilter('All');
            setPrototypeState('populated');
          }}
        />
      )}
    </Box>
  );
};
