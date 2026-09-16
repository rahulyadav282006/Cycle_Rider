import React from 'react';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { colors } from '../../theme/colors';
import { RiderFormField } from './RiderFormField';
import { MOCK_EVENTS_LIST } from './mockRidersData';

export interface RiderEventSelectorProps {
  value: string;
  error?: string;
  disabled?: boolean;
  events?: string[];
  onChange: (event: string) => void;
}

export const RiderEventSelector: React.FC<RiderEventSelectorProps> = ({
  value,
  error,
  disabled = false,
  events,
  onChange,
}) => {
  // If dynamic events provided, use them; otherwise fallback to empty or non-'All Events' list
  const availableEvents = events !== undefined ? events : MOCK_EVENTS_LIST.filter((e) => e !== 'All Events');

  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange(e.target.value);
  };

  const isError = Boolean(error);

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2.5, sm: 3 },
        mb: 3,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      <RiderFormField
        label="Event"
        required
        errorText={error}
        helperText="Select the cycling event for which this rider is registering"
        htmlFor="rider-event-select"
      >
        <Select
          id="rider-event-select"
          value={value}
          displayEmpty
          disabled={disabled}
          onChange={handleChange}
          startAdornment={
            <EventAvailableOutlinedIcon
              sx={{
                fontSize: 18,
                color: isError ? colors.status.error.dot : colors.brand.accent,
                mr: 1,
              }}
            />
          }
          sx={{
            height: 44,
            fontSize: '0.875rem',
            backgroundColor: '#FFFFFF',
            border: `1px solid ${isError ? colors.status.error.border : colors.surface.borderStrong}`,
            borderRadius: '6px',
            color: value ? colors.text.primary : colors.text.muted,
            fontWeight: value ? 600 : 400,
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover': {
              borderColor: isError ? colors.status.error.dot : colors.brand.accent,
            },
            '&.Mui-focused': {
              outline: `2px solid ${isError ? colors.status.error.dot : colors.brand.accent}`,
              outlineOffset: '1px',
            },
          }}
        >
          <MenuItem value="" disabled sx={{ fontSize: '0.875rem', color: colors.text.muted }}>
            Select an event
          </MenuItem>
          {availableEvents.map((evt) => (
            <MenuItem
              key={evt}
              value={evt}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: colors.text.primary,
                py: 1,
              }}
            >
              {evt}
            </MenuItem>
          ))}
        </Select>
      </RiderFormField>
    </Box>
  );
};
