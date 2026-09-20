import React from 'react';
import { Box, Typography } from '@mui/material';

export const DashboardHeader: React.FC = () => {
  return (
    <Box
      sx={{
        height: { xs: 150, sm: 180, md: 210 },
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
        mb: 3,
        backgroundImage: "linear-gradient(180deg, rgba(8, 34, 38, 0.38) 0%, rgba(8, 34, 38, 0.65) 100%), url('/dashboard-hero-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 45%',
        boxShadow: '0 4px 14px 0 rgba(15, 23, 42, 0.08)',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          mb: 1,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.65)',
        }}
      >
        Dashboard of Ride Track
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '0.875rem', sm: '1.05rem' },
          color: '#F1F5F9',
          fontWeight: 400,
          lineHeight: 1.4,
          maxWidth: 600,
          textShadow: '0 1px 6px rgba(0, 0, 0, 0.65)',
        }}
      >
        Monitor your cycling events, riders, and ride activity.
      </Typography>
    </Box>
  );
};
