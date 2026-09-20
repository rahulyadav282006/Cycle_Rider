import React from 'react';
import { Box } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { PageHeroBanner } from '../common/PageHeroBanner';

export interface RidersPageHeaderProps {
  onRegisterRider: () => void;
  isEmptyState?: boolean;
  onToggleEmptyState?: () => void;
}

export const RidersPageHeader: React.FC<RidersPageHeaderProps> = ({ onRegisterRider }) => {
  return (
    <PageHeroBanner
      title="Riders"
      subtitle="Register and manage riders for your cycling events."
      actionButton={
        <Box
          component="button"
          type="button"
          onClick={onRegisterRider}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2.5,
            py: 1.25,
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#135F63',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: '#0E484B',
            },
          }}
        >
          <PersonAddOutlinedIcon sx={{ fontSize: 18 }} />
          Register Rider
        </Box>
      }
    />
  );
};
