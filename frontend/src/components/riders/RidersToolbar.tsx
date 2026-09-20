import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { colors } from '../../theme/colors';
import { RiderStatus } from './mockRidersData';

export type RiderStatusFilter = 'All' | RiderStatus;

export interface RidersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEvent: string;
  onEventChange: (event: string) => void;
  selectedStatus: RiderStatusFilter;
  onStatusChange: (status: RiderStatusFilter) => void;
  statusCounts: Record<RiderStatusFilter, number>;
  eventOptions?: string[];
}

export const RidersToolbar: React.FC<RidersToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedEvent,
  onEventChange,
  selectedStatus,
  onStatusChange,
  statusCounts,
  eventOptions,
}) => {
  const statusOptions: RiderStatusFilter[] = ['All', 'Registered', 'Active', 'Finished', 'DNF'];
  const eventList = eventOptions && eventOptions.length > 0 ? eventOptions : ['All Events'];

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'stretch', lg: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Left side: Search input */}
      <Box
        sx={{
          width: { xs: '100%', lg: 380 },
          height: 44,
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
          aria-label="Search riders"
          placeholder="Search by rider name, rider ID or jersey number"
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

      {/* Right side: Event selector & Status filter tabs */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Event Selector Dropdown */}
        <Box
          sx={{
            position: 'relative',
            minWidth: { xs: '100%', sm: 200 },
          }}
        >
          <Box
            component="select"
            value={selectedEvent}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onEventChange(e.target.value)}
            aria-label="Filter by Event"
            sx={{
              width: '100%',
              height: 40,
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
            {eventList.map((evt) => (
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

        {/* Status Filter Pills */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            overflowX: 'auto',
            pb: { xs: 0.5, sm: 0 },
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
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
              display: { xs: 'none', md: 'block' },
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
                  minHeight: 36,
                  minWidth: 44,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '6px',
                  border: `1px solid ${isSelected ? colors.brand.primary : colors.surface.border}`,
                  backgroundColor: isSelected ? colors.brand.primary : colors.surface.subtle,
                  color: isSelected ? '#FFFFFF' : colors.text.primary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: isSelected ? colors.brand.primaryLight : colors.surface.border,
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${colors.brand.accent}`,
                    outlineOffset: '2px',
                  },
                }}
              >
                <span>{st}</span>
                <Box
                  component="span"
                  sx={{
                    px: 0.6,
                    py: 0.1,
                    borderRadius: '9999px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : colors.surface.card,
                    color: isSelected ? '#FFFFFF' : colors.text.secondary,
                  }}
                >
                  {count}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
