import React from 'react';
import { Box, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { colors } from '../../../theme/colors';

export interface CheckpointProgressCardProps {
  total: number;
  mandatory: number;
  optional: number;
  onManageCheckpoints: () => void;
}

export const CheckpointProgressCard: React.FC<CheckpointProgressCardProps> = ({
  total,
  mandatory,
  optional,
  onManageCheckpoints,
}) => {
  const mandatoryPercent = total > 0 ? (mandatory / total) * 100 : 0;
  const optionalPercent = total > 0 ? (optional / total) * 100 : 0;

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.borderStrong}`,
        borderRadius: '8px',
        p: { xs: 2.5, md: 3 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 20, color: colors.primary.main }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1rem',
                color: colors.text.primary,
              }}
            >
              Checkpoint Progress
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: colors.text.primary,
            }}
          >
            {total} Checkpoints
          </Typography>
        </Box>

        {/* Stacked Progress Bar */}
        <Box sx={{ mb: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              height: 10,
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: colors.surface.subtle,
            }}
          >
            <Box
              sx={{
                width: `${mandatoryPercent}%`,
                backgroundColor: colors.primary.main,
                transition: 'width 0.3s ease',
              }}
            />
            <Box
              sx={{
                width: `${optionalPercent}%`,
                backgroundColor: '#94A3B8',
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Box>

        {/* Breakdown chips */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: colors.primary.main,
              }}
            />
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              <strong>{mandatory}</strong> Mandatory
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#94A3B8',
              }}
            />
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              <strong>{optional}</strong> Optional
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Action link */}
      <Box
        component="button"
        type="button"
        onClick={onManageCheckpoints}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          color: colors.primary.main,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          p: 0,
          mt: 2,
          fontWeight: 700,
          fontSize: '0.875rem',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        Configure & sequence checkpoints
        <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
      </Box>
    </Box>
  );
};
