import React from 'react';
import { Box, Typography } from '@mui/material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';

export interface ReportEmptyStateProps {
  onGenerateReport: () => void;
}

export const ReportEmptyState: React.FC<ReportEmptyStateProps> = ({
  onGenerateReport,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: colors.brand.accentLight,
          color: colors.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          boxShadow: '0 2px 4px 0 rgba(2, 132, 199, 0.08)',
        }}
      >
        <AssessmentOutlinedIcon sx={{ fontSize: 30 }} />
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.125rem', sm: '1.25rem' },
          fontWeight: 800,
          color: colors.text.primary,
          letterSpacing: '-0.01em',
          mb: 1,
        }}
      >
        No Reports Available
      </Typography>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          maxWidth: 440,
          lineHeight: 1.5,
          mb: 3,
        }}
      >
        There are no generated reports for this event yet. Generate a report to
        analyze rider timing, station passings, and safety reconciliation.
      </Typography>

      <RideButton
        variant="primary"
        onClick={onGenerateReport}
        startIcon={<AddOutlinedIcon sx={{ fontSize: 18 }} />}
      >
        Generate Report
      </RideButton>
    </Box>
  );
};
