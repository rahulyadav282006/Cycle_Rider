import React from 'react';
import { Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { PageHeroBanner } from '../common/PageHeroBanner';

export interface EventsPageHeaderProps {
  onCreateEvent: () => void;
  isEmptyState?: boolean;
  onToggleEmptyState?: () => void;
}

export const EventsPageHeader: React.FC<EventsPageHeaderProps> = ({
  onCreateEvent,
}) => {
  return (
    <PageHeroBanner
      title="Events"
      subtitle="Create and manage cycling events."
      actionButton={
        <Box
          component="button"
          type="button"
          onClick={onCreateEvent}
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
          <AddCircleIcon sx={{ fontSize: 18 }} />
          Create Event
        </Box>
      }
    />
  );
};
