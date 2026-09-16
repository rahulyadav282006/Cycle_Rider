import React from 'react';
import { Box, TextField, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';

export interface OrganizerFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onAddOrganizer: () => void;
}

export const OrganizerFilters: React.FC<OrganizerFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddOrganizer,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 2.5,
      }}
    >
      <Box sx={{ display: 'flex', flex: 1, gap: 1.5, flexWrap: 'wrap' }}>
        {/* Search Field */}
        <TextField
          size="small"
          placeholder="Search by organizer name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            minWidth: { xs: '100%', sm: 280, md: 340 },
            backgroundColor: '#FFFFFF',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '0.875rem',
              '& fieldset': {
                borderColor: colors.surface.border,
              },
              '&:hover fieldset': {
                borderColor: colors.surface.borderStrong,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary.main,
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: colors.text.muted }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Status Filter */}
        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          sx={{
            minWidth: 140,
            backgroundColor: '#FFFFFF',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '0.875rem',
              '& fieldset': {
                borderColor: colors.surface.border,
              },
            },
          }}
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Box>

      {/* Top Action */}
      <Box sx={{ flexShrink: 0 }}>
        <RideButton variant="primary" size="sm" onClick={onAddOrganizer}>
          <PersonAddAlt1OutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
          + Add Organizer
        </RideButton>
      </Box>
    </Box>
  );
};
