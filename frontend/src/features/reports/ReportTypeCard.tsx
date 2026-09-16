import React from 'react';
import { Box, Typography } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';
import { ReportTypeItem } from './mockReportsData';

export interface ReportTypeCardProps {
  report: ReportTypeItem;
  onView: () => void;
}

export const ReportTypeCard: React.FC<ReportTypeCardProps> = ({ report, onView }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'riders':
        return <PeopleAltOutlinedIcon sx={{ fontSize: 22, color: colors.primary.main }} />;
      case 'checkpoints':
        return <PlaceOutlinedIcon sx={{ fontSize: 22, color: '#0284C7' }} />;
      case 'finishers':
        return <EmojiEventsOutlinedIcon sx={{ fontSize: 22, color: '#D97706' }} />;
      case 'dnf':
        return <WarningAmberOutlinedIcon sx={{ fontSize: 22, color: colors.status.error.dot }} />;
      case 'home_safe':
        return <HomeOutlinedIcon sx={{ fontSize: 22, color: '#059669' }} />;
      case 'event_summary':
      default:
        return <AssessmentOutlinedIcon sx={{ fontSize: 22, color: colors.primary.main }} />;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2.25, sm: 2.5 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.15s ease-in-out',
        '&:hover': {
          borderColor: colors.surface.borderStrong,
          boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.06)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Box>
        {/* Card Header: Icon & Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '8px',
              backgroundColor: colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getIcon(report.iconType)}
          </Box>

          {report.badge && (
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '4px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                backgroundColor: colors.surface.subtle,
                color: colors.text.secondary,
                border: `1px solid ${colors.surface.border}`,
              }}
            >
              {report.badge}
            </Box>
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontSize: '1rem',
            fontWeight: 800,
            color: colors.text.primary,
            letterSpacing: '-0.01em',
            mb: 0.75,
          }}
        >
          {report.title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            lineHeight: 1.45,
            mb: 2.5,
          }}
        >
          {report.description}
        </Typography>
      </Box>

      {/* Action Button: View Report */}
      <Box sx={{ pt: 1, borderTop: `1px solid ${colors.surface.subtle}` }}>
        <RideButton
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onView}
          endIcon={<ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />}
        >
          View Report
        </RideButton>
      </Box>
    </Box>
  );
};
