import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { colors } from '../../theme/colors';
import { PlatformStatItem } from './mockAdminData';

export interface AdminDashboardStatsProps {
  stats: PlatformStatItem[];
}

export const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({ stats }) => {
  const getStatIcon = (id: string) => {
    if (id.includes('organizer') || id.includes('org')) {
      return <PeopleAltOutlinedIcon sx={{ fontSize: 24, color: colors.primary.main }} />;
    }
    if (id.includes('active') || id.includes('act')) {
      return <SensorsOutlinedIcon sx={{ fontSize: 24, color: '#10B981' }} />;
    }
    if (id.includes('rider') || id.includes('rid')) {
      return <DirectionsBikeOutlinedIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />;
    }
    return <EventAvailableOutlinedIcon sx={{ fontSize: 24, color: '#0284C7' }} />;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2.5,
        mb: 3.5,
      }}
    >
      {stats.map((item) => (
        <Card
          key={item.id}
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            '&:hover': {
              boxShadow: '0 4px 12px 0 rgba(15, 23, 42, 0.08)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {item.label}
              </Typography>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '8px',
                  backgroundColor: colors.surface.subtle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${colors.surface.border}`,
                }}
              >
                {getStatIcon(item.id)}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: colors.text.primary,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {item.value}
              </Typography>
              {item.change && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.35,
                    px: 1,
                    py: 0.25,
                    borderRadius: '9999px',
                    backgroundColor:
                      item.changeType === 'positive'
                        ? '#ECFDF5'
                        : item.changeType === 'negative'
                        ? '#FEF2F2'
                        : colors.surface.subtle,
                    color:
                      item.changeType === 'positive'
                        ? '#065F46'
                        : item.changeType === 'negative'
                        ? '#991B1B'
                        : colors.text.secondary,
                    border: `1px solid ${
                      item.changeType === 'positive'
                        ? '#A7F3D0'
                        : item.changeType === 'negative'
                        ? '#FECACA'
                        : colors.surface.border
                    }`,
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 12 }} />
                  {item.change}
                </Box>
              )}
            </Box>

            {item.subtext && (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: colors.text.muted,
                  lineHeight: 1.4,
                }}
              >
                {item.subtext}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
