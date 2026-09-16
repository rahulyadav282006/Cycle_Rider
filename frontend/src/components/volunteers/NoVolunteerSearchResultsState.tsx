import React from 'react';
import { Box, Typography } from '@mui/material';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface NoVolunteerSearchResultsStateProps {
  onClearFilters: () => void;
}

export const NoVolunteerSearchResultsState: React.FC<NoVolunteerSearchResultsStateProps> = ({
  onClearFilters,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        py: { xs: 7, sm: 9 },
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
          width: 60,
          height: 60,
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
        <SearchOffOutlinedIcon sx={{ fontSize: 30 }} />
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.125rem', sm: '1.25rem' },
          fontWeight: 700,
          color: colors.text.primary,
          letterSpacing: '-0.01em',
          mb: 0.75,
        }}
      >
        No Volunteers Found
      </Typography>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          maxWidth: 420,
          lineHeight: 1.5,
          mb: 2.5,
        }}
      >
        No volunteers match your search query or filter criteria. Try adjusting your filters or search keywords.
      </Typography>

      <RideButton
        variant="secondary"
        size="sm"
        startIcon={<FilterAltOffOutlinedIcon fontSize="small" />}
        onClick={onClearFilters}
        sx={{
          fontWeight: 600,
          minHeight: 38,
          px: 2.5,
        }}
      >
        Clear Filters
      </RideButton>
    </Box>
  );
};
