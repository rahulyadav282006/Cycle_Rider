import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';
import {
  Volunteer,
  EVENT_OPTIONS,
  CHECKPOINT_OPTIONS,
} from './mockVolunteersData';

export interface AssignVolunteerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (volunteerData: {
    id?: string;
    name: string;
    mobile: string;
    event: string;
    checkpoint: string;
    checkpointId?: string;
  }) => void;
  initialVolunteer?: Volunteer | null;
  events?: { id: string; name: string }[];
  checkpoints?: { id: string; name: string; sequenceNumber?: number }[];
  currentEventName?: string;
}

export const AssignVolunteerDialog: React.FC<AssignVolunteerDialogProps> = ({
  open,
  onClose,
  onSave,
  initialVolunteer,
  events,
  checkpoints,
  currentEventName,
}) => {
  const availableEvents =
    events && events.length > 0
      ? events.map((e) => e.name)
      : (EVENT_OPTIONS as unknown as string[]);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [event, setEvent] = useState<string>(currentEventName || availableEvents[0] || 'Event');
  const [checkpointId, setCheckpointId] = useState<string>('');
  const [checkpoint, setCheckpoint] = useState<string>('');

  // Form errors
  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    event?: string;
    checkpoint?: string;
  }>({});

  useEffect(() => {
    if (initialVolunteer) {
      setName(initialVolunteer.name);
      setMobile(initialVolunteer.mobile);
      setEvent(initialVolunteer.event || currentEventName || availableEvents[0]);
      if (initialVolunteer.checkpointId) {
        setCheckpointId(initialVolunteer.checkpointId);
        setCheckpoint(initialVolunteer.checkpoint || '');
      } else if (initialVolunteer.checkpoint && initialVolunteer.checkpoint !== 'Unassigned') {
        const matched = checkpoints?.find((c) => c.name === initialVolunteer.checkpoint);
        setCheckpointId(matched?.id || '');
        setCheckpoint(initialVolunteer.checkpoint);
      } else {
        setCheckpointId('');
        setCheckpoint('Unassigned');
      }
    } else {
      setName('');
      setMobile('');
      setEvent(currentEventName || availableEvents[0]);
      if (checkpoints && checkpoints.length > 0) {
        setCheckpointId(checkpoints[0].id);
        setCheckpoint(checkpoints[0].name);
      } else {
        setCheckpointId('');
        setCheckpoint('Unassigned');
      }
    }
    setErrors({});
  }, [initialVolunteer, open, currentEventName, events, checkpoints]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = 'Volunteer name is required';
    }

    const trimmedMobile = mobile.trim();
    if (!trimmedMobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (/[a-zA-Z]/.test(trimmedMobile) || !/^[+\d\s()-]+$/.test(trimmedMobile)) {
      newErrors.mobile = 'Enter a valid mobile number with digits only';
    } else {
      let digits = trimmedMobile.replace(/\D/g, '');
      if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
      else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);

      if (digits.length < 10) {
        newErrors.mobile = 'Mobile number must be 10 digits';
      } else if (digits.length > 10) {
        newErrors.mobile = 'Mobile number cannot exceed 10 digits';
      } else if (!/^[6-9]/.test(digits)) {
        newErrors.mobile = 'Mobile number must start with 6, 7, 8, or 9';
      }
    }

    if (!event) {
      newErrors.event = 'Please select an event';
    }
    if (!checkpoint && !checkpointId) {
      newErrors.checkpoint = 'Please select a checkpoint';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let cleanMobile = mobile.trim();
    let digits = cleanMobile.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    if (digits.length === 10) cleanMobile = digits;

    const isUnassigned = !checkpointId || checkpointId === 'unassigned' || checkpoint === 'Unassigned';

    onSave({
      id: initialVolunteer?.id,
      name: name.trim(),
      mobile: cleanMobile,
      event,
      checkpoint: isUnassigned ? 'Unassigned' : checkpoint,
      checkpointId: isUnassigned ? undefined : checkpointId,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '8px',
            border: `1px solid ${colors.surface.border}`,
            boxShadow:
              '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          backgroundColor: colors.surface.page,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: colors.brand.accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.brand.accent,
            }}
          >
            <AssignmentIndOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.0625rem',
                color: colors.text.primary,
                lineHeight: 1.2,
              }}
            >
              {initialVolunteer && initialVolunteer.checkpoint !== 'Unassigned'
                ? 'Edit Volunteer Assignment'
                : 'Assign Volunteer'}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
              Allocate volunteer staff to an event checkpoint
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="Close dialog">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Assignment Rule Banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.25,
            p: 1.75,
            backgroundColor: '#EFF6FF', // Tailwind blue-50
            border: '1px solid #BFDBFE', // Tailwind blue-200
            borderRadius: '6px',
            mb: 3,
            mt: 0.5,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 18, color: '#1D4ED8', mt: 0.2, flexShrink: 0 }} />
          <Box>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#1E40AF',
                mb: 0.25,
              }}
            >
              Assignment Rule
            </Typography>
            <Typography
              sx={{
                fontSize: '0.78125rem',
                color: '#1E3A8A',
                lineHeight: 1.45,
              }}
            >
              A volunteer is assigned to <strong>one event</strong> and <strong>one or more checkpoints</strong>. Select the primary operational checkpoint below.
            </Typography>
          </Box>
        </Box>

        {/* Form Fields */}
        <Box
          component="form"
          id="assign-volunteer-form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}
        >
          {/* Volunteer Name */}
          <Box>
            <Typography
              component="label"
              sx={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: colors.text.primary,
                mb: 0.75,
              }}
            >
              Volunteer Name <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 42,
                px: 1.5,
                border: '1px solid',
                borderColor: errors.name ? '#EF4444' : colors.surface.borderStrong,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                '&:focus-within': {
                  borderColor: errors.name ? '#EF4444' : colors.brand.accent,
                  outline: `2px solid ${errors.name ? '#EF4444' : colors.brand.accent}`,
                  outlineOffset: '1px',
                },
              }}
            >
              <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted, mr: 1 }} />
              <Box
                component="input"
                type="text"
                placeholder="e.g. Amit Kulkarni"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                sx={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.875rem',
                  color: colors.text.primary,
                  '&::placeholder': { color: colors.text.muted },
                }}
              />
            </Box>
            {errors.name && (
              <Typography sx={{ fontSize: '0.75rem', color: '#EF4444', mt: 0.5, fontWeight: 500 }}>
                {errors.name}
              </Typography>
            )}
          </Box>

          {/* Mobile Number */}
          <Box>
            <Typography
              component="label"
              sx={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: colors.text.primary,
                mb: 0.75,
              }}
            >
              Mobile Number <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 42,
                px: 1.5,
                border: '1px solid',
                borderColor: errors.mobile ? '#EF4444' : colors.surface.borderStrong,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                '&:focus-within': {
                  borderColor: errors.mobile ? '#EF4444' : colors.brand.accent,
                  outline: `2px solid ${errors.mobile ? '#EF4444' : colors.brand.accent}`,
                  outlineOffset: '1px',
                },
              }}
            >
              <PhoneOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted, mr: 1 }} />
              <Box
                component="input"
                type="tel"
                maxLength={15}
                placeholder="e.g. 98765 43210"
                value={mobile}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value;
                  if (/^[+\d\s()-]*$/.test(val)) {
                    setMobile(val);
                    if (errors.mobile) setErrors({ ...errors, mobile: undefined });
                  }
                }}
                sx={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  color: colors.text.primary,
                  '&::placeholder': { color: colors.text.muted },
                }}
              />
            </Box>
            {errors.mobile && (
              <Typography sx={{ fontSize: '0.75rem', color: '#EF4444', mt: 0.5, fontWeight: 500 }}>
                {errors.mobile}
              </Typography>
            )}
          </Box>

          {/* Event Dropdown */}
          <Box>
            <Typography
              component="label"
              sx={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: colors.text.primary,
                mb: 0.75,
              }}
            >
              Event <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="select"
                value={event}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setEvent(e.target.value);
                  if (errors.event) setErrors({ ...errors, event: undefined });
                }}
                sx={{
                  width: '100%',
                  height: 42,
                  appearance: 'none',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${errors.event ? '#EF4444' : colors.surface.borderStrong}`,
                  borderRadius: '6px',
                  px: 1.5,
                  pl: 4.5,
                  pr: 4,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: colors.text.primary,
                  cursor: 'pointer',
                  outline: 'none',
                  '&:focus': {
                    borderColor: errors.event ? '#EF4444' : colors.brand.accent,
                    outline: `2px solid ${errors.event ? '#EF4444' : colors.brand.accent}`,
                    outlineOffset: '1px',
                  },
                }}
              >
                {EVENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Box>
              <EventOutlinedIcon
                sx={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.text.muted,
                  pointerEvents: 'none',
                  fontSize: 18,
                }}
              />
              <KeyboardArrowDownIcon
                sx={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.text.muted,
                  pointerEvents: 'none',
                  fontSize: 18,
                }}
              />
            </Box>
            {errors.event && (
              <Typography sx={{ fontSize: '0.75rem', color: '#EF4444', mt: 0.5, fontWeight: 500 }}>
                {errors.event}
              </Typography>
            )}
          </Box>

          {/* Checkpoint Dropdown */}
          <Box>
            <Typography
              component="label"
              sx={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: colors.text.primary,
                mb: 0.75,
              }}
            >
              Checkpoint <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="select"
                value={checkpointId || (checkpoint === 'Unassigned' ? 'unassigned' : checkpoint)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const val = e.target.value;
                  if (val === 'unassigned' || !val) {
                    setCheckpointId('');
                    setCheckpoint('Unassigned');
                  } else {
                    const matched = checkpoints?.find((c) => c.id === val);
                    if (matched) {
                      setCheckpointId(matched.id);
                      setCheckpoint(matched.name);
                    } else {
                      setCheckpointId(val);
                      setCheckpoint(val);
                    }
                  }
                  if (errors.checkpoint) setErrors({ ...errors, checkpoint: undefined });
                }}
                sx={{
                  width: '100%',
                  height: 42,
                  appearance: 'none',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${errors.checkpoint ? '#EF4444' : colors.surface.borderStrong}`,
                  borderRadius: '6px',
                  px: 1.5,
                  pl: 4.5,
                  pr: 4,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: colors.text.primary,
                  cursor: 'pointer',
                  outline: 'none',
                  '&:focus': {
                    borderColor: errors.checkpoint ? '#EF4444' : colors.brand.accent,
                    outline: `2px solid ${errors.checkpoint ? '#EF4444' : colors.brand.accent}`,
                    outlineOffset: '1px',
                  },
                }}
              >
                <option value="unassigned">-- Unassigned --</option>
                {checkpoints && checkpoints.length > 0
                  ? checkpoints.map((cp, idx) => (
                      <option key={cp.id} value={cp.id}>
                        {cp.sequenceNumber || idx + 1}. {cp.name}
                      </option>
                    ))
                  : CHECKPOINT_OPTIONS.map((cp, idx) => (
                      <option key={cp} value={cp}>
                        {idx + 1}. {cp}
                      </option>
                    ))}
              </Box>
              <LocationOnOutlinedIcon
                sx={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.text.muted,
                  pointerEvents: 'none',
                  fontSize: 18,
                }}
              />
              <KeyboardArrowDownIcon
                sx={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.text.muted,
                  pointerEvents: 'none',
                  fontSize: 18,
                }}
              />
            </Box>
            {errors.checkpoint && (
              <Typography sx={{ fontSize: '0.75rem', color: '#EF4444', mt: 0.5, fontWeight: 500 }}>
                {errors.checkpoint}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          py: 2,
          px: 3,
          backgroundColor: colors.surface.page,
          borderTop: `1px solid ${colors.surface.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
        }}
      >
        <RideButton variant="secondary" size="md" onClick={onClose}>
          Cancel
        </RideButton>
        <RideButton
          variant="primary"
          size="md"
          type="submit"
          form="assign-volunteer-form"
          sx={{ minHeight: 44, fontWeight: 700 }}
        >
          Assign Volunteer
        </RideButton>
      </DialogActions>
    </Dialog>
  );
};
