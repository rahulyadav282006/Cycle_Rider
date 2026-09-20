import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import * as XLSX from 'xlsx';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';
import { reportService } from '../../api/services';

export type ExportDialogState = 'default' | 'exporting' | 'success' | 'error';

export interface ReportExportDialogProps {
  open: boolean;
  onClose: () => void;
  eventId?: string;
  reportName?: string;
  eventName?: string;
  initialState?: ExportDialogState;
}

export const ReportExportDialog: React.FC<ReportExportDialogProps> = ({
  open,
  onClose,
  eventId,
  reportName = 'Rider List Report',
  eventName = 'Cycling Event',
  initialState = 'default',
}) => {
  const [format, setFormat] = useState<'CSV' | 'Excel'>('CSV');
  const [dialogState, setDialogState] = useState<ExportDialogState>(initialState);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  // Reset dialog on open/close
  React.useEffect(() => {
    if (open) {
      setDialogState(initialState);
      setShareSuccess(false);
    }
  }, [open, initialState]);

  const getTypeKey = () => {
    return reportName.toLowerCase().includes('rider')
      ? 'rider_list'
      : reportName.toLowerCase().includes('checkpoint')
      ? 'checkpoint_summary'
      : reportName.toLowerCase().includes('finish')
      ? 'finishers'
      : reportName.toLowerCase().includes('dnf')
      ? 'dnf'
      : reportName.toLowerCase().includes('safe')
      ? 'home_safe'
      : 'event_summary';
  };

  const handleStartExport = async () => {
    if (!eventId) {
      setDialogState('error');
      return;
    }

    setDialogState('exporting');
    try {
      const typeKey = getTypeKey();

      if (format === 'Excel') {
        const reportData = await reportService.getReport(eventId, typeKey);
        const items = reportData?.items || [];
        const ws = items.length > 0
          ? XLSX.utils.json_to_sheet(items)
          : XLSX.utils.json_to_sheet([reportData || { message: 'No data' }]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, `${typeKey}_report_${eventId}.xlsx`);
        setDialogState('success');
      } else {
        const blob = await reportService.downloadCsv(eventId, typeKey);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${typeKey}_report_${eventId}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setDialogState('success');
      }
    } catch {
      setDialogState('error');
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      // Fallback copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch {
        // ignore
      }
      return;
    }

    try {
      await navigator.share({
        title: `${reportName} — ${eventName}`,
        text: `Official report for ${eventName}: ${reportName}`,
        url: window.location.href,
      });
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch {
      // ignore user cancel
    }
  };

  return (
    <Dialog
      open={open}
      onClose={dialogState === 'exporting' ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '8px',
            border: `1px solid ${colors.surface.border}`,
            boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.1)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: colors.brand.accentLight,
              color: colors.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileDownloadOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: '1.125rem',
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: '-0.01em',
            }}
          >
            Export Report
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          disabled={dialogState === 'exporting'}
          sx={{
            color: colors.text.muted,
            '&:hover': { color: colors.text.primary, backgroundColor: colors.surface.subtle },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Body */}
      <DialogContent sx={{ p: 2.5 }}>
        {shareSuccess && (
          <Alert
            severity="info"
            sx={{ mb: 2, borderRadius: '6px', fontWeight: 600, fontSize: '0.8125rem' }}
          >
            Report link copied / shared!
          </Alert>
        )}

        {/* Success Alert Banner */}
        {dialogState === 'success' && (
          <Alert
            severity="success"
            icon={<CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />}
            sx={{ mb: 2, borderRadius: '6px', fontWeight: 600, fontSize: '0.8125rem' }}
          >
            Report exported successfully.
          </Alert>
        )}

        {/* Error Alert Banner */}
        {dialogState === 'error' && (
          <Alert
            severity="error"
            icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />}
            sx={{ mb: 2, borderRadius: '6px', fontWeight: 600, fontSize: '0.8125rem' }}
          >
            Unable to export report. Please try again.
          </Alert>
        )}

        {/* Report & Event Info Box */}
        <Box
          sx={{
            p: 2,
            backgroundColor: colors.surface.page,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '6px',
            mb: 2.5,
          }}
        >
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 500 }}>
              Report:
            </Typography>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.text.primary }}>
              {reportName}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 500 }}>
              Event:
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
              {eventName}
            </Typography>
          </Box>
        </Box>

        {/* Format Selector */}
        <Box>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>
            Format:
          </Typography>
          <RadioGroup
            value={format}
            onChange={(e) => setFormat(e.target.value as 'CSV' | 'Excel')}
            sx={{ gap: 1 }}
          >
            <FormControlLabel
              value="CSV"
              control={
                <Radio
                  size="small"
                  disabled={dialogState === 'exporting'}
                  sx={{
                    color: colors.surface.borderStrong,
                    '&.Mui-checked': { color: colors.primary.main },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                  CSV (.csv)
                </Typography>
              }
            />
            <FormControlLabel
              value="Excel"
              control={
                <Radio
                  size="small"
                  disabled={dialogState === 'exporting'}
                  sx={{
                    color: colors.surface.borderStrong,
                    '&.Mui-checked': { color: colors.primary.main },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                  Excel (.xlsx)
                </Typography>
              }
            />
          </RadioGroup>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 2,
          borderTop: `1px solid ${colors.surface.border}`,
          justifyContent: 'flex-end',
          gap: 1.25,
        }}
      >
        <RideButton
          variant="secondary"
          onClick={handleShare}
          disabled={dialogState === 'exporting'}
          startIcon={<ShareOutlinedIcon sx={{ fontSize: 16 }} />}
        >
          Share
        </RideButton>

        <RideButton variant="secondary" onClick={onClose} disabled={dialogState === 'exporting'}>
          {dialogState === 'success' ? 'Close' : 'Cancel'}
        </RideButton>

        {dialogState === 'error' ? (
          <RideButton variant="primary" onClick={handleStartExport}>
            Try Again
          </RideButton>
        ) : dialogState === 'success' ? (
          <RideButton variant="primary" onClick={onClose}>
            Done
          </RideButton>
        ) : (
          <RideButton
            variant="primary"
            onClick={handleStartExport}
            disabled={dialogState === 'exporting'}
            startIcon={
              dialogState === 'exporting' ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
              )
            }
          >
            {dialogState === 'exporting' ? 'Exporting...' : 'Export Report'}
          </RideButton>
        )}
      </DialogActions>
    </Dialog>
  );
};
