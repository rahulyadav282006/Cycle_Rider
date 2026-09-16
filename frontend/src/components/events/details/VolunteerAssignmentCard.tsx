import React from 'react';
import { Box, Typography } from '@mui/material';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { colors } from '../../../theme/colors';

export interface VolunteerAssignmentCardProps {
  assigned: number;
  totalNeeded: number;
  onManageVolunteers: () => void;
}

export const VolunteerAssignmentCard: React.FC<VolunteerAssignmentCardProps> = ({
  assigned,
  totalNeeded,
  onManageVolunteers,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.borderStrong}`,
        borderRadius: '8px',
        p: { xs: 2.5, md: 3 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BadgeOutlinedIcon sx={{ fontSize: 20, color: colors.primary.main }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1rem',
                color: colors.text.primary,
              }}
            >
              Volunteer Assignment
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: colors.primary.main,
              backgroundColor: '#EFF6FF',
              px: 1.25,
              py: 0.25,
              borderRadius: '12px',
            }}
          >
            {assigned} / {totalNeeded} Assigned
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary.main,
            }}
          >
            <CheckCircleOutlinedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.text.primary }}>
              Active Support Coverage
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              8 checkpoints staffed with dedicated field volunteers.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        component="button"
        type="button"
        onClick={onManageVolunteers}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          color: colors.primary.main,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          p: 0,
          mt: 2,
          fontWeight: 700,
          fontSize: '0.875rem',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        Assign volunteers to checkpoints
        <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
      </Box>
    </Box>
  );
};
