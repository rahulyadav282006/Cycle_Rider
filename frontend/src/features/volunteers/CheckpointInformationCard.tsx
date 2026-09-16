import React from 'react';
import { Box, Typography } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { colors } from '../../theme/colors';
import { AssignedCheckpoint } from './VolunteerMockData';

export interface CheckpointInformationCardProps {
  checkpoint: AssignedCheckpoint;
}

export const CheckpointInformationCard: React.FC<CheckpointInformationCardProps> = ({
  checkpoint,
}) => {
  const fields = [
    {
      label: 'Checkpoint',
      value: checkpoint.name,
      icon: <LocationOnOutlinedIcon sx={{ fontSize: 16, color: colors.brand.accent }} />,
    },
    {
      label: 'Sequence',
      value: checkpoint.sequence,
      icon: <FormatListNumberedOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Type',
      value: checkpoint.type,
      icon: <CategoryOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Assignment',
      value: checkpoint.assignmentType,
      icon: <BadgeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Status',
      value: checkpoint.readinessStatus,
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#10B981' }} />,
      isStatus: true,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 2.5 },
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontSize: '0.8125rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: colors.text.muted,
          mb: 2,
          pb: 1,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        Checkpoint Information
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: 2,
        }}
      >
        {fields.map((field, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              p: 1.25,
              borderRadius: '6px',
              backgroundColor: colors.surface.page,
              border: `1px solid ${colors.surface.border}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {field.icon}
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: colors.text.muted,
                  letterSpacing: '0.04em',
                }}
              >
                {field.label}
              </Typography>
            </Box>

            {field.isStatus ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pl: 0.25 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#065F46',
                  }}
                >
                  {field.value}
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: colors.text.primary,
                  pl: 0.25,
                }}
              >
                {field.value}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
