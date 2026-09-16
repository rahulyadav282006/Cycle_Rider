import React from 'react';
import { Box, Typography } from '@mui/material';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';

export interface NoCheckpointAssignedStateProps {
  onRefresh?: () => void;
  onContactCoordinator?: () => void;
}

export const NoCheckpointAssignedState: React.FC<NoCheckpointAssignedStateProps> = ({
  onRefresh,
  onContactCoordinator,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px dashed ${colors.surface.borderStrong}`,
        borderRadius: '8px',
        py: { xs: 8, sm: 10 },
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D97706',
          mb: 2.5,
        }}
      >
        <AssignmentLateOutlinedIcon sx={{ fontSize: 36 }} />
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 800,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        No Checkpoint Assigned
      </Typography>

      <Typography
        sx={{
          fontSize: '0.9375rem',
          color: colors.text.secondary,
          maxWidth: 440,
          lineHeight: 1.5,
          mb: 3,
        }}
      >
        Your event coordinator has not assigned you to a checkpoint yet.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        {onRefresh && (
          <RideButton
            variant="secondary"
            size="md"
            startIcon={<RefreshOutlinedIcon />}
            onClick={onRefresh}
            sx={{ minHeight: 44 }}
          >
            Refresh Status
          </RideButton>
        )}

        <RideButton
          variant="primary"
          size="md"
          startIcon={<ContactSupportOutlinedIcon />}
          onClick={onContactCoordinator || (() => alert('Please contact the Event Organizer desk at Kolhapur Endurance Ride.'))}
          sx={{ minHeight: 44, fontWeight: 700 }}
        >
          Contact Coordinator
        </RideButton>
      </Box>
    </Box>
  );
};
