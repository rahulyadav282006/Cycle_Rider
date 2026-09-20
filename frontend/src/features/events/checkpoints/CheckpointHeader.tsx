import React from 'react';
import { Box } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { PageHeroBanner } from '../../../components/common/PageHeroBanner';

export interface CheckpointHeaderProps {
  eventName?: string;
  onBackToEvent?: () => void;
  onAddCheckpoint?: () => void;
}

export const CheckpointHeader: React.FC<CheckpointHeaderProps> = ({
  onAddCheckpoint,
}) => {
  return (
    <PageHeroBanner
      title="Checkpoints"
      subtitle="Manage event checkpoints and scanning locations."
      actionButton={
        onAddCheckpoint ? (
          <Box
            component="button"
            type="button"
            onClick={onAddCheckpoint}
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
            <AddOutlinedIcon sx={{ fontSize: 18 }} />
            New Checkpoint
          </Box>
        ) : undefined
      }
    />
  );
};
