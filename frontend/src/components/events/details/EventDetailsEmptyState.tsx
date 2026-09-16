import React from 'react';
import { Box, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../ui/RideButton';

export interface EventDetailsEmptyStateProps {
  onConfigureCheckpoints: () => void;
  onRegisterRider: () => void;
}

export const EventDetailsEmptyState: React.FC<EventDetailsEmptyStateProps> = ({
  onConfigureCheckpoints,
  onRegisterRider,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Card 1: No Checkpoints Configured */}
        <Box
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px dashed ${colors.surface.borderStrong}`,
            borderRadius: '8px',
            p: { xs: 3, sm: 4 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: 240,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text.muted,
              mb: 2,
            }}
          >
            <PlaceOutlinedIcon sx={{ fontSize: 26 }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: colors.text.primary,
              fontSize: '1.0625rem',
              mb: 0.75,
            }}
          >
            No Checkpoints Configured
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.text.secondary,
              fontSize: '0.875rem',
              maxWidth: 320,
              mb: 3,
              lineHeight: 1.5,
            }}
          >
            This event does not have any checkpoints yet.
          </Typography>

          <RideButton
            variant="primary"
            startIcon={<PlaceOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onConfigureCheckpoints}
          >
            Configure Checkpoints
          </RideButton>
        </Box>

        {/* Card 2: No Riders Registered */}
        <Box
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px dashed ${colors.surface.borderStrong}`,
            borderRadius: '8px',
            p: { xs: 3, sm: 4 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: 240,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text.muted,
              mb: 2,
            }}
          >
            <PersonAddOutlinedIcon sx={{ fontSize: 26 }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: colors.text.primary,
              fontSize: '1.0625rem',
              mb: 0.75,
            }}
          >
            No Riders Registered
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.text.secondary,
              fontSize: '0.875rem',
              maxWidth: 320,
              mb: 3,
              lineHeight: 1.5,
            }}
          >
            This event does not have any riders yet.
          </Typography>

          <RideButton
            variant="primary"
            startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onRegisterRider}
          >
            Register Rider
          </RideButton>
        </Box>
      </Box>
    </Box>
  );
};
