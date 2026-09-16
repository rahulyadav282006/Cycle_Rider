import React from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';

export interface ReportToolbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (val: string) => void;
  statusOptions?: string[];
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onBackToReports?: () => void;
  showBack?: boolean;
}

export const ReportToolbar: React.FC<ReportToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search rider by name or ID...',
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  onExportCsv,
  onExportExcel,
  onBackToReports,
  showBack = true,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 2.5,
      }}
    >
      {/* Left: Search & Filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, flexWrap: 'wrap' }}>
        {showBack && onBackToReports && (
          <RideButton
            variant="secondary"
            size="sm"
            onClick={onBackToReports}
            startIcon={<ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />}
          >
            Back to Reports
          </RideButton>
        )}

        {onSearchChange && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 40,
              px: 1.5,
              minWidth: { xs: '100%', sm: 260 },
              flex: { sm: 1 },
              maxWidth: 400,
              backgroundColor: '#FFFFFF',
              border: `1px solid ${colors.surface.borderStrong}`,
              borderRadius: '6px',
              '&:focus-within': {
                borderColor: colors.brand.accent,
                boxShadow: '0 0 0 2px rgba(2, 132, 199, 0.15)',
              },
            }}
          >
            <SearchOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted, mr: 1 }} />
            <Box
              component="input"
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
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
        )}

        {statusOptions && onStatusFilterChange && (
          <Box sx={{ minWidth: 150 }}>
            <Select
              fullWidth
              size="small"
              value={statusFilter || statusOptions[0]}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              sx={{
                height: 40,
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '0.875rem',
                '& fieldset': { borderColor: colors.surface.borderStrong },
                '&:hover fieldset': { borderColor: colors.text.secondary },
              }}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Box>

      {/* Right: Export Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
        {onExportCsv && (
          <RideButton
            variant="secondary"
            size="sm"
            onClick={onExportCsv}
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
          >
            Export CSV
          </RideButton>
        )}

        {onExportExcel && (
          <RideButton
            variant="secondary"
            size="sm"
            onClick={onExportExcel}
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
          >
            Export Excel
          </RideButton>
        )}
      </Box>
    </Box>
  );
};
