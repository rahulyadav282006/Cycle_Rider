import React from 'react';
import { Box, Typography } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface VolunteersPageHeaderProps {
  onAssignVolunteer: () => void;
  isEmptyState?: boolean;
  onToggleEmptyState?: () => void;
}

export const VolunteersPageHeader: React.FC<VolunteersPageHeaderProps> = ({
  onAssignVolunteer,
  isEmptyState = false,
  onToggleEmptyState,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      {/* Title & Supporting Subtitle */}
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            fontWeight: 700,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          Volunteers
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.4,
          }}
        >
          Assign volunteers to checkpoints and manage event support staff.
        </Typography>
      </Box>

      {/* Right Side Actions: Empty State Switcher + [ + Assign Volunteer ] CTA */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          flexWrap: 'wrap',
        }}
      >
        {onToggleEmptyState && (
          <RideButton
            variant="secondary"
            size="sm"
            onClick={onToggleEmptyState}
            startIcon={
              isEmptyState ? (
                <LayersOutlinedIcon fontSize="small" />
              ) : (
                <VisibilityOutlinedIcon fontSize="small" />
              )
            }
            sx={{
              minHeight: 40,
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap',
              borderColor: colors.surface.borderStrong,
            }}
          >
            {isEmptyState ? 'Populated View' : 'Preview Empty State'}
          </RideButton>
        )}

        <RideButton
          variant="primary"
          size="md"
          startIcon={<PersonAddOutlinedIcon />}
          onClick={onAssignVolunteer}
          sx={{
            minHeight: 44,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.12)',
          }}
        >
          + Assign Volunteer
        </RideButton>
      </Box>
    </Box>
  );
};
