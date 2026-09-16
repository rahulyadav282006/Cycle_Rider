import React from 'react';
import { Box, Typography } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';

export type AdminEmptyStateType = 'organizer' | 'event' | 'report' | 'search';

export interface AdminEmptyStateProps {
  type: AdminEmptyStateType;
  onAction?: () => void;
  onClearFilters?: () => void;
  actionLabel?: string;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  type,
  onAction,
  onClearFilters,
  actionLabel,
}) => {
  const getConfig = () => {
    switch (type) {
      case 'organizer':
        return {
          icon: <PeopleAltOutlinedIcon sx={{ fontSize: 28 }} />,
          heading: 'No Organizers Found',
          description: 'There are no organizer accounts matching your current criteria.',
          defaultAction: '+ Add Organizer',
        };
      case 'event':
        return {
          icon: <EventBusyOutlinedIcon sx={{ fontSize: 28 }} />,
          heading: 'No Events Found',
          description: 'There are no cycling events registered on the platform.',
          defaultAction: 'Refresh Events',
        };
      case 'report':
        return {
          icon: <AssessmentOutlinedIcon sx={{ fontSize: 28 }} />,
          heading: 'No Platform Report Data',
          description: 'There is no reporting telemetry or audit data generated for the selected period.',
          defaultAction: 'Generate Report',
        };
      case 'search':
      default:
        return {
          icon: <SearchOffOutlinedIcon sx={{ fontSize: 28 }} />,
          heading: 'No Matching Results',
          description: 'No platform records match your search criteria. Try modifying your keywords or clearing filters.',
          defaultAction: 'Clear Filters',
        };
    }
  };

  const config = getConfig();

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '10px',
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        maxWidth: 600,
        mx: 'auto',
        my: 4,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: colors.surface.subtle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2.5,
          color: colors.text.muted,
          border: `1px solid ${colors.surface.border}`,
        }}
      >
        {config.icon}
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: colors.text.primary,
          mb: 1,
        }}
      >
        {config.heading}
      </Typography>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          mb: 3,
          maxWidth: 440,
          mx: 'auto',
          lineHeight: 1.5,
        }}
      >
        {config.description}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {onClearFilters && (
          <RideButton variant="secondary" size="sm" onClick={onClearFilters}>
            Clear Filters
          </RideButton>
        )}

        {onAction && (
          <RideButton variant="primary" size="sm" onClick={onAction}>
            {type === 'organizer' ? (
              <PersonAddAlt1OutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
            ) : (
              <RefreshOutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
            )}
            {actionLabel || config.defaultAction}
          </RideButton>
        )}
      </Box>
    </Box>
  );
};
