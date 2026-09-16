import React from 'react';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <SpaceDashboardIcon fontSize="small" /> },
  { id: 'events', label: 'Events', icon: <EventAvailableIcon fontSize="small" /> },
  { id: 'riders', label: 'Riders', icon: <DirectionsBikeIcon fontSize="small" /> },
  { id: 'volunteers', label: 'Volunteers', icon: <PeopleIcon fontSize="small" /> },
  { id: 'reports', label: 'Reports', icon: <BarChartIcon fontSize="small" /> },
];
