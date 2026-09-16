import React from 'react';
import { Box, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { colors } from '../../theme/colors';

export interface CheckpointsStateSwitcherProps {
  isEmptyState: boolean;
  onToggleEmptyState: (isEmpty: boolean) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: () => void;
  onOpenDeleteModal: () => void;
  onTriggerToast: () => void;
}

export const CheckpointsStateSwitcher: React.FC<CheckpointsStateSwitcherProps> = ({
  isEmptyState,
  onToggleEmptyState,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onTriggerToast,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: 1.5,
        mb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TuneIcon sx={{ fontSize: 18, color: colors.brand.accent }} />
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: colors.text.secondary,
          }}
        >
          Checkpoints UI Preview:
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Box
          component="button"
          type="button"
          onClick={() => onToggleEmptyState(false)}
          sx={{
            minHeight: 32,
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            border: `1px solid ${!isEmptyState ? colors.brand.primary : colors.surface.border}`,
            backgroundColor: !isEmptyState ? colors.brand.primary : colors.surface.subtle,
            color: !isEmptyState ? '#FFFFFF' : colors.text.primary,
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          10 Checkpoints
        </Box>

        <Box
          component="button"
          type="button"
          onClick={() => onToggleEmptyState(true)}
          sx={{
            minHeight: 32,
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            border: `1px solid ${isEmptyState ? colors.brand.primary : colors.surface.border}`,
            backgroundColor: isEmptyState ? colors.brand.primary : colors.surface.subtle,
            color: isEmptyState ? '#FFFFFF' : colors.text.primary,
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Empty State
        </Box>

        <Box
          component="button"
          type="button"
          onClick={onOpenAddModal}
          sx={{
            minHeight: 32,
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.border}`,
            backgroundColor: colors.surface.subtle,
            color: colors.text.primary,
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': { backgroundColor: colors.surface.border },
          }}
        >
          Add Modal
        </Box>

        <Box
          component="button"
          type="button"
          onClick={onOpenEditModal}
          sx={{
            minHeight: 32,
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.border}`,
            backgroundColor: colors.surface.subtle,
            color: colors.text.primary,
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': { backgroundColor: colors.surface.border },
          }}
        >
          Edit Modal
        </Box>

        <Box
          component="button"
          type="button"
          onClick={onOpenDeleteModal}
          sx={{
            minHeight: 32,
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.border}`,
            backgroundColor: colors.surface.subtle,
            color: colors.text.primary,
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': { backgroundColor: colors.surface.border },
          }}
        >
          Delete Modal
        </Box>

        <Box
          component="button"
          type="button"
          onClick={onTriggerToast}
          sx={{
            minHeight: 32,
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.border}`,
            backgroundColor: colors.surface.subtle,
            color: colors.text.primary,
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': { backgroundColor: colors.surface.border },
          }}
        >
          Success Toast
        </Box>
      </Box>
    </Box>
  );
};
