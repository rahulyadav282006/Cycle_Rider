import React from 'react';
import { Box, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import BarChartIcon from '@mui/icons-material/BarChart';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface QuickActionsProps {
  onActionClick?: (action: { title: string; route: string; desc: string }) => void;
  onCreateEvent?: () => void;
  onRegisterRider?: () => void;
  onOpenScanner?: () => void;
  onNavigateReports?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onActionClick,
  onCreateEvent,
  onRegisterRider,
  onOpenScanner,
  onNavigateReports,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.75,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: '4px',
            backgroundColor: colors.brand.accentLight,
            color: colors.brand.accent,
          }}
        >
          <BoltOutlinedIcon sx={{ fontSize: 16 }} />
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: colors.text.secondary,
          }}
        >
          Quick Actions
        </Typography>
      </Box>

      {/* Action Buttons Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'auto auto auto auto',
          },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        {/* 1. Create Event (Primary Action) */}
        <RideButton
          variant="primary"
          size="md"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            if (onCreateEvent) {
              onCreateEvent();
            } else if (onActionClick) {
              onActionClick({
                title: 'Create Event',
                route: '/events/create',
                desc: 'This will launch the multi-step event creation workflow for course mapping, date settings, and entry quotas.',
              });
            }
          }}
          sx={{
            minHeight: 44, // Minimum touch target 44px
            fontWeight: 700,
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.12)',
            whiteSpace: 'nowrap',
          }}
        >
          Create Event
        </RideButton>

        {/* 2. Register Rider (Secondary Action) */}
        <RideButton
          variant="secondary"
          size="md"
          startIcon={<DirectionsBikeIcon />}
          onClick={() => {
            if (onRegisterRider) {
              onRegisterRider();
            } else if (onActionClick) {
              onActionClick({
                title: 'Register Rider',
                route: '/riders/register',
                desc: 'This will open rider onboarding to assign bib numbers, record emergency contacts, and confirm category entries.',
              });
            }
          }}
          sx={{
            minHeight: 44, // Minimum touch target 44px
            whiteSpace: 'nowrap',
          }}
        >
          Register Rider
        </RideButton>

        {/* 3. Open Scanner (Secondary Action) */}
        <RideButton
          variant="secondary"
          size="md"
          startIcon={<QrCodeScannerIcon />}
          onClick={() => {
            if (onOpenScanner) {
              onOpenScanner();
            } else if (onActionClick) {
              onActionClick({
                title: 'Open Scanner',
                route: '/volunteer/scanner',
                desc: 'This will launch the camera scanner station to log checkpoint passes, start gun times, and finish line stamps.',
              });
            }
          }}
          sx={{
            minHeight: 44, // Minimum touch target 44px
            whiteSpace: 'nowrap',
          }}
        >
          Open Scanner
        </RideButton>

        {/* 4. Reports (Secondary Action) */}
        <RideButton
          variant="secondary"
          size="md"
          startIcon={<BarChartIcon />}
          onClick={() => {
            if (onNavigateReports) {
              onNavigateReports();
            } else if (onActionClick) {
              onActionClick({
                title: 'Reports',
                route: '/reports',
                desc: 'This will generate participation breakdown, checkpoint throughput, and exportable rider completion statistics.',
              });
            }
          }}
          sx={{
            minHeight: 44, // Minimum touch target 44px
            whiteSpace: 'nowrap',
          }}
        >
          Reports
        </RideButton>
      </Box>
    </Box>
  );
};
