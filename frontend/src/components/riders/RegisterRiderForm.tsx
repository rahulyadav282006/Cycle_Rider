import React from 'react';
import { Box } from '@mui/material';
import { RiderEventSelector } from './RiderEventSelector';
import { RiderInformationSection, RiderInfoValues, RiderInfoErrors } from './RiderInformationSection';
import { MedicalNotesSection } from './MedicalNotesSection';
import { RegisterRiderActions } from './RegisterRiderActions';

export interface RegisterRiderFormData extends RiderInfoValues {
  event: string;
  medicalNotes: string;
}

export interface RegisterRiderFormErrors extends RiderInfoErrors {
  event?: string;
  medicalNotes?: string;
}

export interface RegisterRiderFormProps {
  formData: RegisterRiderFormData;
  formErrors: RegisterRiderFormErrors;
  isSubmitting: boolean;
  events?: string[];
  onFieldChange: (field: keyof RegisterRiderFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const RegisterRiderForm: React.FC<RegisterRiderFormProps> = ({
  formData,
  formErrors,
  isSubmitting,
  events,
  onFieldChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{
        maxWidth: 860,
        mx: 'auto',
        width: '100%',
      }}
    >
      {/* 1. Event Selection (Section 4) */}
      <RiderEventSelector
        value={formData.event}
        error={formErrors.event}
        disabled={isSubmitting}
        events={events}
        onChange={(val) => onFieldChange('event', val)}
      />

      {/* 2. Rider Information Card (Sections 5 & 6) */}
      <RiderInformationSection
        values={formData}
        errors={formErrors}
        disabled={isSubmitting}
        onChange={(field, val) => onFieldChange(field, val)}
      />

      {/* 3. Medical Notes Card (Section 7) */}
      <MedicalNotesSection
        value={formData.medicalNotes}
        error={formErrors.medicalNotes}
        disabled={isSubmitting}
        onChange={(val) => onFieldChange('medicalNotes', val)}
      />

      {/* 4. Form Action Buttons (Section 9) */}
      <RegisterRiderActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </Box>
  );
};
