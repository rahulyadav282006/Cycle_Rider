import React from 'react';
import { RideBadge } from '../ui/RideBadge';
import { RiderStatus } from './mockRidersData';
import { StatusType } from '../../theme/colors';

export interface RiderStatusBadgeProps {
  status: RiderStatus;
  size?: 'sm' | 'md';
}

export const RiderStatusBadge: React.FC<RiderStatusBadgeProps> = ({ status, size = 'md' }) => {
  const mapStatusToToken = (s: RiderStatus): StatusType => {
    switch (s) {
      case 'Registered':
        return 'registered';
      case 'Active':
        return 'active';
      case 'Finished':
        return 'finished';
      case 'DNF':
        return 'dnf';
      default:
        return 'draft';
    }
  };

  return (
    <RideBadge
      status={mapStatusToToken(status)}
      label={status}
      size={size}
      showDot={true}
    />
  );
};
