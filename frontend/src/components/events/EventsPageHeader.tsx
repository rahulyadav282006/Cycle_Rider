import React from 'react';
import { Box, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface EventsPageHeaderProps {
  onCreateEvent: () => void;
  isEmptyState?: boolean;
  onToggleEmptyState?: () => void;
}

export const EventsPageHeader: React.FC<EventsPageHeaderProps> = ({
  onCreateEvent,
  isEmptyState = false,
  onToggleEmptyState,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      {/* Title & Supporting Description */}
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            fontWeight: 700,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          Events
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.4,
          }}
        >
          Create and manage your cycling events.
        </Typography>
      </Box>

      {/* Right Side Actions: Reviewer Switcher + [ + Create Event ] CTA */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          flexWrap: 'wrap',
        }}
      >
        {onToggleEmptyState && (
          <RideButton
            variant="secondary"
            size="sm"
            onClick={onToggleEmptyState}
            startIcon={isEmptyState ? <LayersOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
            sx={{
              minHeight: 40,
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap',
              borderColor: colors.surface.borderStrong,
            }}
          >
            {isEmptyState ? 'Active Events View' : 'Preview Empty State'}
          </RideButton>
        )}

        <RideButton
          variant="primary"
          size="md"
          startIcon={<AddCircleIcon />}
          onClick={onCreateEvent}
          sx={{
            minHeight: 44, // Minimum 44px touch target
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.12)',
          }}
        >
          + Create Event
        </RideButton>
      </Box>
    </Box>
  );
};
