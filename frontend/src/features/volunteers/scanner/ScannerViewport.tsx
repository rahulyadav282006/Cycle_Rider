import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, CircularProgress, Button } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import FlipCameraIosOutlinedIcon from '@mui/icons-material/FlipCameraIosOutlined';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';
import FlashOffOutlinedIcon from '@mui/icons-material/FlashOffOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Html5Qrcode } from 'html5-qrcode';
import { colors } from '../../../theme/colors';

export interface ScannerViewportProps {
  onScan: (riderId: string) => void;
  isScanning?: boolean;
}

export const ScannerViewport: React.FC<ScannerViewportProps> = ({
  onScan,
  isScanning = true,
}) => {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [cameraState, setCameraState] = useState<'starting' | 'active' | 'error' | 'stopped'>('starting');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isThrottledRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Enumerate cameras on mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setAvailableCameras(devices);
          // Prefer rear/environment camera if available (mobile)
          const rearCam = devices.find((d) => /back|rear|environment/i.test(d.label));
          if (rearCam) {
            setSelectedCameraId(rearCam.id);
            setFacingMode('environment');
          } else {
            // Default to first device (standard laptop webcam)
            setSelectedCameraId(devices[0].id);
            setFacingMode('user');
          }
        }
      })
      .catch((err) => {
        console.warn('Camera enumeration notice:', err);
      });
  }, []);

  const startScanner = async (cameraIdOrFacing: string | { facingMode: 'environment' | 'user' }) => {
    try {
      setCameraState('starting');
      setCameraError(null);

      // Stop previous instance if running
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      }

      const qrRegionId = 'html5qr-camera-viewport';
      const scanner = new Html5Qrcode(qrRegionId);
      html5QrCodeRef.current = scanner;

      const qrConfig = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        useBarCodeDetectorIfSupported: false,
      };

      const onScanSuccess = (decodedText: string) => {
        if (isThrottledRef.current) return;
        isThrottledRef.current = true;
        onScan(decodedText);
        setTimeout(() => {
          isThrottledRef.current = false;
        }, 2500);
      };

      const onScanFailure = () => {
        // Frame without QR
      };

      try {
        await scanner.start(cameraIdOrFacing, qrConfig, onScanSuccess, onScanFailure);
      } catch (firstErr) {
        // Fallback: If environment camera constraint fails (e.g. on laptop/desktop), retry with user camera
        console.warn('Initial camera source failed, trying user camera fallback:', firstErr);
        await scanner.start({ facingMode: 'user' }, qrConfig, onScanSuccess, onScanFailure);
        setFacingMode('user');
      }

      setCameraState('active');

      // Check for torch capability on active track
      try {
        const stream = (scanner as any).localMediaStream;
        if (stream) {
          const videoTrack = stream.getVideoTracks()[0];
          const capabilities = videoTrack?.getCapabilities?.();
          if (capabilities && 'torch' in capabilities) {
            setHasTorch(true);
          }
        }
      } catch {
        setHasTorch(false);
      }
    } catch (err: any) {
      console.warn('Camera startup failure:', err);
      setCameraState('error');
      const errStr = String(err?.message || err || '');
      if (errStr.includes('NotAllowedError') || errStr.includes('Permission')) {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (errStr.includes('NotFoundError') || errStr.includes('DevicesNotFoundError') || errStr.includes('OverconstrainedError')) {
        setCameraError('No compatible camera found on this device. You can test by uploading a QR image below.');
      } else {
        setCameraError('Camera could not be started. Ensure no other application is using it.');
      }
    }
  };

  useEffect(() => {
    if (isScanning) {
      const source = selectedCameraId ? selectedCameraId : { facingMode };
      startScanner(source);
    } else {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => { });
      }
    }

    return () => {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(() => { });
        }
        html5QrCodeRef.current.clear();
      }
    };
  }, [selectedCameraId, facingMode, isScanning]);

  const toggleCamera = () => {
    if (availableCameras.length > 1) {
      const currentIndex = availableCameras.findIndex((c) => c.id === selectedCameraId);
      const nextIndex = (currentIndex + 1) % availableCameras.length;
      const nextCam = availableCameras[nextIndex];
      setSelectedCameraId(nextCam.id);
      setFacingMode(/back|rear|environment/i.test(nextCam.label) ? 'environment' : 'user');
    } else {
      const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
      setFacingMode(nextFacing);
      setSelectedCameraId('');
    }
  };

  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !hasTorch) return;
    try {
      const nextTorch = !torchOn;
      await (html5QrCodeRef.current as any).applyVideoConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Failed to toggle torch:', err);
    }
  };

  // Fallback: Scan from image file if device lacks camera
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('html5qr-camera-viewport');
      }
      const decodedResult = await html5QrCodeRef.current.scanFile(file, true);
      if (decodedResult) {
        onScan(decodedResult);
      }
    } catch {
      alert('Could not detect a valid QR code in the uploaded image. Please try a clearer picture.');
    } finally {
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '12px',
        p: { xs: 2.5, sm: 3.5 },
        boxShadow: '0 4px 12px 0 rgba(15, 23, 42, 0.05)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Title & Subtitle */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 800,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          mb: 0.5,
        }}
      >
        Scan Rider QR Code
      </Typography>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          mb: 2.5,
        }}
      >
        Position the rider's QR code inside the frame.
      </Typography>

      {/* Camera Viewport Container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          aspectRatio: '1 / 1',
          backgroundColor: '#0A0F1D',
          borderRadius: '12px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '2px solid #1E293B',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 8px 24px rgba(10, 15, 29, 0.25)',
        }}
      >
        {/* Real HTML5 Camera Video Viewport Mount Target */}
        <Box
          id="html5qr-camera-viewport"
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            '& video': {
              width: '100% !important',
              height: '100% !important',
              objectFit: 'cover !important',
              borderRadius: '10px',
            },
          }}
        />

        {/* Loading Overlay */}
        {cameraState === 'starting' && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(10, 15, 29, 0.85)',
              zIndex: 3,
              gap: 1.5,
            }}
          >
            <CircularProgress size={36} sx={{ color: '#38BDF8' }} />
            <Typography sx={{ color: '#E0F2FE', fontSize: '0.8125rem', fontWeight: 600 }}>
              Accessing Camera...
            </Typography>
          </Box>
        )}

        {/* Error Overlay with Retry & Image Fallback */}
        {cameraState === 'error' && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(10, 15, 29, 0.95)',
              p: 3,
              zIndex: 4,
              gap: 1.5,
            }}
          >
            <VideocamOffOutlinedIcon sx={{ fontSize: 42, color: '#F87171' }} />
            <Typography sx={{ color: '#F87171', fontSize: '0.875rem', fontWeight: 700 }}>
              Camera Unavailable
            </Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', maxWidth: 280 }}>
              {cameraError}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshOutlinedIcon />}
                onClick={() => startScanner(facingMode)}
                sx={{
                  color: '#38BDF8',
                  borderColor: '#38BDF8',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                }}
              >
                Retry
              </Button>
            </Box>
          </Box>
        )}

        {/* Square Target Framing (Reticle) */}
        <Box
          sx={{
            width: '74%',
            height: '74%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {/* 4 Corner Brackets */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 32,
              height: 32,
              borderTop: '3.5px solid #38BDF8',
              borderLeft: '3.5px solid #38BDF8',
              borderTopLeftRadius: '6px',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 32,
              height: 32,
              borderTop: '3.5px solid #38BDF8',
              borderRight: '3.5px solid #38BDF8',
              borderTopRightRadius: '6px',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 32,
              height: 32,
              borderBottom: '3.5px solid #38BDF8',
              borderLeft: '3.5px solid #38BDF8',
              borderBottomLeftRadius: '6px',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 32,
              height: 32,
              borderBottom: '3.5px solid #38BDF8',
              borderRight: '3.5px solid #38BDF8',
              borderBottomRightRadius: '6px',
            }}
          />

          {/* Animated Horizontal Laser Scan Beam (Active during live camera feed) */}
          {cameraState === 'active' && (
            <Box
              sx={{
                position: 'absolute',
                left: '4%',
                right: '4%',
                height: '3px',
                backgroundColor: '#38BDF8',
                boxShadow: '0 0 16px 3px rgba(56, 189, 248, 0.9), 0 0 4px #FFFFFF',
                animation: 'scanBeam 2.4s ease-in-out infinite alternate',
                '@keyframes scanBeam': {
                  '0%': { top: '8%', opacity: 0.8 },
                  '50%': { opacity: 1 },
                  '100%': { top: '88%', opacity: 0.8 },
                },
              }}
            />
          )}

          {/* Center Guide Label when camera is starting */}
          {cameraState !== 'active' && cameraState !== 'error' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                }}
              >
                <QrCode2Icon sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#E0F2FE',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                }}
              >
                Ready to scan
              </Typography>
            </Box>
          )}
        </Box>

        {/* Torch / Flashlight Toggle Overlay Button */}
        {hasTorch && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleTorch();
            }}
            aria-label="Toggle Torch"
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              backgroundColor: torchOn ? '#38BDF8' : 'rgba(255, 255, 255, 0.12)',
              color: torchOn ? '#0F172A' : '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              zIndex: 5,
              '&:hover': {
                backgroundColor: torchOn ? '#0284C7' : 'rgba(255, 255, 255, 0.2)',
              },
            }}
            title={torchOn ? 'Torch On' : 'Torch Off'}
          >
            {torchOn ? <FlashOnOutlinedIcon sx={{ fontSize: 18 }} /> : <FlashOffOutlinedIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        )}
      </Box>

      {/* Hidden File Input for fallback image scan */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Viewport Footer Controls: Camera Selector & Camera Ready Indicator */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 420,
          mt: 2,
          px: 1,
        }}
      >
        {/* Camera Switcher & Upload */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={toggleCamera}
            aria-label="Switch Camera"
            sx={{
              border: `1px solid ${colors.surface.borderStrong}`,
              borderRadius: '6px',
              p: 0.75,
              color: colors.text.primary,
            }}
            title="Switch front/back camera"
          >
            <FlipCameraIosOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload Image"
            sx={{
              border: `1px solid ${colors.surface.borderStrong}`,
              borderRadius: '6px',
              p: 0.75,
              color: colors.text.primary,
            }}
            title="Upload QR Image"
          >
            <UploadFileOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <Box sx={{ textAlign: 'left', ml: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: '0.6875rem', color: colors.text.muted, display: 'block' }}>
              Camera / Upload
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: colors.text.primary, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {availableCameras.find((c) => c.id === selectedCameraId)?.label ||
                (facingMode === 'environment' ? 'Back Camera' : 'Front Camera / Webcam')}
            </Typography>
          </Box>
        </Box>

        {/* Camera Ready Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: cameraState === 'active' ? '#10B981' : cameraState === 'error' ? '#EF4444' : '#F59E0B',
              boxShadow:
                cameraState === 'active'
                  ? '0 0 0 2px rgba(16, 185, 129, 0.25)'
                  : cameraState === 'error'
                    ? '0 0 0 2px rgba(239, 68, 68, 0.25)'
                    : '0 0 0 2px rgba(245, 158, 11, 0.25)',
            }}
          />
          <Typography
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: cameraState === 'active' ? '#065F46' : cameraState === 'error' ? '#991B1B' : '#92400E',
            }}
          >
            {cameraState === 'active' ? 'Camera Live' : cameraState === 'error' ? 'Camera Offline' : 'Starting...'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
