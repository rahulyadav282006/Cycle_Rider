import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <HomeOutlinedIcon fontSize="small" /> },
  { id: 'events', label: 'Events', icon: <CalendarMonthOutlinedIcon fontSize="small" /> },
  { id: 'riders', label: 'Riders', icon: <PersonOutlineOutlinedIcon fontSize="small" /> },
  { id: 'volunteers', label: 'Volunteers', icon: <PeopleOutlineOutlinedIcon fontSize="small" /> },
  { id: 'reports', label: 'Reports', icon: <BarChartOutlinedIcon fontSize="small" /> },
  { id: 'checkpoints', label: 'Checkpoints', icon: <PlaceOutlinedIcon fontSize="small" /> },
  { id: 'live', label: 'Live Tracking', icon: <SensorsOutlinedIcon fontSize="small" /> },
];
