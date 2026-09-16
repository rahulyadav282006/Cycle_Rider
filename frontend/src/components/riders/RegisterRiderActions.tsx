import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface RegisterRiderActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegisterRiderActions: React.FC<RegisterRiderActionsProps> = ({
  isSubmitting,
  onCancel,
  onSubmit,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1.5,
        pt: 2,
      }}
    >
      {/* Cancel Button */}
      <RideButton
        variant="secondary"
        size="md"
        disabled={isSubmitting}
        onClick={onCancel}
        sx={{
          width: { xs: '100%', sm: 'auto' },
          minHeight: 44, // 44px touch target
          minWidth: 100,
          borderColor: colors.surface.borderStrong,
        }}
      >
        Cancel
      </RideButton>

      {/* Register Rider Primary Button */}
      <RideButton
        variant="primary"
        size="md"
        disabled={isSubmitting}
        onClick={onSubmit}
        startIcon={
          isSubmitting ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <PersonAddOutlinedIcon />
          )
        }
        sx={{
          width: { xs: '100%', sm: 'auto' },
          minHeight: 44, // 44px touch target
          minWidth: 160,
          fontWeight: 700,
          boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.12)',
        }}
      >
        {isSubmitting ? 'Registering Rider...' : 'Register Rider'}
      </RideButton>
    </Box>
  );
};
