import React, { useState } from 'react';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../ui/RideButton';

export interface EventOverviewHeaderProps {
  eventName: string;
  onEditEvent: () => void;
  onOpenArchiveDialog: () => void;
}

export const EventOverviewHeader: React.FC<EventOverviewHeaderProps> = ({
  eventName,
  onEditEvent,
  onOpenArchiveDialog,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleArchiveClick = () => {
    handleMenuClose();
    onOpenArchiveDialog();
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Page Header Bar */}
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
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: colors.text.primary,
              fontSize: { xs: '1.5rem', sm: '1.875rem' },
              lineHeight: 1.25,
            }}
          >
            {eventName || 'Event Details'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.text.secondary,
              mt: 0.5,
              fontSize: '0.9375rem',
            }}
          >
            Event overview and management.
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <RideButton
            variant="primary"
            startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onEditEvent}
          >
            Edit Event
          </RideButton>

          <Box
            component="button"
            type="button"
            onClick={handleMenuClick}
            aria-label="More Actions"
            aria-controls={menuOpen ? 'event-actions-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: '9px',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${colors.surface.borderStrong}`,
              backgroundColor: colors.surface.card,
              color: colors.text.primary,
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: colors.surface.subtle,
                borderColor: colors.text.muted,
              },
            }}
          >
            <MoreVertIcon sx={{ fontSize: 18 }} />
            More Actions
          </Box>

          <Menu
            id="event-actions-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '8px',
                  border: `1px solid ${colors.surface.border}`,
                  boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.1)',
                  minWidth: 180,
                  mt: 0.75,
                },
              },
            }}
          >
            <MenuItem onClick={handleArchiveClick} sx={{ py: 1, gap: 1 }}>
              <ListItemIcon sx={{ color: colors.status.error.dot, minWidth: 'auto' }}>
                <ArchiveOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.status.error.dot,
                }}
              >
                Archive Event
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};
