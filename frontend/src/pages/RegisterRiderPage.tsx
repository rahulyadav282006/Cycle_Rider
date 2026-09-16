import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { RegisterRiderHeader } from '../components/riders/RegisterRiderHeader';
import {
  RegisterRiderForm,
  RegisterRiderFormData,
  RegisterRiderFormErrors,
} from '../components/riders/RegisterRiderForm';
import { RegisterRiderSuccess } from '../components/riders/RegisterRiderSuccess';
import { QrNoticeModal } from '../components/riders/QrNoticeModal';
import { eventService, riderService } from '../api/services';

export interface RegisterRiderPageProps {
  eventId?: string;
  onNavigateBack: () => void;
}

const DEFAULT_RIDER_DATA: RegisterRiderFormData = {
  event: '',
  riderId: '',
  name: '',
  mobile: '',
  emergencyContact: '',
  bloodGroup: '',
  age: '',
  gender: '',
  club: '',
  bicycleType: '',
  jerseyNumber: '',
  medicalNotes: '',
};

export const RegisterRiderPage: React.FC<RegisterRiderPageProps> = ({
  eventId,
  onNavigateBack,
}) => {
  const [formData, setFormData] = useState<RegisterRiderFormData>(DEFAULT_RIDER_DATA);
  const [formErrors, setFormErrors] = useState<RegisterRiderFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [availableEvents, setAvailableEvents] = useState<{ id: string; name: string }[]>([]);
  const [registeredRiderSummary, setRegisteredRiderSummary] = useState<{
    riderId: string;
    name: string;
    event: string;
    jerseyNumber: string;
  }>({
    riderId: '',
    name: '',
    event: '',
    jerseyNumber: '',
  });

  useEffect(() => {
    let isMounted = true;
    eventService
      .listEvents()
      .then((events) => {
        if (!isMounted) return;
        const list = events.map((e) => ({ id: e.id, name: e.eventName }));
        setAvailableEvents(list);

        if (eventId) {
          const matched = list.find((e) => e.id === eventId);
          if (matched) {
            setFormData((prev) => ({ ...prev, event: matched.name }));
          }
        } else if (list.length > 0) {
          setFormData((prev) => ({ ...prev, event: list[0].name }));
        }
      })
      .catch((err) => {
        console.error('Failed to load events for registration:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleFieldChange = (field: keyof RegisterRiderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof RegisterRiderFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: RegisterRiderFormErrors = {};

    // 1. Event
    if (!formData.event) {
      errors.event = 'Please select an event.';
    }

    // 2. Name
    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

    // 3. Mobile Number Validation
    const trimmedMobile = formData.mobile.trim();
    let cleanMobileDigits = '';
    if (!trimmedMobile) {
      errors.mobile = 'Mobile number is required.';
    } else if (/[a-zA-Z]/.test(trimmedMobile) || !/^[+\d\s()-]+$/.test(trimmedMobile)) {
      errors.mobile = 'Enter a valid mobile number with digits only.';
    } else {
      let digits = trimmedMobile.replace(/\D/g, '');
      if (digits.length === 12 && digits.startsWith('91')) {
        digits = digits.slice(2);
      } else if (digits.length === 11 && digits.startsWith('0')) {
        digits = digits.slice(1);
      }

      if (digits.length < 10) {
        errors.mobile = 'Mobile number must be 10 digits.';
      } else if (digits.length > 10) {
        errors.mobile = 'Mobile number cannot exceed 10 digits.';
      } else if (!/^[6-9]/.test(digits)) {
        errors.mobile = 'Mobile number must start with 6, 7, 8, or 9.';
      } else {
        cleanMobileDigits = digits;
      }
    }

    // 4. Emergency Contact Validation
    const trimmedEmergency = formData.emergencyContact.trim();
    let cleanEmergencyDigits = '';
    if (!trimmedEmergency) {
      errors.emergencyContact = 'Emergency contact is required.';
    } else if (/[a-zA-Z]/.test(trimmedEmergency) || !/^[+\d\s()-]+$/.test(trimmedEmergency)) {
      errors.emergencyContact = 'Enter a valid emergency contact with digits only.';
    } else {
      let digits = trimmedEmergency.replace(/\D/g, '');
      if (digits.length === 12 && digits.startsWith('91')) {
        digits = digits.slice(2);
      } else if (digits.length === 11 && digits.startsWith('0')) {
        digits = digits.slice(1);
      }

      if (digits.length < 10) {
        errors.emergencyContact = 'Emergency contact must be 10 digits.';
      } else if (digits.length > 10) {
        errors.emergencyContact = 'Emergency contact cannot exceed 10 digits.';
      } else if (!/^[6-9]/.test(digits)) {
        errors.emergencyContact = 'Emergency contact must start with 6, 7, 8, or 9.';
      } else {
        cleanEmergencyDigits = digits;
      }
    }

    // Prohibit identical mobile and emergency contact numbers
    if (cleanMobileDigits && cleanEmergencyDigits && cleanMobileDigits === cleanEmergencyDigits) {
      errors.emergencyContact = "Emergency contact cannot be the same as rider's mobile number.";
    }

    const cleanMobile = cleanMobileDigits || formData.mobile.replace(/\s+/g, '');
    const cleanEmergency = cleanEmergencyDigits || formData.emergencyContact.replace(/\s+/g, '');

    // 5. Blood Group
    if (!formData.bloodGroup) {
      errors.bloodGroup = 'Please select a blood group.';
    }

    // 6. Age: not above 60 and less than 18
    const ageNum = parseInt(formData.age, 10);
    if (!formData.age.trim() || isNaN(ageNum)) {
      errors.age = 'Age is required.';
    } else if (ageNum < 18 || ageNum > 60) {
      errors.age = 'Age must be between 18 and 60 years.';
    }

    // 7. Gender
    if (!formData.gender) {
      errors.gender = 'Please select a gender.';
    }

    // 8. Club
    if (!formData.club.trim()) {
      errors.club = 'Club name is required (or enter "Independent").';
    }

    // 9. Bicycle Type
    if (!formData.bicycleType) {
      errors.bicycleType = 'Please select a bicycle type.';
    }

    // 10. Jersey Number
    if (!formData.jerseyNumber.trim()) {
      errors.jerseyNumber = 'Jersey number is required.';
    }

    // 11. Medical Notes
    if (!formData.medicalNotes.trim()) {
      errors.medicalNotes = 'Medical notes are required (enter "None" if no conditions).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Target Event ID
    const selectedEv = availableEvents.find((e) => e.name === formData.event);
    const targetEventId = selectedEv?.id || eventId;

    if (!targetEventId) {
      setFormErrors({ event: 'Target event ID not found. Please create an event first.' });
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const created = await riderService.createRider(targetEventId, {
        name: formData.name.trim(),
        mobile: cleanMobile,
        emergencyContact: cleanEmergency,
        bloodGroup: formData.bloodGroup,
        age: ageNum,
        gender: formData.gender,
        club: formData.club.trim(),
        bicycleType: formData.bicycleType,
        jerseyNumber: formData.jerseyNumber.trim(),
        medicalNotes: formData.medicalNotes.trim(),
      });

      setRegisteredRiderSummary({
        riderId: created.riderId || created.id,
        name: created.name,
        event: formData.event,
        jerseyNumber: String(created.jerseyNumber || formData.jerseyNumber),
      });
      setIsSuccess(true);
    } catch (err: any) {
      setFormErrors({ name: err?.message || 'Failed to register rider. Please verify backend connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventNames = availableEvents.map((e) => e.name);

  return (
    <Box sx={{ width: '100%' }}>
      {/* 1. Header with Breadcrumb, Title, Subtitle, and Back Action */}
      <RegisterRiderHeader onBack={onNavigateBack} />

      {/* 2. Form or Success State */}
      {isSuccess ? (
        <RegisterRiderSuccess
          summary={registeredRiderSummary}
          onGenerateQrCode={() => setIsQrModalOpen(true)}
          onBackToRiders={onNavigateBack}
        />
      ) : (
        <RegisterRiderForm
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          events={eventNames}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onCancel={onNavigateBack}
        />
      )}

      {/* 3. QR Code Security Modal */}
      <QrNoticeModal
        open={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        riderId={registeredRiderSummary.riderId}
        riderName={registeredRiderSummary.name}
      />
    </Box>
  );
};
