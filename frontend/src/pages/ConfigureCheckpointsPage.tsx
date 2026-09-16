import React from 'react';
import { CheckpointPage } from '../features/events/checkpoints';

export interface ConfigureCheckpointsPageProps {
  eventId?: string;
  onNavigateAddCheckpoint?: () => void;
  onNavigateEventOverview?: () => void;
}

export const ConfigureCheckpointsPage: React.FC<ConfigureCheckpointsPageProps> = ({
  eventId,
  onNavigateAddCheckpoint,
  onNavigateEventOverview,
}) => {
  return (
    <CheckpointPage
      eventId={eventId}
      onNavigateBackToEvent={onNavigateEventOverview}
      onNavigateAddCheckpoint={onNavigateAddCheckpoint}
    />
  );
};
