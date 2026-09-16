import React from 'react';
import { Box, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import { colors } from '../../../theme/colors';
import { RideBadge } from '../../../components/ui/RideBadge';
import { RideIconButton } from '../../../components/ui/RideButton';
import { CheckpointItem } from './mockCheckpointData';

export interface CheckpointCardProps {
  checkpoint: CheckpointItem;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (checkpoint: CheckpointItem) => void;
  onDelete: (checkpoint: CheckpointItem) => void;
}

export const CheckpointCard: React.FC<CheckpointCardProps> = ({
  checkpoint,
  isFirst,
  isLast,
  onEdit,
  onDelete,
}) => {
  const sequenceStr = checkpoint.sequence.toString().padStart(2, '0');
  const isMandatory = checkpoint.requirement === 'Mandatory';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
      }}
    >
      {/* 1. Left Sequence Rail with Connector Line */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: { xs: 48, sm: 60 },
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Top Connecting Line */}
        {!isFirst && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: '50%',
              width: '2px',
              backgroundColor: colors.surface.borderStrong,
              zIndex: 0,
            }}
          />
        )}

        {/* Bottom Connecting Line */}
        {!isLast && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              bottom: 0,
              width: '2px',
              backgroundColor: colors.surface.borderStrong,
              zIndex: 0,
            }}
          />
        )}

        {/* Sequence Badge [05] */}
        <Box
          sx={{
            my: 'auto',
            width: { xs: 38, sm: 44 },
            height: { xs: 38, sm: 44 },
            borderRadius: '8px',
            backgroundColor: isMandatory ? colors.brand.primary : '#FFFFFF',
            border: `2px solid ${isMandatory ? colors.brand.primary : colors.surface.borderStrong}`,
            color: isMandatory ? '#FFFFFF' : colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            fontFamily: 'monospace, monospace',
            letterSpacing: '-0.02em',
            zIndex: 1,
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.08)',
          }}
        >
          {sequenceStr}
        </Box>
      </Box>

      {/* 2. Checkpoint Details Card */}
      <Box
        sx={{
          flex: 1,
          ml: { xs: 1.5, sm: 2 },
          my: 0.75,
          p: { xs: 2, sm: 2.25 },
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          transition: 'all 0.15s ease-in-out',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
          '&:hover': {
            borderColor: colors.surface.borderStrong,
            boxShadow: '0 2px 4px 0 rgba(15, 23, 42, 0.04)',
          },
        }}
      >
        {/* Info */}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 1.25,
              mb: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '0.9375rem', sm: '1rem' },
                fontWeight: 700,
                color: colors.text.primary,
                lineHeight: 1.3,
              }}
            >
              {checkpoint.name}
            </Typography>

            <RideBadge
              status={isMandatory ? 'mandatory' : 'optional'}
              label={checkpoint.requirement}
              size="sm"
            />
          </Box>

          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: colors.text.secondary,
              lineHeight: 1.3,
            }}
          >
            Type:{' '}
            <Box
              component="span"
              sx={{
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              {checkpoint.type}
            </Box>
          </Typography>
        </Box>

        {/* Right Action Buttons: [Edit] [Delete] */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            alignSelf: { xs: 'flex-end', sm: 'center' },
          }}
        >
          <RideIconButton
            label={`Edit ${checkpoint.name}`}
            size="md"
            variant="outlined"
            onClick={() => onEdit(checkpoint)}
            sx={{
              color: colors.text.secondary,
              '&:hover': {
                color: colors.brand.accent,
                borderColor: colors.brand.accent,
              },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </RideIconButton>

          <RideIconButton
            label={`Delete ${checkpoint.name}`}
            size="md"
            variant="outlined"
            onClick={() => onDelete(checkpoint)}
            sx={{
              color: colors.text.secondary,
              '&:hover': {
                color: colors.status.error.dot,
                borderColor: colors.status.error.border,
                backgroundColor: colors.status.error.bg,
              },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </RideIconButton>
        </Box>
      </Box>
    </Box>
  );
};
