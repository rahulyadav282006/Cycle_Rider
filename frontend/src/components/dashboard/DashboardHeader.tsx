import React from 'react';
import { Box, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface DashboardHeaderProps {
  isEmptyState?: boolean;
  onToggleState?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isEmptyState = false,
  onToggleState,
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
          Dashboard
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.4,
          }}
        >
          Monitor your cycling events, riders, and ride activity.
        </Typography>
      </Box>

      {/* State Switcher for Reviewer Convenience (if provided) */}
      {onToggleState && (
        <Box sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
          <RideButton
            variant="secondary"
            size="sm"
            onClick={onToggleState}
            startIcon={isEmptyState ? <LayersOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
            sx={{
              minHeight: 38,
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap',
              borderColor: colors.surface.borderStrong,
            }}
          >
            {isEmptyState ? 'Switch to Active Data View' : 'Preview Empty State'}
          </RideButton>
        </Box>
      )}
    </Box>
  );
};
