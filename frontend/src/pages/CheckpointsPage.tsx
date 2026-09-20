import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from '@mui/material';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { colors } from '../theme/colors';
import { RideBadge } from '../components/ui/RideBadge';
import { eventService, checkpointService, volunteerService, CheckpointItem, EventItem } from '../api/services';

export interface CheckpointsPageProps {
  eventId?: string;
  onNavigateConfigureCheckpoints: (eventId: string) => void;
  onSelectEvent?: (eventId: string) => void;
}

export const CheckpointsPage: React.FC<CheckpointsPageProps> = ({
  eventId,
  onNavigateConfigureCheckpoints,
  onSelectEvent,
}) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(eventId || '');
  const [checkpoints, setCheckpoints] = useState<CheckpointItem[]>([]);
  const [volunteersCount, setVolunteersCount] = useState<number>(0);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingCheckpoints, setLoadingCheckpoints] = useState<boolean>(false);

  // Load all available events
  useEffect(() => {
    let isMounted = true;
    setLoadingEvents(true);

    eventService
      .listEvents()
      .then((data) => {
        if (!isMounted) return;
        setEvents(data || []);
        if (data && data.length > 0) {
          // If eventId was passed and is in list, keep it; otherwise default to first event
          if (eventId && data.some((e) => e.id === eventId)) {
            setSelectedEventId(eventId);
          } else {
            setSelectedEventId(data[0].id);
            onSelectEvent?.(data[0].id);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load events in CheckpointsPage:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingEvents(false);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  // Load checkpoints for the currently selected event
  useEffect(() => {
    if (!selectedEventId) {
      setCheckpoints([]);
      return;
    }

    let isMounted = true;
    setLoadingCheckpoints(true);

    Promise.all([
      checkpointService.listCheckpoints(selectedEventId).catch(() => []),
      volunteerService.listVolunteers(selectedEventId).catch(() => []),
    ])
      .then(([cps, vols]) => {
        if (!isMounted) return;
        setCheckpoints(Array.isArray(cps) ? cps : []);
        const assigned = Array.isArray(vols)
          ? vols.filter((v) => Boolean(v.checkpointId || v.checkpointName)).length
          : 0;
        setVolunteersCount(assigned);
      })
      .catch((err) => {
        console.error('Failed to load checkpoints for event:', err);
        if (isMounted) setCheckpoints([]);
      })
      .finally(() => {
        if (isMounted) setLoadingCheckpoints(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedEventId]);

  const handleEventChange = (newId: string) => {
    setSelectedEventId(newId);
    onSelectEvent?.(newId);
  };

  const currentEvent = events.find((e) => e.id === selectedEventId);

  const totalCount = checkpoints.length;
  const mandatoryCount = checkpoints.filter((c) => c.mandatory).length;
  const optionalCount = checkpoints.filter((c) => !c.mandatory).length;

  return (
    <PageContainer maxWidth="lg">
      {/* 1. Page Hero Banner */}
      <PageHeroBanner
        title="Checkpoints"
        subtitle="View and manage route checkpoints across your events."
        actionButton={
          selectedEventId ? (
            <Box
              component="button"
              type="button"
              onClick={() => onNavigateConfigureCheckpoints(selectedEventId)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2.5,
                py: 1.25,
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#135F63',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: '#0E484B',
                },
              }}
            >
              <TuneOutlinedIcon sx={{ fontSize: 18 }} />
              Configure Checkpoints
            </Box>
          ) : undefined
        }
      />

      {/* 2. Event Selector Strip */}
      <Box
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '12px',
          p: { xs: 2, sm: 2.5 },
          mb: 3,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left: Event Dropdown */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 260 }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            Select Event:
          </Typography>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 280, md: 340 } }}>
            <Select
              value={selectedEventId}
              onChange={(e) => handleEventChange(e.target.value)}
              displayEmpty
              disabled={loadingEvents || events.length === 0}
              sx={{
                borderRadius: '8px',
                backgroundColor: colors.surface.page,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: colors.text.primary,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.surface.border,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.brand.primary,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.brand.accent,
                },
              }}
            >
              {events.length === 0 ? (
                <MenuItem value="" disabled>
                  {loadingEvents ? 'Loading events...' : 'No events available'}
                </MenuItem>
              ) : (
                events.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id}>
                    {ev.eventName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>

        {/* Right: Selected Event Info Badges */}
        {currentEvent && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              flexWrap: 'wrap',
              fontSize: '0.8125rem',
              color: colors.text.secondary,
            }}
          >
            <RideBadge
              status={
                currentEvent.status === 'active'
                  ? 'active'
                  : currentEvent.status === 'completed'
                  ? 'completed'
                  : 'upcoming'
              }
              label={currentEvent.status?.toUpperCase() || 'UPCOMING'}
              size="sm"
            />

            {currentEvent.rideDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 15, color: colors.text.muted }} />
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                  {currentEvent.rideDate}
                </Typography>
              </Box>
            )}

            {currentEvent.rideDistance > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <DirectionsBikeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                  {currentEvent.rideDistance} km
                </Typography>
              </Box>
            )}

            {currentEvent.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PlaceOutlinedIcon sx={{ fontSize: 15, color: colors.text.muted }} />
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                  {currentEvent.location}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* 3. Metric Summary Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: { xs: 1.5, sm: 2 },
          mb: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            p: { xs: 2, sm: 2.5 },
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: colors.text.muted,
              letterSpacing: '0.04em',
              mb: 0.5,
            }}
          >
            TOTAL CHECKPOINTS
          </Typography>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: colors.text.primary, lineHeight: 1.1 }}>
            {totalCount}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, mt: 0.5 }}>
            {totalCount > 0 ? 'Configured route markers' : 'None configured'}
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            p: { xs: 2, sm: 2.5 },
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: colors.text.muted,
              letterSpacing: '0.04em',
              mb: 0.5,
            }}
          >
            MANDATORY
          </Typography>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: colors.text.primary, lineHeight: 1.1 }}>
            {mandatoryCount}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, mt: 0.5 }}>
            Required for finisher status
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            p: { xs: 2, sm: 2.5 },
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: colors.text.muted,
              letterSpacing: '0.04em',
              mb: 0.5,
            }}
          >
            OPTIONAL
          </Typography>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: colors.text.secondary, lineHeight: 1.1 }}>
            {optionalCount}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, mt: 0.5 }}>
            Support / water points
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            p: { xs: 2, sm: 2.5 },
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: colors.text.muted,
              letterSpacing: '0.04em',
              mb: 0.5,
            }}
          >
            VOLUNTEERS ASSIGNED
          </Typography>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: colors.brand.primary, lineHeight: 1.1 }}>
            {volunteersCount}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, mt: 0.5 }}>
            {volunteersCount > 0 ? 'Active on checkpoints' : 'Unassigned'}
          </Typography>
        </Box>
      </Box>

      {/* 4. Checkpoints Content Area */}
      {loadingCheckpoints ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} sx={{ color: colors.brand.primary }} />
        </Box>
      ) : events.length === 0 ? (
        <Box
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '14px',
            p: { xs: 5, sm: 8 },
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <PlaceOutlinedIcon sx={{ fontSize: 44, color: colors.text.muted, mb: 1.5 }} />
          <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 800, color: colors.text.primary, mb: 1 }}>
            No Events Found
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary, maxWidth: 380 }}>
            Create an event first to define and view its route checkpoints.
          </Typography>
        </Box>
      ) : checkpoints.length === 0 ? (
        /* Empty State for Selected Event */
        <Box
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '14px',
            p: { xs: 5, sm: 7 },
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              backgroundColor: '#E8F5E9',
              color: '#135F63',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <PlaceOutlinedIcon sx={{ fontSize: 30 }} />
          </Box>

          <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 800, color: colors.text.primary, mb: 1 }}>
            No checkpoints configured
          </Typography>

          <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary, maxWidth: 460, mb: 3, lineHeight: 1.5 }}>
            {currentEvent ? `"${currentEvent.eventName}"` : 'This event'} does not have any checkpoints configured yet.
            Open the event configuration to define checkpoints.
          </Typography>

          {/* Navigates to Event Checkpoint Configuration (NOT an independent creator) */}
          <Box
            component="button"
            type="button"
            onClick={() => onNavigateConfigureCheckpoints(selectedEventId)}
            sx={{
              minHeight: 42,
              px: 3,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#135F63',
              color: '#FFFFFF',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: '#0E484B',
              },
            }}
          >
            <TuneOutlinedIcon sx={{ fontSize: 17 }} />
            Configure Checkpoints
          </Box>
        </Box>
      ) : (
        /* Populated Checkpoints List */
        <Box
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '12px',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 2,
              mb: 2.5,
              borderBottom: `1px solid ${colors.surface.border}`,
            }}
          >
            <Box>
              <Typography variant="h2" sx={{ fontSize: '1.125rem', fontWeight: 800, color: colors.text.primary }}>
                Event Route Checkpoints
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mt: 0.25 }}>
                Sequence of checkpoints riders will pass during the event.
              </Typography>
            </Box>

            <Box
              component="button"
              type="button"
              onClick={() => onNavigateConfigureCheckpoints(selectedEventId)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '6px',
                border: `1px solid ${colors.surface.borderStrong}`,
                backgroundColor: colors.surface.page,
                color: colors.text.primary,
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: '#135F63',
                  color: '#135F63',
                },
              }}
            >
              <TuneOutlinedIcon sx={{ fontSize: 16 }} />
              Configure in Event
            </Box>
          </Box>

          {/* Checkpoint Item Rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {checkpoints.map((cp, idx) => {
              const seq = cp.sequenceNumber || idx + 1;
              const isMandatory = cp.mandatory;

              return (
                <Box
                  key={cp.id || idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: '8px',
                    border: `1px solid ${colors.surface.border}`,
                    backgroundColor: colors.surface.page,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: colors.surface.borderStrong,
                      boxShadow: '0 2px 4px rgba(15, 23, 42, 0.04)',
                    },
                  }}
                >
                  {/* Left: Sequence & Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#E8F5E9',
                        color: '#135F63',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        flexShrink: 0,
                      }}
                    >
                      #{seq}
                    </Box>

                    <Box>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: colors.text.primary }}>
                        {cp.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        {/* Type badge */}
                        <Box
                          sx={{
                            px: 1,
                            py: 0.2,
                            borderRadius: '4px',
                            backgroundColor:
                              cp.type === 'Start'
                                ? '#E0F2FE'
                                : cp.type === 'Finish'
                                ? '#FEF3C7'
                                : cp.type === 'Hydration' || cp.type === 'Refreshment'
                                ? '#EDE9FE'
                                : '#F1F5F9',
                            color:
                              cp.type === 'Start'
                                ? '#0369A1'
                                : cp.type === 'Finish'
                                ? '#B45309'
                                : cp.type === 'Hydration' || cp.type === 'Refreshment'
                                ? '#6D28D9'
                                : '#475569',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {cp.type || 'Checkpoint'}
                        </Box>

                        {/* Mandatory / Optional Badge */}
                        <Box
                          sx={{
                            px: 1,
                            py: 0.2,
                            borderRadius: '4px',
                            backgroundColor: isMandatory ? '#ECFDF5' : '#F8FAFC',
                            color: isMandatory ? '#047857' : '#64748B',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            border: `1px solid ${isMandatory ? '#A7F3D0' : '#E2E8F0'}`,
                          }}
                        >
                          {isMandatory ? 'Mandatory' : 'Optional'}
                        </Box>

                        {/* Coordinates if present */}
                        {typeof cp.latitude === 'number' && typeof cp.longitude === 'number' && (
                          <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
                            {cp.latitude.toFixed(4)}, {cp.longitude.toFixed(4)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Right: Volunteer Info & Quick Configure Link */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => onNavigateConfigureCheckpoints(selectedEventId)}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        background: 'none',
                        border: 'none',
                        color: colors.brand.primary,
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        p: 0.5,
                        borderRadius: '4px',
                        '&:hover': {
                          color: '#0E484B',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Configure
                      <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Bottom Callout: Explaining the Event-Centric Workflow */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: `1px solid ${colors.surface.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              Checkpoints are owned by their respective events. To add, reorder, edit, or delete checkpoints, use the event configuration.
            </Typography>

            <Box
              component="button"
              type="button"
              onClick={() => onNavigateConfigureCheckpoints(selectedEventId)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 0.75,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#135F63',
                color: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: '#0E484B',
                },
              }}
            >
              Open Event Configuration
              <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </Box>
          </Box>
        </Box>
      )}
    </PageContainer>
  );
};
