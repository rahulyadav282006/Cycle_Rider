import React from 'react';
import { Box, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { colors } from '../../theme/colors';

export interface RidersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const RidersPagination: React.FC<RidersPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const startIdx = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalCount);

  // Generate visible page numbers (e.g., 1, 2, 3)
  const pages = Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mt: 2.5,
        px: { xs: 1, sm: 1.5 },
      }}
    >
      {/* Showing 1–10 of 1,248 riders */}
      <Typography
        sx={{
          fontSize: '0.8125rem',
          color: colors.text.secondary,
          textAlign: { xs: 'center', sm: 'left' },
          fontWeight: 500,
        }}
      >
        Showing{' '}
        <Box component="span" sx={{ fontWeight: 700, color: colors.text.primary }}>
          {startIdx}–{endIdx}
        </Box>{' '}
        of{' '}
        <Box component="span" sx={{ fontWeight: 700, color: colors.text.primary }}>
          {totalCount.toLocaleString()}
        </Box>{' '}
        riders
      </Typography>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-end' },
          gap: 1,
        }}
      >
        {/* Previous Button */}
        <Box
          component="button"
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          sx={{
            minHeight: 38,
            minWidth: 44,
            px: 1.5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.borderStrong}`,
            backgroundColor: colors.surface.card,
            color: currentPage <= 1 ? colors.interactive.disabledText : colors.text.primary,
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            '&:hover:not(:disabled)': {
              backgroundColor: colors.surface.subtle,
              borderColor: colors.brand.accent,
            },
            '&:focus-visible': {
              outline: `2px solid ${colors.brand.accent}`,
              outlineOffset: '2px',
            },
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 18 }} />
          <span>Previous</span>
        </Box>

        {/* Page Numbers */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {pages.map((p) => {
            const isSelected = p === currentPage;
            return (
              <Box
                component="button"
                type="button"
                key={p}
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={isSelected ? 'page' : undefined}
                sx={{
                  minWidth: 38,
                  height: 38,
                  borderRadius: '6px',
                  border: `1px solid ${isSelected ? colors.brand.primary : colors.surface.border}`,
                  backgroundColor: isSelected ? colors.brand.primary : colors.surface.card,
                  color: isSelected ? '#FFFFFF' : colors.text.primary,
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  '&:hover:not(:disabled)': {
                    backgroundColor: isSelected ? colors.brand.primaryLight : colors.surface.subtle,
                  },
                }}
              >
                {p}
              </Box>
            );
          })}
        </Box>

        {/* Next Button */}
        <Box
          component="button"
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          sx={{
            minHeight: 38,
            minWidth: 44,
            px: 1.5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.borderStrong}`,
            backgroundColor: colors.surface.card,
            color: currentPage >= totalPages ? colors.interactive.disabledText : colors.text.primary,
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            '&:hover:not(:disabled)': {
              backgroundColor: colors.surface.subtle,
              borderColor: colors.brand.accent,
            },
            '&:focus-visible': {
              outline: `2px solid ${colors.brand.accent}`,
              outlineOffset: '2px',
            },
          }}
        >
          <span>Next</span>
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  );
};
