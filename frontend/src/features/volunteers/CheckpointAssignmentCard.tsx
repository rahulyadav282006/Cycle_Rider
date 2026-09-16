import React from 'react';
import { Box, Typography } from '@mui/material';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';
import { AssignedCheckpoint } from './VolunteerMockData';

export interface CheckpointAssignmentCardProps {
  checkpoint: AssignedCheckpoint;
  onOpenScanner: () => void;
}

export const CheckpointAssignmentCard: React.FC<CheckpointAssignmentCardProps> = ({
  checkpoint,
  onOpenScanner,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `2px solid ${colors.brand.accent}`,
        borderRadius: '10px',
        p: { xs: 2.5, sm: 3 },
        boxShadow: '0 4px 12px -2px rgba(2, 132, 199, 0.12), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative top accent stripe */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: colors.brand.accent,
        }}
      />

      {/* Header Row: Label & Status Badge */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedUserOutlinedIcon sx={{ fontSize: 20, color: colors.brand.accent }} />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: colors.brand.accent,
            }}
          >
            Assigned Checkpoint
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.25,
            py: 0.4,
            borderRadius: '9999px',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
          {checkpoint.status}
        </Box>
      </Box>

      {/* Main Checkpoint Identity */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 2.5 },
          mb: 2.5,
          p: { xs: 2, sm: 2.5 },
          backgroundColor: colors.surface.page,
          borderRadius: '8px',
          border: `1px solid ${colors.surface.border}`,
        }}
      >
        {/* Large Sequence / Number Box */}
        <Box
          sx={{
            width: { xs: 60, sm: 68 },
            height: { xs: 60, sm: 68 },
            borderRadius: '10px',
            backgroundColor: colors.brand.accent,
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 6px 0 rgba(2, 132, 199, 0.3)',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: 0.85,
              lineHeight: 1,
              mb: 0.25,
            }}
          >
            CP
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1.625rem', sm: '1.75rem' },
              fontWeight: 800,
              fontFamily: 'monospace',
              lineHeight: 1,
            }}
          >
            {checkpoint.number}
          </Typography>
        </Box>

        {/* Checkpoint Details */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {checkpoint.name}
            </Typography>

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: '4px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#1D4ED8',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <RestaurantOutlinedIcon sx={{ fontSize: 14 }} />
              {checkpoint.type}
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: '0.875rem',
              color: colors.text.secondary,
              lineHeight: 1.4,
            }}
          >
            {checkpoint.supportingText}
          </Typography>
        </Box>
      </Box>

      {/* Primary Action Button: "Open Scanner" */}
      <Box sx={{ mt: 2.5 }}>
        <RideButton
          variant="primary"
          size="lg"
          fullWidth
          startIcon={<QrCodeScannerOutlinedIcon sx={{ fontSize: 24 }} />}
          onClick={onOpenScanner}
          sx={{
            minHeight: { xs: 52, sm: 56 },
            fontSize: { xs: '1rem', sm: '1.0625rem' },
            fontWeight: 800,
            letterSpacing: '0.02em',
            boxShadow: '0 4px 10px 0 rgba(2, 132, 199, 0.25)',
            transition: 'all 0.15s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 14px 0 rgba(2, 132, 199, 0.35)',
            },
          }}
        >
          Open Scanner
        </RideButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mt: 1.25,
          }}
        >
          <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: '#10B981' }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: colors.text.muted,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Camera verification ready &bull; Fast QR scanning mode enabled
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
