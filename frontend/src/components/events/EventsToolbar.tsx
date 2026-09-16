import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../theme/colors';
import { EventStatus } from './mockEventsData';

export type StatusFilterType = 'all' | EventStatus;

export interface EventsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: StatusFilterType;
  onStatusChange: (status: StatusFilterType) => void;
  statusCounts: {
    all: number;
    upcoming: number;
    active: number;
    completed: number;
  };
}

export const EventsToolbar: React.FC<EventsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  statusCounts,
}) => {
  const filterOptions: { id: StatusFilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: statusCounts.all },
    { id: 'upcoming', label: 'Upcoming', count: statusCounts.upcoming },
    { id: 'active', label: 'Active', count: statusCounts.active },
    { id: 'completed', label: 'Completed', count: statusCounts.completed },
  ];

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* 1. Search Events Input */}
      <Box
        sx={{
          width: { xs: '100%', md: 360 },
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
          aria-label="Search Events"
          placeholder="Search by event name or location"
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

      {/* 2. Status Filter Tabs/Pills */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          overflowX: 'auto',
          pb: { xs: 0.5, md: 0 },
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
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Status:
        </Typography>

        {filterOptions.map((opt) => {
          const isSelected = selectedStatus === opt.id;
          return (
            <Box
              component="button"
              type="button"
              key={opt.id}
              onClick={() => onStatusChange(opt.id)}
              sx={{
                minHeight: 38,
                minWidth: 44,
                px: 1.75,
                py: 0.75,
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
              <span>{opt.label}</span>
              <Box
                component="span"
                sx={{
                  px: 0.75,
                  py: 0.1,
                  borderRadius: '9999px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : colors.surface.card,
                  color: isSelected ? '#FFFFFF' : colors.text.secondary,
                }}
              >
                {opt.count}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
