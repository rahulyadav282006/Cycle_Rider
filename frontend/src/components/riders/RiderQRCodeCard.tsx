import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import QRCode from 'qrcode';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface RiderQRCodeCardProps {
  riderId: string;
  paymentRequired?: boolean;
  paymentStatus?: string;
}

export const RiderQRCodeCard: React.FC<RiderQRCodeCardProps> = ({
  riderId,
  paymentRequired: _paymentRequired,
  paymentStatus,
}) => {
  const isPendingPayment = (paymentStatus || '').toLowerCase() === 'pending';
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate genuine standards-compliant QR code encoding ONLY the Rider ID
  useEffect(() => {
    let isMounted = true;
    if (!riderId || isPendingPayment) return;

    // Generate high-resolution QR matrix (Level H: 30% error correction, 4-module quiet zone margin)
    QRCode.toDataURL(riderId, {
      errorCorrectionLevel: 'H',
      margin: 4,
      width: 600, // High-res for download and print
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code data URL:', err);
      });

    // Also draw on local canvas for inline display
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, riderId, {
        errorCorrectionLevel: 'H',
        margin: 4,
        width: 180,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      }).catch((err) => console.error('Failed to draw QR to canvas:', err));
    }

    return () => {
      isMounted = false;
    };
  }, [riderId, isPendingPayment]);

  // Robust trigger download without display:none
  const triggerDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.setAttribute('download', fileName);
    link.style.position = 'fixed';
    link.style.left = '-9999px';
    link.style.top = '-9999px';
    link.style.opacity = '0';
    document.body.appendChild(link);
    try {
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    } catch {
      link.click();
    }
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 2000);
  };

  // Real PNG Download: Saves high-resolution {riderId}-QR.png directly to disk
  const handleDownload = async () => {
    const fileName = `${riderId}-QR.png`;
    try {
      setDownloading(true);
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;

      await QRCode.toCanvas(canvas, riderId, {
        errorCorrectionLevel: 'H',
        margin: 4,
        width: 600,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      });

      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            triggerDownload(blobUrl, fileName);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
          } else {
            const dataUrl = canvas.toDataURL('image/png');
            triggerDownload(dataUrl, fileName);
          }
          setActionFeedback(`Downloaded ${fileName}`);
          setTimeout(() => setActionFeedback(null), 3500);
          setDownloading(false);
        }, 'image/png');
      } else {
        const dataUrl = canvas.toDataURL('image/png');
        triggerDownload(dataUrl, fileName);
        setActionFeedback(`Downloaded ${fileName}`);
        setTimeout(() => setActionFeedback(null), 3500);
        setDownloading(false);
      }
    } catch (err) {
      console.error('Download QR failed:', err);
      if (qrDataUrl) {
        triggerDownload(qrDataUrl, fileName);
        setActionFeedback(`Downloaded ${fileName}`);
        setTimeout(() => setActionFeedback(null), 3500);
      } else {
        setActionFeedback('Failed to download QR code image.');
        setTimeout(() => setActionFeedback(null), 3500);
      }
      setDownloading(false);
    }
  };

  // Real Print: Triggers native browser print preview isolating the clean rider card
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print CSS block: isolates rider print pass and hides navigation & buttons */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #rider-print-qr-section,
          #rider-print-qr-section * {
            visibility: visible !important;
          }
          #rider-print-qr-section {
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

      {/* Main UI Card */}
      <Box
        className="no-print"
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          p: { xs: 2.5, sm: 3 },
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Card Header */}
        <Box sx={{ width: '100%', mb: 2.5, pb: 1.5, borderBottom: `1px solid ${colors.surface.border}`, textAlign: 'left' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
            <QrCode2OutlinedIcon sx={{ fontSize: 20, color: colors.brand.accent }} />
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: colors.text.primary,
                letterSpacing: '-0.01em',
              }}
            >
              Rider QR Code
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
            Unique QR code used for checkpoint scanning.
          </Typography>
        </Box>

        {/* QR Code Graphic Frame (Encodes ONLY the stable Rider ID) */}
        {isPendingPayment ? (
          <Box
            id="qr-withheld-notice"
            sx={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '8px',
              p: 3,
              mb: 2.5,
              width: '100%',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.5,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem', color: '#92400E', mb: 0.75 }}>
              Payment Verification Required
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: '#B45309', lineHeight: 1.5, maxWidth: 360, mx: 'auto' }}>
              Payment verification required before QR pass is issued.<br />
              Please contact the event organizer to complete payment.
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                p: 2,
                borderRadius: '8px',
                border: `2px solid ${colors.brand.primary}`,
                boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 2,
              }}
            >
              {/* Canvas-rendered standards-compliant QR */}
              {qrDataUrl ? (
                <Box
                  component="img"
                  id="img-rider-qr"
                  src={qrDataUrl}
                  alt={`QR Code for ${riderId}`}
                  sx={{
                    width: { xs: 150, sm: 170 },
                    height: { xs: 150, sm: 170 },
                    display: 'block',
                    imageRendering: 'pixelated',
                  }}
                />
              ) : (
                <canvas
                  id="canvas-rider-qr"
                  ref={canvasRef}
                  style={{
                    width: 170,
                    height: 170,
                    display: 'block',
                  }}
                />
              )}

              {/* Monospace Identifier Label under QR Code */}
              <Typography
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: colors.brand.primary,
                  letterSpacing: '0.08em',
                  mt: 1.5,
                }}
              >
                {riderId}
              </Typography>
            </Box>

            {/* Strict Privacy Rule Notice */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1.25,
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '6px',
                mb: 2.5,
                width: '100%',
                textAlign: 'left',
              }}
            >
              <SecurityOutlinedIcon sx={{ fontSize: 16, color: '#16A34A', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#166534', lineHeight: 1.4 }}>
                <strong>Privacy Rule:</strong> This QR code encodes <strong>ONLY the unique Rider ID ({riderId})</strong>. No personal data is exposed.
              </Typography>
            </Box>
          </>
        )}

        {/* Action Buttons: Real PNG Download & Print */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            width: '100%',
          }}
        >
          <RideButton
            id="btn-download-qr"
            variant="secondary"
            size="sm"
            fullWidth
            disabled={isPendingPayment || downloading}
            startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
            onClick={handleDownload}
            sx={{
              minHeight: 40,
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderColor: colors.surface.borderStrong,
              opacity: isPendingPayment ? 0.5 : 1,
            }}
          >
            {downloading ? 'Downloading...' : 'Download QR'}
          </RideButton>

          <RideButton
            id="btn-print-qr"
            variant="secondary"
            size="sm"
            fullWidth
            disabled={isPendingPayment}
            startIcon={<PrintOutlinedIcon fontSize="small" />}
            onClick={handlePrint}
            sx={{
              minHeight: 40,
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderColor: colors.surface.borderStrong,
              opacity: isPendingPayment ? 0.5 : 1,
            }}
          >
            Print QR
          </RideButton>
        </Box>

        {/* Action feedback toast */}
        {actionFeedback && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 1.5,
              p: 1,
              borderRadius: '4px',
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
            <span>{actionFeedback}</span>
          </Box>
        )}
      </Box>

      {/* Dedicated Printable Target Layout (Formatted for card / physical printout) */}
      {!isPendingPayment && (
        <Box
          id="rider-print-qr-section"
          sx={{
            display: 'none',
          }}
        >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '320px',
            border: '2.5px solid #0F172A',
            borderRadius: '16px',
            p: 4,
            backgroundColor: '#FFFFFF',
            boxShadow: 'none',
          }}
        >
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '0.08em',
              mb: 2,
            }}
          >
            NEWRIDER
          </Typography>

          {/* Clean High-Contrast QR */}
          <Box
            sx={{
              p: 1.5,
              backgroundColor: '#FFFFFF',
              border: '2px solid #0F172A',
              borderRadius: '8px',
              mb: 2,
            }}
          >
            {qrDataUrl && (
              <Box
                component="img"
                src={qrDataUrl}
                alt={riderId}
                sx={{
                  width: 200,
                  height: 200,
                  display: 'block',
                }}
              />
            )}
          </Box>

          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 800,
              fontFamily: 'monospace',
              color: '#0F172A',
              letterSpacing: '0.06em',
            }}
          >
            Rider ID: {riderId}
          </Typography>
        </Box>
      </Box>
    )}
    </>
  );
};

