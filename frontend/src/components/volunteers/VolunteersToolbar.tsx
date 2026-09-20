import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import { colors } from '../../theme/colors';
import { VolunteerStatus } from './mockVolunteersData';
import { RideButton } from '../ui/RideButton';

export type VolunteerStatusFilter = 'All' | VolunteerStatus;

export interface VolunteersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEvent: string;
  onEventChange: (event: string) => void;
  selectedCheckpoint: string;
  onCheckpointChange: (cp: string) => void;
  selectedStatus: VolunteerStatusFilter;
  onStatusChange: (status: VolunteerStatusFilter) => void;
  statusCounts: Record<VolunteerStatusFilter, number>;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  eventOptions?: string[];
  checkpointOptions?: string[];
}

export const VolunteersToolbar: React.FC<VolunteersToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedEvent,
  onEventChange,
  selectedCheckpoint,
  onCheckpointChange,
  selectedStatus,
  onStatusChange,
  statusCounts,
  onClearFilters,
  hasActiveFilters,
  eventOptions,
  checkpointOptions,
}) => {
  const statusOptions: VolunteerStatusFilter[] = ['All', 'Assigned', 'Unassigned'];

  const allEventsList = ['All Events', ...(eventOptions || [])];
  const allCheckpointsList = ['All Checkpoints', ...(checkpointOptions || []), 'Unassigned'];

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Top Row: Search Input + Event Dropdown + Checkpoint Dropdown */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1.4fr 1fr 1fr',
          },
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* 1. Search input */}
        <Box
          sx={{
            width: '100%',
            height: 42,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.surface.borderStrong}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            gap: 1,
            transition: 'all 0.15s ease-in-out',
            '&:focus-within': {
              borderColor: colors.brand.accent,
              outline: `2px solid ${colors.brand.accent}`,
              outlineOffset: '1px',
            },
          }}
        >
          <SearchIcon sx={{ color: colors.text.muted, fontSize: 20, flexShrink: 0 }} />
          <Box
            component="input"
            type="text"
            aria-label="Search volunteers"
            placeholder="Search by volunteer name or mobile number"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            sx={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              color: colors.text.primary,
              '&::placeholder': {
                color: colors.text.muted,
                fontSize: '0.8125rem',
              },
            }}
          />
          {searchQuery && (
            <IconButton
              size="small"
              aria-label="Clear search"
              onClick={() => onSearchChange('')}
              sx={{ p: 0.5, color: colors.text.muted }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>

        {/* 2. Event Dropdown */}
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box
            component="select"
            value={selectedEvent}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onEventChange(e.target.value)}
            aria-label="Filter by Event"
            sx={{
              width: '100%',
              height: 42,
              appearance: 'none',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${colors.surface.borderStrong}`,
              borderRadius: '6px',
              px: 1.5,
              pr: 4,
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: colors.text.primary,
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              '&:focus': {
                borderColor: colors.brand.accent,
                outline: `2px solid ${colors.brand.accent}`,
                outlineOffset: '1px',
              },
            }}
          >
            {allEventsList.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </Box>
          <KeyboardArrowDownIcon
            sx={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.text.muted,
              pointerEvents: 'none',
              fontSize: 18,
            }}
          />
        </Box>

        {/* 3. Checkpoint Dropdown */}
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box
            component="select"
            value={selectedCheckpoint}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCheckpointChange(e.target.value)}
            aria-label="Filter by Checkpoint"
            sx={{
              width: '100%',
              height: 42,
              appearance: 'none',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${colors.surface.borderStrong}`,
              borderRadius: '6px',
              px: 1.5,
              pr: 4,
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: colors.text.primary,
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              '&:focus': {
                borderColor: colors.brand.accent,
                outline: `2px solid ${colors.brand.accent}`,
                outlineOffset: '1px',
              },
            }}
          >
            {allCheckpointsList.map((cp) => (
              <option key={cp} value={cp}>
                {cp}
              </option>
            ))}
          </Box>
          <KeyboardArrowDownIcon
            sx={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.text.muted,
              pointerEvents: 'none',
              fontSize: 18,
            }}
          />
        </Box>
      </Box>

      {/* Bottom Row: Status Filter Tabs & Reset Action */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          pt: 1,
          borderTop: `1px solid ${colors.surface.border}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            overflowX: 'auto',
            width: { xs: '100%', sm: 'auto' },
            pb: { xs: 0.5, sm: 0 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: colors.text.muted,
              mr: 0.5,
            }}
          >
            Status:
          </Typography>

          {statusOptions.map((st) => {
            const isSelected = selectedStatus === st;
            const count = statusCounts[st] ?? 0;
            return (
              <Box
                component="button"
                type="button"
                key={st}
                onClick={() => onStatusChange(st)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  px: 1.75,
                  py: '5px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isSelected ? colors.brand.accent : colors.surface.borderStrong,
                  backgroundColor: isSelected ? colors.brand.accent : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : colors.text.secondary,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: colors.brand.accent,
                    backgroundColor: isSelected ? colors.brand.accent : colors.surface.page,
                    color: isSelected ? '#FFFFFF' : colors.text.primary,
                  },
                }}
              >
                <span>{st}</span>
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    px: '6px',
                    py: '1px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : colors.surface.page,
                    color: isSelected ? '#FFFFFF' : colors.text.muted,
                  }}
                >
                  {count}
                </Box>
              </Box>
            );
          })}
        </Box>

        {hasActiveFilters && (
          <RideButton
            variant="secondary"
            size="sm"
            startIcon={<FilterAltOffOutlinedIcon fontSize="small" />}
            onClick={onClearFilters}
            sx={{
              fontSize: '0.75rem',
              py: '4px',
              px: 1.5,
              height: 32,
              alignSelf: { xs: 'flex-start', sm: 'center' },
            }}
          >
            Clear Filters
          </RideButton>
        )}
      </Box>
    </Box>
  );
};
