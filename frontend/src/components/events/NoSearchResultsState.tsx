import React from 'react';
import { Box, Typography } from '@mui/material';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface NoSearchResultsStateProps {
  onClearFilters: () => void;
}

export const NoSearchResultsState: React.FC<NoSearchResultsStateProps> = ({ onClearFilters }) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        py: { xs: 6, sm: 8 },
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: colors.surface.subtle,
          border: `1px solid ${colors.surface.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.text.muted,
          mb: 2,
        }}
      >
        <SearchOffOutlinedIcon sx={{ fontSize: 28 }} />
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: colors.text.primary,
          mb: 0.75,
        }}
      >
        No events found
      </Typography>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          maxWidth: 360,
          mb: 2.5,
          lineHeight: 1.4,
        }}
      >
        Try changing your search or status filter.
      </Typography>

      <RideButton
        variant="secondary"
        size="sm"
        startIcon={<RefreshIcon />}
        onClick={onClearFilters}
        sx={{
          minHeight: 38,
          fontWeight: 600,
        }}
      >
        Clear Filters
      </RideButton>
    </Box>
  );
};
