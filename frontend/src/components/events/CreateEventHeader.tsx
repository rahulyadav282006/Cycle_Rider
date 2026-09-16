import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface CreateEventHeaderProps {
  onBack: () => void;
}

export const CreateEventHeader: React.FC<CreateEventHeaderProps> = ({ onBack }) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* 1. Breadcrumb: RideTrack > Events > Create Event */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: colors.text.muted,
          fontSize: '0.8125rem',
          mb: 1.5,
        }}
      >
        <Typography
          component="button"
          type="button"
          onClick={onBack}
          sx={{
            background: 'none',
            border: 'none',
            p: 0,
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: colors.text.muted,
            fontWeight: 500,
            '&:hover': { color: colors.text.primary },
          }}
        >
          RideTrack
        </Typography>
        <NavigateNextIcon sx={{ fontSize: 14, color: colors.text.muted }} />
        <Typography
          component="button"
          type="button"
          onClick={onBack}
          sx={{
            background: 'none',
            border: 'none',
            p: 0,
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: colors.text.muted,
            fontWeight: 500,
            '&:hover': { color: colors.text.primary },
          }}
        >
          Events
        </Typography>
        <NavigateNextIcon sx={{ fontSize: 14, color: colors.text.muted }} />
        <Typography
          component="span"
          sx={{
            fontSize: '0.8125rem',
            color: colors.text.primary,
            fontWeight: 600,
          }}
        >
          Create Event
        </Typography>
      </Box>

      {/* 2. Main Title Row with Back Action */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
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
            Create Event
          </Typography>
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: colors.text.secondary,
              lineHeight: 1.4,
            }}
          >
            Create a new cycling event and prepare it for configuration.
          </Typography>
        </Box>

        <RideButton
          variant="secondary"
          size="sm"
          startIcon={<ArrowBackIcon fontSize="small" />}
          onClick={onBack}
          sx={{
            minHeight: 40,
            fontSize: '0.8125rem',
            whiteSpace: 'nowrap',
          }}
        >
          Back to Events
        </RideButton>
      </Box>
    </Box>
  );
};
