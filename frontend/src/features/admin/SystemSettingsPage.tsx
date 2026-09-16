import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';
import { RideBadge } from '../../components/ui/RideBadge';
import { adminService, SystemSettings } from '../../api/services';

export type SettingsPrototypeState = 'default' | 'modified' | 'saving' | 'saved';

interface SystemSettingsPageProps {
  onStateChange?: (st: SettingsPrototypeState) => void;
  showPrototypeSwitcher?: boolean;
}

const DEFAULT_SETTINGS_FALLBACK: SystemSettings = {
  platformName: 'RideTrack',
  supportEmail: 'support@ridetrack.com',
  allowPublicRegistration: true,
  allowEventCreation: true,
  allowOrganizerRegistration: true,
  offlineScanning: true,
  automaticSync: true,
  platformNotifications: true,
  platformStatus: 'Operational',
  qrCodeGracePeriodHours: 48,
  offlineSyncWindowHours: 72,
  maintenanceMode: false,
  updatedAt: new Date().toISOString(),
};

export const SystemSettingsPage: React.FC<SystemSettingsPageProps> = ({
  onStateChange,
  showPrototypeSwitcher = false,
}) => {
  const [prototypeState, setPrototypeState] = useState<SettingsPrototypeState>('default');
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS_FALLBACK);
  const [initialSettings, setInitialSettings] = useState<SystemSettings>(DEFAULT_SETTINGS_FALLBACK);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await adminService.getSettings();
        if (isMounted && data) {
          const merged: SystemSettings = {
            ...DEFAULT_SETTINGS_FALLBACK,
            ...data,
          };
          setSettings(merged);
          setInitialSettings(merged);
        }
      } catch (err: any) {
        console.error('Failed to load system settings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSetPrototypeState = (st: SettingsPrototypeState) => {
    setPrototypeState(st);
    if (onStateChange) onStateChange(st);
    if (st === 'default') {
      setSettings(initialSettings);
    } else if (st === 'modified') {
      setSettings({
        ...initialSettings,
        platformName: 'RideTrack Maharashtra Platform',
        allowOrganizerRegistration: false,
        automaticSync: true,
      });
    }
  };

  const handleToggle = (key: keyof SystemSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setPrototypeState('modified');
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage(null);
      setPrototypeState('saving');

      const updated = await adminService.updateSettings({
        platformName: settings.platformName,
        supportEmail: settings.supportEmail,
        allowPublicRegistration: settings.allowOrganizerRegistration,
        allowEventCreation: settings.allowEventCreation,
        allowOrganizerRegistration: settings.allowOrganizerRegistration,
        offlineScanning: settings.offlineScanning,
        automaticSync: settings.automaticSync,
        platformNotifications: settings.platformNotifications,
        qrCodeGracePeriodHours: settings.qrCodeGracePeriodHours,
        offlineSyncWindowHours: settings.offlineSyncWindowHours,
        maintenanceMode: settings.maintenanceMode,
      });

      if (updated) {
        const merged: SystemSettings = {
          ...DEFAULT_SETTINGS_FALLBACK,
          ...updated,
        };
        setSettings(merged);
        setInitialSettings(merged);
      }
      setSuccessMessage('Settings saved successfully.');
      setPrototypeState('saved');
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setErrorMessage(err?.response?.data?.error?.message || 'Failed to save settings. Please try again.');
      setPrototypeState('modified');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    setPrototypeState('default');
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 900, mx: 'auto', display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} sx={{ color: colors.primary.main }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      {/* Prototype State Switcher (optional / hidden in production) */}
      {showPrototypeSwitcher && (
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
              Settings States:
            </Typography>
          </Box>
          {(
            [
              { key: 'default', label: '1. Default' },
              { key: 'modified', label: '2. Modified' },
              { key: 'saving', label: '3. Saving' },
              { key: 'saved', label: '4. Saved' },
            ] as const
          ).map((st) => {
            const isSelected = prototypeState === st.key;
            return (
              <Box
                key={st.key}
                component="button"
                type="button"
                onClick={() => handleSetPrototypeState(st.key)}
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
      )}

      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
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
            System Settings
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
          Manage RideTrack platform configuration and operational preferences.
        </Typography>
      </Box>

      {/* Feedback Alerts */}
      {(successMessage || prototypeState === 'saved') && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
          {successMessage || 'Settings saved successfully.'}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {errorMessage}
        </Alert>
      )}

      {/* Settings Form Container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* SECTION 1 — Platform Status */}
        <Card
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <DnsOutlinedIcon sx={{ color: colors.primary.main, fontSize: 22 }} />
              <Typography variant="h3" sx={{ fontSize: '1.05rem', fontWeight: 700, color: colors.text.primary }}>
                Platform Status
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2.5,
                mt: 1.5,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                  Platform Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={settings.platformName}
                  onChange={(e) => {
                    setSettings((p) => ({ ...p, platformName: e.target.value }));
                    setPrototypeState('modified');
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                  System Health
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 40,
                    px: 2,
                    borderRadius: '8px',
                    backgroundColor: colors.surface.subtle,
                    border: `1px solid ${colors.surface.border}`,
                  }}
                >
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                    {settings.platformStatus || (settings.maintenanceMode ? 'Maintenance' : 'Operational')}
                  </Typography>
                  <RideBadge
                    status={settings.maintenanceMode ? 'offline' : 'active'}
                    label={settings.maintenanceMode ? 'Maintenance' : 'Operational'}
                    size="sm"
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* SECTION 2 — Default Event Settings */}
        <Card
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <EventAvailableOutlinedIcon sx={{ color: colors.primary.main, fontSize: 22 }} />
              <Typography variant="h3" sx={{ fontSize: '1.05rem', fontWeight: 700, color: colors.text.primary }}>
                Default Event Settings
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                    Allow Event Creation
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                    Permits active organizers to create and publish new cycling events
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: settings.allowEventCreation ? '#059669' : colors.text.muted }}>
                    {settings.allowEventCreation ? 'ON' : 'OFF'}
                  </Typography>
                  <Switch
                    checked={Boolean(settings.allowEventCreation)}
                    onChange={() => handleToggle('allowEventCreation')}
                    color="primary"
                  />
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                    Allow Organizer Registration
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                    Permits new organizer account onboarding on the platform
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: settings.allowOrganizerRegistration ? '#059669' : colors.text.muted }}>
                    {settings.allowOrganizerRegistration ? 'ON' : 'OFF'}
                  </Typography>
                  <Switch
                    checked={Boolean(settings.allowOrganizerRegistration)}
                    onChange={() => handleToggle('allowOrganizerRegistration')}
                    color="primary"
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* SECTION 3 — Notification / System Preferences */}
        <Card
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <TuneOutlinedIcon sx={{ color: colors.primary.main, fontSize: 22 }} />
              <Typography variant="h3" sx={{ fontSize: '1.05rem', fontWeight: 700, color: colors.text.primary }}>
                Notification / System Preferences
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                    Offline Scanning
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                    Allows volunteer QR scanners to record passes during cellular coverage dropouts
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: settings.offlineScanning ? '#059669' : colors.text.muted }}>
                    {settings.offlineScanning ? 'Enabled' : 'Disabled'}
                  </Typography>
                  <Switch
                    checked={Boolean(settings.offlineScanning)}
                    onChange={() => handleToggle('offlineScanning')}
                    color="primary"
                  />
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                    Automatic Sync
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                    Automatically uploads stored scans when connection is restored
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: settings.automaticSync ? '#059669' : colors.text.muted }}>
                    {settings.automaticSync ? 'Enabled' : 'Disabled'}
                  </Typography>
                  <Switch
                    checked={Boolean(settings.automaticSync)}
                    onChange={() => handleToggle('automaticSync')}
                    color="primary"
                  />
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                    Platform Notifications
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                    Sends emergency and operational updates to platform organizers
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: settings.platformNotifications ? '#059669' : colors.text.muted }}>
                    {settings.platformNotifications ? 'Enabled' : 'Disabled'}
                  </Typography>
                  <Switch
                    checked={Boolean(settings.platformNotifications)}
                    onChange={() => handleToggle('platformNotifications')}
                    color="primary"
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons: Cancel & Save Changes */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1.5,
            pt: 1,
          }}
        >
          <RideButton
            variant="secondary"
            size="sm"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </RideButton>

          <RideButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Saving...
              </Box>
            ) : (
              'Save Changes'
            )}
          </RideButton>
        </Box>
      </Box>
    </Box>
  );
};
