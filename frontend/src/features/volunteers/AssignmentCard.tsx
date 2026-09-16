import React from 'react';
import { Box, Typography } from '@mui/material';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { colors } from '../../theme/colors';
import { TodayAssignment } from './VolunteerMockData';

export interface AssignmentCardProps {
  assignment: TodayAssignment;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const details = [
    {
      label: 'Event',
      value: assignment.event,
      icon: <EventAvailableOutlinedIcon sx={{ fontSize: 16, color: colors.brand.accent }} />,
    },
    {
      label: 'Date',
      value: assignment.date,
      icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Location',
      value: assignment.location,
      icon: <PlaceOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Ride Distance',
      value: assignment.distance,
      icon: <DirectionsBikeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Volunteer',
      value: assignment.volunteer,
      icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 1.5,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: colors.text.muted,
          }}
        >
          Today's Assignment
        </Typography>

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.25,
            py: 0.25,
            borderRadius: '9999px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#1D4ED8',
            fontSize: '0.6875rem',
            fontWeight: 700,
          }}
        >
          Active Event
        </Box>
      </Box>

      {/* Grid of details */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: '1.2fr 1fr 1fr 1fr 1fr',
          },
          gap: 2,
        }}
      >
        {details.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {item.icon}
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: colors.text.muted,
                }}
              >
                {item.label}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: idx === 0 ? '0.9375rem' : '0.875rem',
                fontWeight: idx === 0 || idx === 4 ? 700 : 600,
                color: colors.text.primary,
                pl: 2.75,
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
