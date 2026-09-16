import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';
import { qrCodeService, QrCodeData, QrAnalyticsData } from '../../api/services';

export const DynamicQrWidget: React.FC = () => {
  const [destinationUrl, setDestinationUrl] = useState<string>('https://newrider.com');
  const [urlError, setUrlError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshingAnalytics, setRefreshingAnalytics] = useState<boolean>(false);
  const [qrData, setQrData] = useState<QrCodeData | null>(null);
  const [analytics, setAnalytics] = useState<QrAnalyticsData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate initial QR code on mount
  useEffect(() => {
    let isMounted = true;
    const initQr = async () => {
      setLoading(true);
      try {
        const res = await qrCodeService.generateQrCode({
          destinationUrl: 'https://newrider.com',
          title: 'Project New Rider Portal',
        });
        if (isMounted) {
          setQrData(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    initQr();
    return () => {
      isMounted = false;
    };
  }, []);

  // Poll analytics periodically if shortId exists
  const fetchAnalytics = async (shortId: string) => {
    try {
      setRefreshingAnalytics(true);
      const data = await qrCodeService.getQrAnalytics(shortId);
      setAnalytics(data);
    } catch (err) {
      // Graceful fallback
    } finally {
      setRefreshingAnalytics(false);
    }
  };

  useEffect(() => {
    if (!qrData?.shortId) return;
    fetchAnalytics(qrData.shortId);
    const interval = setInterval(() => {
      fetchAnalytics(qrData.shortId);
    }, 10000); // Check scans every 10s
    return () => clearInterval(interval);
  }, [qrData?.shortId]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = destinationUrl.trim();
    if (!cleanUrl) {
      setUrlError('Destination URL is required.');
      return;
    }

    try {
      // Basic URL format validation
      new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      setUrlError('');
    } catch {
      setUrlError('Please enter a valid URL (e.g. https://newrider.com/events).');
      return;
    }

    setLoading(true);
    try {
      const res = await qrCodeService.generateQrCode({
        destinationUrl: cleanUrl,
        title: 'New Rider Dynamic Link',
      });
      setQrData(res);
      setAnalytics({
        shortId: res.shortId,
        destinationUrl: res.destinationUrl,
        trackingUrl: res.trackingUrl,
        totalScans: res.totalScans,
        scans: [],
        createdAt: res.createdAt,
        updatedAt: res.createdAt,
      });
      setToastMessage(`Dynamic QR Code generated with tracking ID: ${res.shortId}`);
    } catch (err: any) {
      setUrlError(err?.message || 'Failed to generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!qrData?.shortId) return;
    try {
      await qrCodeService.downloadQrSvg(qrData.shortId, 'new-rider-qr.svg');
      setToastMessage('Vector QR code downloaded successfully as new-rider-qr.svg');
    } catch (err: any) {
      setToastMessage('Failed to download SVG file.');
    }
  };

  const handlePrint = () => {
    if (!qrData) return;
    window.print();
  };

  const handleCopyTrackingUrl = () => {
    if (!qrData?.trackingUrl) return;
    navigator.clipboard.writeText(qrData.trackingUrl);
    setCopied(true);
    setToastMessage('Redirect tracking URL copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const svgSrc = qrData
    ? `/api/v1/qr/${qrData.shortId}/svg`
    : `/api/v1/qr/direct/svg?url=${encodeURIComponent(destinationUrl || 'https://newrider.com')}`;

  const currentScans = analytics?.totalScans ?? qrData?.totalScans ?? 0;
  const recentScan = analytics?.scans && analytics.scans.length > 0
    ? analytics.scans[analytics.scans.length - 1]
    : null;

  return (
    <>
      {/* CSS Print Stylesheet Block */}
      <style>{`
        @media print {
          /* Hide non-print elements */
          body * {
            visibility: hidden !important;
          }
          /* Isolate and format dedicated printable QR sheet */
          #new-rider-print-qr-section,
          #new-rider-print-qr-section * {
            visibility: visible !important;
          }
          #new-rider-print-qr-section {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            background: #ffffff !important;
            padding: 40px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Dashboard Widget Container */}
      <Box
        className="no-print"
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '12px',
          p: { xs: 2.5, md: 3.5 },
          mb: 3,
          boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
        }}
      >
        {/* Widget Header */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            pb: 2.5,
            mb: 3,
            borderBottom: `1px solid ${colors.surface.border}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                backgroundColor: 'rgba(42, 20, 180, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.brand.primary,
              }}
            >
              <QrCode2OutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: colors.text.primary,
                  letterSpacing: '-0.01em',
                }}
              >
                Dynamic QR Code System
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                Production-grade in-memory vector streaming, download, print, & scan analytics
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<SecurityOutlinedIcon sx={{ fontSize: '14px !important' }} />}
              label="Level H Resilience (30%)"
              size="small"
              sx={{
                backgroundColor: 'rgba(5, 150, 105, 0.08)',
                color: '#059669',
                fontWeight: 600,
                fontSize: '0.75rem',
                border: '1px solid rgba(5, 150, 105, 0.2)',
              }}
            />
            <Chip
              label="Quiet Zone 4M"
              size="small"
              sx={{
                backgroundColor: 'rgba(42, 20, 180, 0.06)',
                color: colors.brand.primary,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Box>

        {/* Form and Viewport Layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
            gap: 3.5,
            alignItems: 'start',
          }}
        >
          {/* Left Column: URL Input & Actions & Tracking Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box component="form" onSubmit={handleGenerate} noValidate>
              <Typography
                component="label"
                htmlFor="destination-url-input"
                sx={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 1,
                }}
              >
                Destination URL
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <TextField
                  id="destination-url-input"
                  fullWidth
                  size="small"
                  value={destinationUrl}
                  onChange={(e) => {
                    setDestinationUrl(e.target.value);
                    if (urlError) setUrlError('');
                  }}
                  placeholder="e.g. https://newrider.com/events/kolhapur-2026"
                  error={Boolean(urlError)}
                  helperText={urlError || 'Point camera to this target via instant dynamic redirection'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: colors.brand.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.brand.primary,
                      },
                    },
                  }}
                />
                <RideButton
                  variant="primary"
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <QrCode2OutlinedIcon />}
                  sx={{ height: 40, px: 3, flexShrink: 0 }}
                >
                  {loading ? 'Generating...' : 'Generate'}
                </RideButton>
              </Box>
            </Box>

            {/* Scan Lifecycle / Analytics Strip */}
            {qrData && (
              <Box
                sx={{
                  backgroundColor: '#F8FAFC',
                  border: `1px solid ${colors.surface.border}`,
                  borderRadius: '10px',
                  p: 2.5,
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SensorsOutlinedIcon sx={{ fontSize: 20, color: colors.brand.primary }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: colors.text.primary }}>
                      Scan Tracking Lifecycle
                    </Typography>
                  </Box>
                  <Tooltip title="Refresh scan metrics">
                    <IconButton
                      size="small"
                      onClick={() => qrData?.shortId && fetchAnalytics(qrData.shortId)}
                      disabled={refreshingAnalytics}
                    >
                      <RefreshOutlinedIcon
                        sx={{
                          fontSize: 18,
                          animation: refreshingAnalytics ? 'spin 1s linear infinite' : 'none',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, textTransform: 'uppercase', fontWeight: 600 }}>
                      Total Scans
                    </Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: colors.brand.primary }}>
                      {currentScans}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, textTransform: 'uppercase', fontWeight: 600 }}>
                      Short Identifier
                    </Typography>
                    <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.text.primary, mt: 0.5 }}>
                      {qrData.shortId}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 2', sm: 'span 1' } }}>
                    <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, textTransform: 'uppercase', fontWeight: 600 }}>
                      Redirect Status
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#059669', mt: 0.5 }}>
                      HTTP 302 Active
                    </Typography>
                  </Box>
                </Box>

                {/* Tracking URL with Copy */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${colors.surface.border}`,
                    borderRadius: '6px',
                    px: 1.5,
                    py: 1,
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      fontFamily: 'monospace',
                      color: colors.text.secondary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {qrData.trackingUrl}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <Tooltip title={copied ? 'Copied!' : 'Copy tracking link'}>
                      <IconButton size="small" onClick={handleCopyTrackingUrl}>
                        {copied ? (
                          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16, color: '#059669' }} />
                        ) : (
                          <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Test redirect in new tab">
                      <IconButton
                        size="small"
                        component="a"
                        href={qrData.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {recentScan && (
                  <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, mt: 1.5 }}>
                    Latest scan: {new Date(recentScan.timestamp).toLocaleTimeString()} ({recentScan.userAgent.slice(0, 30)}...)
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Right Column: Visual Canvas Viewport Preview Card */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FAFAFA',
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '12px',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.secondary, mb: 1.5 }}>
              VECTOR CANVAS VIEWPORT
            </Typography>

            {/* Infinite Sharp Scalable SVG Container */}
            <Box
              sx={{
                width: 220,
                height: 220,
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: `2px solid ${colors.brand.primary}`,
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1.5,
                mb: 2,
                position: 'relative',
              }}
            >
              {loading ? (
                <CircularProgress size={36} sx={{ color: colors.brand.primary }} />
              ) : (
                <Box
                  component="img"
                  src={svgSrc}
                  alt="Dynamic New Rider QR Code"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    // Infinitely sharp SVG rendering
                    imageRendering: 'crisp-edges',
                  }}
                />
              )}
            </Box>

            {/* Preview Destination Label */}
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: colors.text.secondary,
                maxWidth: 240,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 2.5,
              }}
              title={destinationUrl}
            >
              Target: {destinationUrl}
            </Typography>

            {/* Action Buttons: Download SVG & Print QR */}
            <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
              <RideButton
                variant="secondary"
                size="sm"
                fullWidth
                onClick={handleDownload}
                disabled={!qrData || loading}
                startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{ fontSize: '0.8125rem' }}
              >
                Download SVG
              </RideButton>

              <RideButton
                variant="primary"
                size="sm"
                fullWidth
                onClick={handlePrint}
                disabled={!qrData || loading}
                startIcon={<PrintOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{ fontSize: '0.8125rem' }}
              >
                Print QR
              </RideButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* DEDICATED PRINTABLE TARGET BLOCK (Formatted for physical paper printout) */}
      <Box
        id="new-rider-print-qr-section"
        sx={{
          display: 'none', // Hidden during screen display, isolated and visible via @media print
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '500px',
            border: '2px dashed #0F172A',
            borderRadius: '16px',
            p: 5,
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Print Header */}
          <Typography
            sx={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            PROJECT NEW RIDER
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mb: 3,
            }}
          >
            Dynamic Checkpoint & Portal Pass
          </Typography>

          {/* High-Resolution SVG Stream for Print */}
          <Box
            sx={{
              width: 300,
              height: 300,
              border: '3px solid #0F172A',
              borderRadius: '12px',
              p: 2,
              mb: 3,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Box
              component="img"
              src={svgSrc}
              alt="Printable QR Code"
              sx={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />
          </Box>

          {/* Identifier and Details */}
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#0F172A',
              mb: 1,
            }}
          >
            Tracking ID: {qrData?.shortId || 'New Rider'}
          </Typography>
          <Typography
            sx={{
              fontSize: '12px',
              color: '#64748B',
              mb: 2,
              wordBreak: 'break-all',
              maxWidth: '380px',
            }}
          >
            Destination: {destinationUrl}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              borderTop: '1px solid #E2E8F0',
              pt: 2,
              mt: 1,
            }}
          >
            <Typography sx={{ fontSize: '10px', color: '#64748B' }}>
              ✓ High Error Correction (Level H - 30% Damage Resilience)
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#64748B' }}>
              ✓ Standard 4-Module Quiet Zone
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User Toast Notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="success"
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
