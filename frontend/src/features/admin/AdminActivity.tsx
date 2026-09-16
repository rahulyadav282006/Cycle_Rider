import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import { colors } from '../../theme/colors';
import { PlatformActivityItem, AdminEventOverviewItem } from './mockAdminData';
import { RideBadge } from '../../components/ui/RideBadge';

export interface AdminActivityProps {
  activity: PlatformActivityItem[];
  overview: {
    upcomingCount: number;
    activeCount: number;
    completedCount: number;
    events: AdminEventOverviewItem[];
  };
  onNavigateToEvents?: (tab?: 'all' | 'upcoming' | 'active' | 'completed') => void;
  onNavigateToOrganizers?: () => void;
}

export const AdminActivity: React.FC<AdminActivityProps> = ({
  activity,
  overview,
  onNavigateToEvents,
  onNavigateToOrganizers,
}) => {
  const getActivityIcon = (type: PlatformActivityItem['type']) => {
    switch (type) {
      case 'organizer_registered':
        return <PersonAddAlt1OutlinedIcon sx={{ fontSize: 18, color: colors.primary.main }} />;
      case 'event_created':
        return <EventAvailableOutlinedIcon sx={{ fontSize: 18, color: '#10B981' }} />;
      case 'event_completed':
        return <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 18, color: '#3B82F6' }} />;
      case 'account_updated':
        return <ManageAccountsOutlinedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />;
      default:
        return <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted }} />;
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 3,
        mb: 4,
      }}
    >
      {/* 1. Platform Activity Feed */}
      <Card
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '10px',
          boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: colors.text.primary,
                  lineHeight: 1.2,
                }}
              >
                Platform Activity
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mt: 0.25 }}>
                Real-time audit log across all organizer accounts and rides
              </Typography>
            </Box>

            {onNavigateToOrganizers && (
              <Box
                component="button"
                onClick={onNavigateToOrganizers}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: colors.primary.main,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  p: 0.5,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                View Accounts
                <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activity.length === 0 ? (
              <Typography sx={{ py: 3, textAlign: 'center', color: colors.text.secondary, fontSize: '0.875rem' }}>
                No recent platform activity.
              </Typography>
            ) : (
              activity.map((item, idx) => (
                <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  pb: idx !== activity.length - 1 ? 2 : 0,
                  borderBottom: idx !== activity.length - 1 ? `1px solid ${colors.surface.border}` : 'none',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    backgroundColor: colors.surface.subtle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: `1px solid ${colors.surface.border}`,
                  }}
                >
                  {getActivityIcon(item.type)}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.35 }}>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.75rem',
                        color: colors.text.muted,
                        flexShrink: 0,
                      }}
                    >
                      <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} />
                      {item.timestamp}
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      color: colors.text.secondary,
                      lineHeight: 1.4,
                      mb: 0.75,
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      size="small"
                      label={item.actor}
                      sx={{
                        height: 20,
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        backgroundColor: colors.surface.subtle,
                        color: colors.text.secondary,
                        border: `1px solid ${colors.surface.border}`,
                      }}
                    />
                    <RideBadge status={item.status} label={item.badgeLabel} size="sm" />
                  </Box>
                </Box>
              </Box>
            ))
          )}
          </Box>
        </CardContent>
      </Card>

      {/* 2. Event Overview Section (High Level) */}
      <Card
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '10px',
          boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: colors.text.primary,
                  lineHeight: 1.2,
                }}
              >
                Event Overview
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mt: 0.25 }}>
                High-level status distribution across RideTrack events
              </Typography>
            </Box>

            {onNavigateToEvents && (
              <Box
                component="button"
                onClick={() => onNavigateToEvents('all')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: colors.primary.main,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  p: 0.5,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                View All Events
                <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
              </Box>
            )}
          </Box>

          {/* High-level Status Metric Badges */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: '8px',
                backgroundColor: '#F0F9FF',
                border: '1px solid #BAE6FD',
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                <FlagOutlinedIcon sx={{ fontSize: 16, color: '#0284C7' }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#0369A1' }}>Upcoming</Typography>
              </Box>
              <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0369A1' }}>
                {overview.upcomingCount}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: '8px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                <SensorsOutlinedIcon sx={{ fontSize: 16, color: '#059669' }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#065F46' }}>Active</Typography>
              </Box>
              <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#065F46' }}>
                {overview.activeCount}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16, color: '#2563EB' }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E40AF' }}>Completed</Typography>
              </Box>
              <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E40AF' }}>
                {overview.completedCount}
              </Typography>
            </Box>
          </Box>

          {/* High-level Events List */}
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: colors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              mb: 1.5,
            }}
          >
            Featured Active & Recent Events
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {overview.events.length === 0 ? (
              <Typography sx={{ py: 3, textAlign: 'center', color: colors.text.secondary, fontSize: '0.875rem' }}>
                No events currently configured on the platform.
              </Typography>
            ) : (
              overview.events.map((ev) => (
              <Box
                key={ev.id}
                sx={{
                  p: 1.5,
                  borderRadius: '8px',
                  backgroundColor: colors.surface.page,
                  border: `1px solid ${colors.surface.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: colors.text.primary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {ev.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                    {ev.organizer} • {ev.location} • {ev.distance}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DirectionsBikeOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.secondary }}>
                      {ev.ridersCount}
                    </Typography>
                  </Box>
                  <RideBadge
                    status={ev.status === 'upcoming' ? 'upcoming' : ev.status === 'active' ? 'active' : 'completed'}
                    size="sm"
                  />
                </Box>
              </Box>
            ))
          )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
