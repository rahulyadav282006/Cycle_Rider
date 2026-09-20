import React from 'react';
import { Box, Typography } from '@mui/material';

export interface PageHeroBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  actionButton?: React.ReactNode;
}

export const PageHeroBanner: React.FC<PageHeroBannerProps> = ({
  title,
  subtitle,
  backgroundImage = '/dashboard-hero-bg.jpg',
  actionButton,
}) => {
  return (
    <Box
      sx={{
        height: { xs: 130, sm: 160, md: 180 },
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: { xs: 2, sm: 4 },
        mb: 3,
        backgroundImage: `linear-gradient(180deg, rgba(8, 34, 38, 0.4) 0%, rgba(8, 34, 38, 0.68) 100%), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 45%',
        boxShadow: '0 2px 8px 0 rgba(15, 23, 42, 0.06)',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          mb: subtitle ? 0.75 : 0,
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            fontSize: { xs: '0.8125rem', sm: '0.95rem' },
            color: '#F1F5F9',
            fontWeight: 400,
            lineHeight: 1.4,
            maxWidth: 600,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          {subtitle}
        </Typography>
      )}

      {actionButton && (
        <Box
          sx={{
            position: { sm: 'absolute' },
            right: { sm: 24 },
            mt: { xs: 1.5, sm: 0 },
            zIndex: 2,
          }}
        >
          {actionButton}
        </Box>
      )}
    </Box>
  );
};
