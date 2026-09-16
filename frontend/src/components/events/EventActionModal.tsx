import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface EventActionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  route: string;
  description: string;
}

export const EventActionModal: React.FC<EventActionModalProps> = ({
  open,
  onClose,
  title,
  route,
  description,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '8px',
            border: `1px solid ${colors.surface.border}`,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontWeight: 700,
          fontSize: '1.0625rem',
          color: colors.text.primary,
          pb: 1,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: colors.brand.accentLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.brand.accent,
            flexShrink: 0,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        {title}
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box
          sx={{
            display: 'inline-block',
            backgroundColor: colors.surface.subtle,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '4px',
            px: 1,
            py: 0.25,
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: colors.brand.accentHover,
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          Target Route: {route}
        </Box>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <RideButton variant="primary" size="sm" onClick={onClose} fullWidth>
          Understood
        </RideButton>
      </DialogActions>
    </Dialog>
  );
};
