import React from 'react';
import { Box, Typography } from '@mui/material';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { colors } from '../../theme/colors';

export interface MedicalNotesCardProps {
  notes?: string;
}

export const MedicalNotesCard: React.FC<MedicalNotesCardProps> = ({
  notes = 'No known medical information provided.',
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2.5, sm: 3 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 1, borderBottom: `1px solid ${colors.surface.border}` }}>
        <MedicalServicesOutlinedIcon sx={{ fontSize: 20, color: colors.brand.accent }} />
        <Typography
          variant="h2"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: colors.text.primary,
            letterSpacing: '-0.01em',
          }}
        >
          Medical Notes
        </Typography>
      </Box>

      {/* Note Display Container */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.25,
          p: 2,
          borderRadius: '6px',
          backgroundColor: colors.surface.subtle,
          border: `1px solid ${colors.surface.border}`,
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted, mt: 0.25, flexShrink: 0 }} />
        <Box>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: colors.text.primary,
              lineHeight: 1.5,
              mb: 0.5,
            }}
          >
            {notes}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, lineHeight: 1.4 }}>
            Information provided by the rider for on-course safety and emergency medical support.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
