import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircle';
import DownloadIcon from '@mui/icons-material/Download';
import TuneIcon from '@mui/icons-material/Tune';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditOutlinedIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunny';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';

import { PageContainer } from '../components/layout/PageContainer';
import {
  RideButton,
  RideIconButton,
  RideBadge,
  RideCard,
  RideCardHeader,
  RideCardContent,
  RideCardActions,
  RideInput,
  RideTextarea,
  RideSelect
} from '../components/ui';
import { colors, StatusType } from '../theme/colors';

export interface ShellPreviewPageProps {
  activeNav: string;
  onSelectNav: (id: string) => void;
}

export const ShellPreviewPage: React.FC<ShellPreviewPageProps> = ({
  activeNav,
  onSelectNav,
}) => {
  // Generic interactive states
  const [inputText, setInputText] = useState('Example Input Value');
  const [selectValue, setSelectValue] = useState('option_1');
  const [dateValue, setDateValue] = useState('2026-09-15');
  const [timeValue, setTimeValue] = useState('09:00');
  const [areaText, setAreaText] = useState('This is a multi-line text area demonstrating the visual form foundation.');

  const allStatuses: StatusType[] = [
    'draft',
    'active',
    'completed',
    'cancelled',
    'online',
    'offline',
    'pending',
    'success',
    'error',
  ];

  return (
    <PageContainer>
      {/* 1. Page Header */}
      <Box
        sx={{
          mb: 4,
          pb: 2.5,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.375rem', sm: '1.625rem' },
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: '-0.02em',
            }}
          >
            RideTrack Application Shell Preview
          </Typography>
          <RideBadge status="active" label="Shell Preview" size="sm" />
        </Box>

        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          This page exists only to demonstrate the RideTrack UI foundation.
        </Typography>

        {/* Current Active Navigation Context */}
        <Box
          sx={{
            mt: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 0.75,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '6px',
            fontSize: '0.8125rem',
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem', color: colors.text.muted, fontWeight: 500 }}>
            Active Navigation:
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: colors.brand.accent, fontWeight: 700, textTransform: 'uppercase' }}>
            {activeNav}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
            {['dashboard', 'events', 'riders', 'volunteers', 'reports'].map((tab) => (
              <Box
                key={tab}
                component="button"
                onClick={() => onSelectNav(tab)}
                sx={{
                  px: 1,
                  py: 0.25,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  borderRadius: '4px',
                  border: `1px solid ${activeNav === tab ? colors.brand.accent : colors.surface.border}`,
                  backgroundColor: activeNav === tab ? colors.brand.accentLight : 'transparent',
                  color: activeNav === tab ? colors.brand.accentHover : colors.text.secondary,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: colors.surface.subtle,
                  },
                }}
              >
                {tab}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* 2. Generic UI Foundation Showcases */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        {/* SECTION 1: BUTTON SYSTEM */}
        <RideCard>
          <RideCardHeader
            title="1. Button System"
            subtitle="Reusable button variants with hover, active, pressed, disabled, and keyboard focus states."
            action={
              <RideIconButton label="Refresh demo" size="sm">
                <RefreshIcon fontSize="small" />
              </RideIconButton>
            }
          />
          <RideCardContent>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, mb: 1.5, textTransform: 'uppercase' }}>
              Standard Interactive Buttons
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
              <RideButton variant="primary" startIcon={<AddCircleOutlineIcon />}>
                Primary Button
              </RideButton>
              <RideButton variant="secondary" startIcon={<DownloadIcon />}>
                Secondary Button
              </RideButton>
              <RideButton variant="tertiary">
                Tertiary / Text Button
              </RideButton>
            </Box>

            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, mb: 1.5, textTransform: 'uppercase' }}>
              Disabled States
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
              <RideButton variant="primary" disabled>
                Primary Button (Disabled)
              </RideButton>
              <RideButton variant="secondary" disabled>
                Secondary Button (Disabled)
              </RideButton>
              <RideButton variant="tertiary" disabled>
                Tertiary (Disabled)
              </RideButton>
            </Box>

            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, mb: 1.5, textTransform: 'uppercase' }}>
              Icon Buttons
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <RideIconButton label="Filter action" variant="outlined">
                <TuneIcon fontSize="small" />
              </RideIconButton>
              <RideIconButton label="Edit action" variant="filled">
                <EditOutlinedIcon fontSize="small" />
              </RideIconButton>
              <RideIconButton label="Delete action" variant="default">
                <DeleteOutlineIcon fontSize="small" />
              </RideIconButton>
              <RideIconButton label="Disabled action" disabled>
                <TuneIcon fontSize="small" />
              </RideIconButton>
            </Box>
          </RideCardContent>
          <RideCardActions>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, mr: 'auto' }}>
              Touch Target: Complies with WCAG 2.1 AAA (44x44px min)
            </Typography>
            <RideButton variant="secondary" size="sm">
              Secondary Action
            </RideButton>
            <RideButton variant="primary" size="sm">
              Primary Action
            </RideButton>
          </RideCardActions>
        </RideCard>

        {/* SECTION 2: STATUS BADGES */}
        <RideCard>
          <RideCardHeader
            title="2. Status Badges"
            subtitle="Reusable status badge styles."
          />
          <RideCardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              {allStatuses.map((status) => (
                <RideBadge key={status} status={status} />
              ))}
            </Box>

            <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${colors.surface.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, mb: 1 }}>
                Small Pill Variant:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                {allStatuses.map((status) => (
                  <RideBadge key={status} status={status} size="sm" />
                ))}
              </Box>
            </Box>
          </RideCardContent>
        </RideCard>

        {/* SECTION 3: FORM INPUTS */}
        <RideCard>
          <RideCardHeader
            title="3. Form Inputs"
            subtitle="Reusable input foundation with default, focus, disabled, and error states."
          />
          <RideCardContent>
            <Grid container spacing={2.5}>
              {/* Text Input - Default */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RideInput
                  label="Text Input (Default)"
                  helperText="Supporting helper text"
                  placeholder="Enter text..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  required
                />
              </Grid>

              {/* Text Input - Error State */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RideInput
                  label="Text Input (Error State)"
                  errorText="This field contains a validation error"
                  value="Invalid input value"
                  required
                />
              </Grid>

              {/* Select Dropdown */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RideSelect
                  label="Select Input"
                  helperText="Select an option from the list"
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                  options={[
                    { value: 'option_1', label: 'Option 1' },
                    { value: 'option_2', label: 'Option 2' },
                    { value: 'option_3', label: 'Option 3' },
                    { value: 'option_4', label: 'Option 4' },
                  ]}
                />
              </Grid>

              {/* Disabled Input */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RideInput
                  label="Text Input (Disabled)"
                  helperText="Disabled input state"
                  value="Disabled field content"
                  disabled
                />
              </Grid>

              {/* Date Input */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RideInput
                  label="Date Input"
                  type="date"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                />
              </Grid>

              {/* Time Input */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RideInput
                  label="Time Input"
                  type="time"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                />
              </Grid>

              {/* Textarea */}
              <Grid size={{ xs: 12 }}>
                <RideTextarea
                  label="Text Area"
                  helperText="Multi-line text area input"
                  value={areaText}
                  onChange={(e) => setAreaText(e.target.value)}
                  rows={3}
                />
              </Grid>
            </Grid>
          </RideCardContent>
        </RideCard>

        {/* SECTION 4: TYPOGRAPHY */}
        <RideCard>
          <RideCardHeader
            title="4. Typography"
            subtitle="Typography hierarchy established for clear outdoor readability."
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.status.pending.dot }}>
                <WbSunnyOutlinedIcon fontSize="small" />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  High Contrast
                </Typography>
              </Box>
            }
          />
          <RideCardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ pb: 1.5, borderBottom: `1px solid ${colors.surface.border}` }}>
                <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mb: 0.5 }}>
                  Page Title
                </Typography>
                <Typography variant="h1" sx={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text.primary }}>
                  RideTrack Application Shell
                </Typography>
              </Box>

              <Box sx={{ pb: 1.5, borderBottom: `1px solid ${colors.surface.border}` }}>
                <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mb: 0.5 }}>
                  Section Title
                </Typography>
                <Typography variant="h3" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text.primary }}>
                  Section Heading
                </Typography>
              </Box>

              <Box sx={{ pb: 1.5, borderBottom: `1px solid ${colors.surface.border}` }}>
                <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mb: 0.5 }}>
                  Card Title
                </Typography>
                <Typography variant="h4" sx={{ fontSize: '1rem', fontWeight: 600, color: colors.text.primary }}>
                  Card Header Title
                </Typography>
              </Box>

              <Box sx={{ pb: 1.5, borderBottom: `1px solid ${colors.surface.border}` }}>
                <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mb: 0.5 }}>
                  Body Text
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '0.875rem', color: colors.text.primary, lineHeight: 1.5 }}>
                  This is body text demonstrating standardized font sizing, line height, and contrast for high readability.
                </Typography>
              </Box>

              <Box sx={{ pb: 1.5, borderBottom: `1px solid ${colors.surface.border}` }}>
                <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mb: 0.5 }}>
                  Secondary Text
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                  This is secondary text used for supporting descriptions, subtitles, and captions.
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mb: 0.5 }}>
                  Small Metadata Text
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: colors.brand.accent }}>
                  METADATA_LABEL • ID: 10492 • STATUS: ACTIVE
                </Typography>
              </Box>
            </Box>
          </RideCardContent>
        </RideCard>

        {/* SECTION 5: EXAMPLE CARD */}
        <RideCard elevation="subtle">
          <RideCardHeader
            title="5. Example Card"
            subtitle="Example Card showing header, main content, secondary info, and action area."
            action={<RideBadge status="active" label="Active Card" />}
          />
          <RideCardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', mb: 0.5 }}>
                  Primary Content Area
                </Typography>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.text.primary }}>
                  Main Content Header
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mt: 0.25 }}>
                  This is an example card demonstrating restrained borders and visual hierarchy.
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', mb: 0.5 }}>
                  Secondary Information
                </Typography>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.text.primary }}>
                  Additional Details
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mt: 0.25 }}>
                  Secondary metadata and contextual information.
                </Typography>
              </Box>
            </Box>
          </RideCardContent>
          <RideCardActions>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 'auto' }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 16, color: colors.status.success.dot }} />
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: 500 }}>
                Status Indicator
              </Typography>
            </Box>
            <RideButton variant="secondary" size="sm">
              Secondary Action
            </RideButton>
            <RideButton variant="primary" size="sm">
              Primary Action
            </RideButton>
          </RideCardActions>
        </RideCard>

      </Box>
    </PageContainer>
  );
};
