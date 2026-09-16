import React from 'react';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface RiderProfileActionsProps {
  onBack: () => void;
  onEdit: () => void;
}

export const RiderProfileActions: React.FC<RiderProfileActionsProps> = ({
  onBack,
  onEdit,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1.5,
        mt: 4,
        pt: 2.5,
        borderTop: `1px solid ${colors.surface.border}`,
      }}
    >
      <RideButton
        variant="secondary"
        size="md"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{
          width: { xs: '100%', sm: 'auto' },
          minHeight: 44,
          minWidth: 140,
          borderColor: colors.surface.borderStrong,
        }}
      >
        Back to Riders
      </RideButton>

      <RideButton
        variant="primary"
        size="md"
        startIcon={<EditOutlinedIcon />}
        onClick={onEdit}
        sx={{
          width: { xs: '100%', sm: 'auto' },
          minHeight: 44,
          minWidth: 140,
          fontWeight: 700,
          boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.12)',
        }}
      >
        Edit Rider
      </RideButton>
    </Box>
  );
};
