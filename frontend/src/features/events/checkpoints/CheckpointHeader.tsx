import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';

export type CheckpointPrototypeState =
  | 'populated'
  | 'add_filled'
  | 'edit'
  | 'delete_dialog'
  | 'empty'
  | 'validation_error';

export interface CheckpointHeaderProps {
  onBackToEvent?: () => void;
  onAddCheckpoint?: () => void;
  activeState?: CheckpointPrototypeState;
  onStateChange?: (state: CheckpointPrototypeState) => void;
}

export const CheckpointHeader: React.FC<CheckpointHeaderProps> = ({
  onBackToEvent,
  onAddCheckpoint,
  activeState = 'populated',
  onStateChange,
}) => {
  const states: { key: CheckpointPrototypeState; label: string }[] = [
    { key: 'populated', label: '1. Populated (10 CPs)' },
    { key: 'add_filled', label: '2. Add Checkpoint' },
    { key: 'edit', label: '3. Edit (Lunch)' },
    { key: 'delete_dialog', label: '4. Delete Dialog' },
    { key: 'empty', label: '5. Empty State' },
    { key: 'validation_error', label: '6. Validation Error' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Interactive Prototype States Switcher */}
      {onStateChange && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2.5,
            p: 1.25,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
            <LayersOutlinedIcon sx={{ fontSize: 18, color: colors.primary.main }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Prototype States:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {states.map((s) => {
              const isSelected = activeState === s.key;
              return (
                <Box
                  key={s.key}
                  component="button"
                  onClick={() => onStateChange(s.key)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 700 : 500,
                    border: '1px solid',
                    borderColor: isSelected ? colors.primary.main : colors.surface.borderStrong,
                    backgroundColor: isSelected ? colors.brand.accentLight : 'transparent',
                    color: isSelected ? colors.primary.dark : colors.text.secondary,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: isSelected ? colors.brand.accentLight : colors.surface.subtle,
                    },
                  }}
                >
                  {s.label}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Breadcrumb Navigation */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.5,
          fontSize: '0.8125rem',
          color: colors.text.secondary,
        }}
      >
        <Typography
          component="span"
          sx={{
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            '&:hover': { color: colors.primary.main },
          }}
          onClick={onBackToEvent}
        >
          RideTrack
        </Typography>
        <Typography component="span" sx={{ color: colors.text.muted }}>
          &gt;
        </Typography>
        <Typography
          component="span"
          sx={{
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            '&:hover': { color: colors.primary.main },
          }}
          onClick={onBackToEvent}
        >
          Events
        </Typography>
        <Typography component="span" sx={{ color: colors.text.muted }}>
          &gt;
        </Typography>
        <Typography
          component="span"
          sx={{
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            '&:hover': { color: colors.primary.main },
          }}
          onClick={onBackToEvent}
        >
          Kolhapur Endurance Ride
        </Typography>
        <Typography component="span" sx={{ color: colors.text.muted }}>
          &gt;
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: colors.text.primary,
          }}
        >
          Checkpoints
        </Typography>
      </Box>

      {/* Header Content & Actions */}
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
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' },
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            Checkpoints
          </Typography>
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: colors.text.secondary,
              lineHeight: 1.4,
            }}
          >
            Configure the sequence of checkpoints riders will pass during the event.
          </Typography>
        </Box>

        {/* Top-Right Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <RideButton
            variant="secondary"
            onClick={onBackToEvent}
            startIcon={<ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            Back to Event
          </RideButton>

          <RideButton
            variant="primary"
            onClick={onAddCheckpoint}
            startIcon={<AddOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            Add Checkpoint
          </RideButton>
        </Box>
      </Box>
    </Box>
  );
};
