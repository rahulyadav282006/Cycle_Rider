import React from 'react';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageHeroBanner } from '../common/PageHeroBanner';

export interface RiderProfileHeaderProps {
  riderName?: string;
  onBack: () => void;
}

export const RiderProfileHeader: React.FC<RiderProfileHeaderProps> = ({ onBack }) => {
  return (
    <PageHeroBanner
      title="Rider Profile"
      actionButton={
        <Box
          component="button"
          type="button"
          onClick={onBack}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 2,
            py: 1,
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Back to Riders
        </Box>
      }
    />
  );
};
