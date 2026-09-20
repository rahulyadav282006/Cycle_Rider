import React from 'react';
import { Box, Typography } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CropFreeIcon from '@mui/icons-material/CropFree';
import BarChartIcon from '@mui/icons-material/BarChart';

export interface QuickActionsProps {
  onCreateEvent?: () => void;
  onRegisterRider?: () => void;
  onOpenScanner?: () => void;
  onNavigateReports?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateEvent,
  onRegisterRider,
  onOpenScanner,
  onNavigateReports,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <BoltIcon sx={{ fontSize: 20, color: '#14B8A6' }} />
        <Typography
          variant="h3"
          sx={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#0F172A',
          }}
        >
          Quick Actions
        </Typography>
      </Box>

      {/* Action Buttons Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {/* 1. Create Event (Solid Teal Primary) */}
        <Box
          component="button"
          type="button"
          onClick={onCreateEvent}
          sx={{
            minHeight: 46,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            px: 2,
            py: 1.25,
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#135F63',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease, transform 0.1s ease',
            '&:hover': {
              backgroundColor: '#0E4E52',
            },
            '&:active': {
              transform: 'scale(0.99)',
            },
          }}
        >
          <AddCircleIcon sx={{ fontSize: 18 }} />
          Create Event
        </Box>

        {/* 2. Register Rider */}
        <Box
          component="button"
          type="button"
          onClick={onRegisterRider}
          sx={{
            minHeight: 46,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            px: 2,
            py: 1.25,
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#334155',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: '#F8FAFC',
              borderColor: '#CBD5E1',
            },
            '&:active': {
              transform: 'scale(0.99)',
            },
          }}
        >
          <PersonOutlineOutlinedIcon sx={{ fontSize: 20, color: '#135F63' }} />
          Register Rider
        </Box>

        {/* 3. Open Scanner */}
        <Box
          component="button"
          type="button"
          onClick={onOpenScanner}
          sx={{
            minHeight: 46,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            px: 2,
            py: 1.25,
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#334155',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: '#F8FAFC',
              borderColor: '#CBD5E1',
            },
            '&:active': {
              transform: 'scale(0.99)',
            },
          }}
        >
          <CropFreeIcon sx={{ fontSize: 20, color: '#135F63' }} />
          Open Scanner
        </Box>

        {/* 4. Reports */}
        <Box
          component="button"
          type="button"
          onClick={onNavigateReports}
          sx={{
            minHeight: 46,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            px: 2,
            py: 1.25,
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#334155',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: '#F8FAFC',
              borderColor: '#CBD5E1',
            },
            '&:active': {
              transform: 'scale(0.99)',
            },
          }}
        >
          <BarChartIcon sx={{ fontSize: 20, color: '#135F63' }} />
          Reports
        </Box>
      </Box>
    </Box>
  );
};
