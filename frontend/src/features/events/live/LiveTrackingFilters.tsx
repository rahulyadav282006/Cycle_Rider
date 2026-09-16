import React from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { colors } from '../../../theme/colors';

import {
  CHECKPOINT_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from './mockLiveTrackingData';

export interface LiveTrackingFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  checkpointFilter: string;
  onCheckpointFilterChange: (checkpoint: string) => void;
}

export const LiveTrackingFilters: React.FC<LiveTrackingFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  checkpointFilter,
  onCheckpointFilterChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2,
        mb: 2.5,
      }}
    >
      {/* Search Input */}
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 42,
            px: 1.5,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.surface.borderStrong}`,
            borderRadius: '6px',
            '&:focus-within': {
              borderColor: colors.brand.accent,
              boxShadow: '0 0 0 2px rgba(2, 132, 199, 0.15)',
            },
          }}
        >
          <SearchOutlinedIcon sx={{ fontSize: 20, color: colors.text.muted, mr: 1 }} />
          <Box
            component="input"
            type="text"
            placeholder="Search rider by name or rider ID"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange(e.target.value)
            }
            sx={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              color: colors.text.primary,
              backgroundColor: 'transparent',
              '&::placeholder': { color: colors.text.muted },
            }}
          />
        </Box>
      </Box>

      {/* Checkpoint Filter Dropdown (SCREEN 4) */}
      <Box sx={{ minWidth: { xs: '100%', md: 220 } }}>
        <Select
          fullWidth
          size="small"
          value={checkpointFilter}
          onChange={(e) => onCheckpointFilterChange(e.target.value)}
          sx={{
            height: 42,
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '0.875rem',
            '& fieldset': {
              borderColor: colors.surface.borderStrong,
            },
            '&:hover fieldset': {
              borderColor: colors.text.secondary,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.brand.accent,
            },
          }}
        >
          {CHECKPOINT_FILTER_OPTIONS.map((cp) => (
            <MenuItem key={cp} value={cp}>
              {cp}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Status Filter Dropdown */}
      <Box sx={{ minWidth: { xs: '100%', md: 170 } }}>
        <Select
          fullWidth
          size="small"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          sx={{
            height: 42,
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '0.875rem',
            '& fieldset': {
              borderColor: colors.surface.borderStrong,
            },
            '&:hover fieldset': {
              borderColor: colors.text.secondary,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.brand.accent,
            },
          }}
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};
