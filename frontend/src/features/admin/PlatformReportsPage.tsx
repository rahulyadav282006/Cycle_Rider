import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { colors } from '../../theme/colors';
import { AdminDashboardStats } from './AdminDashboardStats';
import { AdminEmptyState } from './AdminEmptyState';
import { RideButton } from '../../components/ui/RideButton';
import {
  MOCK_PLATFORM_REPORTS_STATS,
  MOCK_PLATFORM_REPORT_CARDS,
  MOCK_ADMIN_RECENT_REPORTS,
  PlatformReportCardDef,
} from './mockAdminData';

export type PlatformReportsState = 'populated' | 'empty';

export interface PlatformReportsPageProps {
  onViewReport: (reportId: string) => void;
  onDownloadReport?: (reportName: string) => void;
}

export const PlatformReportsPage: React.FC<PlatformReportsPageProps> = ({
  onViewReport,
  onDownloadReport,
}) => {
  const [prototypeState, setPrototypeState] = useState<PlatformReportsState>('populated');
  const [reportingPeriod, setReportingPeriod] = useState<string>('2026 Season');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getCardIcon = (iconName: PlatformReportCardDef['iconName']) => {
    switch (iconName) {
      case 'organizer':
        return <PeopleAltOutlinedIcon sx={{ fontSize: 24, color: colors.primary.main }} />;
      case 'event':
        return <EventAvailableOutlinedIcon sx={{ fontSize: 24, color: '#10B981' }} />;
      case 'rider':
        return <DirectionsBikeOutlinedIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />;
      case 'summary':
      default:
        return <AssessmentOutlinedIcon sx={{ fontSize: 24, color: '#0284C7' }} />;
    }
  };

  const handleExportReports = () => {
    setToastMessage(`Exporting RideTrack platform reports for ${reportingPeriod}...`);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Prototype State Switcher */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          mb: 3,
          p: 1.25,
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
          <LayersOutlinedIcon sx={{ fontSize: 16, color: colors.primary.main }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: colors.text.secondary,
              textTransform: 'uppercase',
            }}
          >
            Platform Reports States:
          </Typography>
        </Box>
        {(
          [
            { key: 'populated', label: '1. Populated' },
            { key: 'empty', label: '2. Empty State' },
          ] as const
        ).map((st) => {
          const isSelected = prototypeState === st.key;
          return (
            <Box
              key={st.key}
              component="button"
              type="button"
              onClick={() => setPrototypeState(st.key)}
              sx={{
                px: 1.25,
                py: 0.35,
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 700 : 500,
                border: '1px solid',
                borderColor: isSelected ? colors.primary.main : colors.surface.borderStrong,
                backgroundColor: isSelected ? colors.brand.accentLight : 'transparent',
                color: isSelected ? colors.primary.dark : colors.text.secondary,
                cursor: 'pointer',
              }}
            >
              {st.label}
            </Box>
          );
        })}
      </Box>

      {/* Header & Export Action */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3.5,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.02em',
              }}
            >
              Platform Reports
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: '9999px',
                backgroundColor: colors.brand.accentLight,
                color: colors.brand.accentHover,
                border: `1px solid #BAE6FD`,
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <ShieldOutlinedIcon sx={{ fontSize: 13 }} />
              Super Admin
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary }}>
            View platform-level reporting across organizers, events, and riders.
          </Typography>
        </Box>

        {/* Date Filter & Export Reports Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            select
            size="small"
            value={reportingPeriod}
            onChange={(e) => setReportingPeriod(e.target.value)}
            sx={{
              minWidth: 150,
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '0.875rem',
              },
            }}
          >
            <MenuItem value="All Time">All Time</MenuItem>
            <MenuItem value="2026 Season">2026 Season</MenuItem>
            <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
          </TextField>

          <RideButton
            variant="primary"
            size="sm"
            onClick={handleExportReports}
          >
            <FileDownloadOutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
            Export Reports
          </RideButton>
        </Box>
      </Box>

      {/* Summary Cards */}
      <AdminDashboardStats stats={MOCK_PLATFORM_REPORTS_STATS} />

      {/* Main Content: Populated or Empty State */}
      {prototypeState === 'empty' ? (
        <AdminEmptyState
          type="report"
          onAction={() => setPrototypeState('populated')}
        />
      ) : (
        <>
          {/* Report Cards Grid */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: colors.text.primary,
                mb: 0.5,
              }}
            >
              Available Platform Reports
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mb: 2.5 }}>
              Select a platform report to review organizer health, event distribution, or participant metrics
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 2.5,
              }}
            >
              {MOCK_PLATFORM_REPORT_CARDS.map((card) => (
                <Card
                  key={card.id}
                  sx={{
                    backgroundColor: colors.surface.card,
                    border: `1px solid ${colors.surface.border}`,
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px 0 rgba(15, 23, 42, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '8px',
                          backgroundColor: colors.surface.subtle,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${colors.surface.border}`,
                        }}
                      >
                        {getCardIcon(card.iconName)}
                      </Box>
                      <Chip
                        size="small"
                        label={reportingPeriod}
                        sx={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          backgroundColor: colors.surface.subtle,
                          color: colors.text.secondary,
                          border: `1px solid ${colors.surface.border}`,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: colors.text.primary,
                        mb: 1,
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        color: colors.text.secondary,
                        lineHeight: 1.4,
                        mb: 2.5,
                        flex: 1,
                      }}
                    >
                      {card.description}
                    </Typography>

                    <RideButton
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => onViewReport(card.id)}
                    >
                      View Report
                      <ArrowForwardOutlinedIcon sx={{ fontSize: 14, ml: 0.5 }} />
                    </RideButton>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Recent Reports Table */}
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: colors.text.primary,
                mb: 0.5,
              }}
            >
              Recent Platform Reports
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mb: 2 }}>
              Log of generated administrative audits and summary exports
            </Typography>

            <TableContainer
              sx={{
                backgroundColor: colors.surface.card,
                border: `1px solid ${colors.surface.border}`,
                borderRadius: '10px',
                boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
                overflowX: 'auto',
              }}
            >
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.surface.subtle }}>
                    <TableCell sx={{ py: 1.5, px: 2.5, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                      Report
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                      Generated
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                      Generated By
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                      Format
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.5, px: 2.5, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_ADMIN_RECENT_REPORTS.map((rep) => (
                    <TableRow
                      key={rep.id}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(241, 245, 249, 0.6)',
                        },
                      }}
                    >
                      <TableCell sx={{ py: 2, px: 2.5, borderBottom: `1px solid ${colors.surface.border}` }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                          {rep.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
                          {rep.reportType} • {rep.size}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 2, px: 2, fontSize: '0.875rem', color: colors.text.secondary, borderBottom: `1px solid ${colors.surface.border}` }}>
                        {rep.generatedDate}
                      </TableCell>

                      <TableCell sx={{ py: 2, px: 2, borderBottom: `1px solid ${colors.surface.border}` }}>
                        <Chip
                          size="small"
                          label={rep.generatedBy}
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: colors.surface.subtle,
                            color: colors.text.secondary,
                            border: `1px solid ${colors.surface.border}`,
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ py: 2, px: 2, borderBottom: `1px solid ${colors.surface.border}` }}>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.25,
                            borderRadius: '4px',
                            backgroundColor:
                              rep.format === 'PDF' ? '#FEF2F2' : rep.format === 'Excel' ? '#ECFDF5' : '#F0F9FF',
                            color:
                              rep.format === 'PDF' ? '#991B1B' : rep.format === 'Excel' ? '#065F46' : '#0369A1',
                            border: `1px solid ${
                              rep.format === 'PDF' ? '#FECACA' : rep.format === 'Excel' ? '#A7F3D0' : '#BAE6FD'
                            }`,
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                          }}
                        >
                          {rep.format}
                        </Box>
                      </TableCell>

                      <TableCell align="right" sx={{ py: 2, px: 2.5, borderBottom: `1px solid ${colors.surface.border}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <RideButton
                            variant="secondary"
                            size="sm"
                            onClick={() => onViewReport(rep.id)}
                          >
                            <VisibilityOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            View
                          </RideButton>
                          <RideButton
                            variant="secondary"
                            size="sm"
                            onClick={() => onDownloadReport && onDownloadReport(rep.name)}
                          >
                            <FileDownloadOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            Download
                          </RideButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
      >
        <Alert severity="success" onClose={() => setToastMessage(null)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
