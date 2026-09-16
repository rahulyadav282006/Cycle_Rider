import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { colors } from '../../theme/colors';
import { RideIconButton } from '../ui/RideButton';

export interface TopHeaderProps {
  pageTitle: string;
  breadcrumb?: string[];
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  pageTitle,
  breadcrumb = ['RideTrack', 'System Shell'],
}) => {
  return (
    <Box
      component="header"
      sx={{
        height: 64,
        backgroundColor: colors.surface.header,
        borderBottom: `1px solid ${colors.surface.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3, md: 4 },
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Context & Breadcrumb Area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {breadcrumb && breadcrumb.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: colors.text.muted,
              fontSize: '0.75rem',
              lineHeight: 1,
              mb: 0.5,
            }}
          >
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && (
                  <NavigateNextIcon sx={{ fontSize: 13, color: colors.text.muted }} />
                )}
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.75rem',
                    color: idx === breadcrumb.length - 1 ? colors.text.secondary : colors.text.muted,
                    fontWeight: idx === breadcrumb.length - 1 ? 500 : 400,
                  }}
                >
                  {crumb}
                </Typography>
              </React.Fragment>
            ))}
          </Box>
        )}

        <Typography
          variant="h2"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: colors.text.primary,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}
        >
          {pageTitle}
        </Typography>
      </Box>

      {/* Header Actions (Visual balance only) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Visual Balance Action Buttons */}
        <RideIconButton label="Notifications" size="sm" variant="default">
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
        </RideIconButton>

        <RideIconButton label="Help" size="sm" variant="default">
          <HelpOutlineOutlinedIcon sx={{ fontSize: 20 }} />
        </RideIconButton>

        <Box
          sx={{
            width: '1px',
            height: 24,
            backgroundColor: colors.surface.border,
            mx: 0.5,
          }}
        />

        {/* Profile Pill */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            pl: 0.5,
            cursor: 'default',
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.8125rem',
              fontWeight: 700,
              backgroundColor: colors.brand.primary,
              color: '#FFFFFF',
            }}
          >
            OP
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: colors.text.primary,
                lineHeight: 1.2,
              }}
            >
              Organizer
            </Typography>
            <Typography
              sx={{
                fontSize: '0.6875rem',
                color: colors.text.muted,
                lineHeight: 1.2,
              }}
            >
              Organizer Admin
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
