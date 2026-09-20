import React from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';
import { PageHeroBanner } from '../../components/common/PageHeroBanner';

export type ReportsPrototypeState =
  | 'dashboard'
  | 'rider_list'
  | 'checkpoint_summary'
  | 'finishers'
  | 'dnf'
  | 'home_safe'
  | 'event_summary'
  | 'empty_state'
  | 'export_dialog';

export interface ReportsHeaderProps {
  activeState?: ReportsPrototypeState;
  onStateChange?: (state: ReportsPrototypeState) => void;
  selectedEvent: string;
  events?: { id: string; name: string; status?: string }[];
  onEventChange: (event: string) => void;
  onOpenExportDialog: () => void;
  currentBreadcrumbSub?: string;
  onBackToDashboard?: () => void;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  activeState = 'dashboard',
  onStateChange,
  selectedEvent,
  events = [],
  onEventChange,
  onOpenExportDialog,
  currentBreadcrumbSub,
  onBackToDashboard,
}) => {
  const prototypeStates: { key: ReportsPrototypeState; label: string }[] = [
    { key: 'dashboard', label: '1. Reports Dashboard' },
    { key: 'rider_list', label: '2. Rider List' },
    { key: 'checkpoint_summary', label: '3. Checkpoint Summary' },
    { key: 'finishers', label: '4. Finishers' },
    { key: 'dnf', label: '5. DNF' },
    { key: 'home_safe', label: '6. Home Safe' },
    { key: 'event_summary', label: '7. Event Summary' },
    { key: 'empty_state', label: '8. Empty State' },
    { key: 'export_dialog', label: '9. Export Dialog' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Prototype State Switcher Bar */}
      {onStateChange && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2.5,
            p: 1.25,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.surface.borderStrong}`,
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
            <LayersOutlinedIcon sx={{ fontSize: 18, color: colors.primary.main }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Reports Prototype States:
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            {prototypeStates.map((st) => (
              <Box
                key={st.key}
                component="button"
                onClick={() => onStateChange(st.key)}
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: '5px',
                  fontSize: '0.75rem',
                  fontWeight: activeState === st.key ? 700 : 500,
                  border: '1px solid',
                  borderColor:
                    activeState === st.key ? colors.primary.main : colors.surface.borderStrong,
                  backgroundColor:
                    activeState === st.key ? colors.brand.accentLight : '#FFFFFF',
                  color: activeState === st.key ? colors.primary.dark : colors.text.secondary,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: colors.primary.main,
                    color: colors.primary.main,
                  },
                }}
              >
                {st.label}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Breadcrumb Navigation */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.5,
          fontSize: '0.8125rem',
          color: colors.text.secondary,
        }}
      >
        <Typography
          component="span"
          sx={{
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            '&:hover': { color: colors.primary.main },
          }}
          onClick={onBackToDashboard}
        >
          RideTrack
        </Typography>
        <Typography component="span" sx={{ color: colors.text.muted }}>
          &gt;
        </Typography>
        <Typography
          component="span"
          sx={{
            cursor: currentBreadcrumbSub ? 'pointer' : 'default',
            fontSize: '0.8125rem',
            color: currentBreadcrumbSub ? colors.text.secondary : colors.text.primary,
            fontWeight: currentBreadcrumbSub ? 500 : 600,
            '&:hover': currentBreadcrumbSub ? { color: colors.primary.main } : {},
          }}
          onClick={currentBreadcrumbSub ? onBackToDashboard : undefined}
        >
          Reports
        </Typography>

        {currentBreadcrumbSub && (
          <>
            <Typography component="span" sx={{ color: colors.text.muted }}>
              &gt;
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: '0.8125rem',
                color: colors.text.primary,
                fontWeight: 700,
              }}
            >
              {currentBreadcrumbSub}
            </Typography>
          </>
        )}
      </Box>

      {/* Main Header Title & Top-Right Actions */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
      {/* 1. Panoramic Scenic Hero Banner */}
      <PageHeroBanner
        title="Reports"
        subtitle="Generate and download event reports."
      />

        {/* Top-Right Header Actions: Event Selector & Export Report Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {/* Event Selector */}
          <Box sx={{ minWidth: 230 }}>
            <Select
              fullWidth
              size="small"
              value={selectedEvent}
              onChange={(e) => onEventChange(e.target.value)}
              sx={{
                height: 40,
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                '& fieldset': { borderColor: colors.surface.borderStrong },
                '&:hover fieldset': { borderColor: colors.text.secondary },
              }}
            >
              {events.length === 0 ? (
                <MenuItem value="" disabled>
                  No events found
                </MenuItem>
              ) : (
                events.map((ev) => (
                  <MenuItem key={ev.id} value={ev.name}>
                    {ev.name} {ev.status ? `(${ev.status})` : ''}
                  </MenuItem>
                ))
              )}
            </Select>
          </Box>

          {/* Export Report Button */}
          <RideButton
            variant="primary"
            onClick={onOpenExportDialog}
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{ minHeight: 40, whiteSpace: 'nowrap' }}
          >
            Export Report
          </RideButton>
        </Box>
      </Box>
    </Box>
  );
};
