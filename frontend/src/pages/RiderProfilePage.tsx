import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { RiderProfileHeader } from '../components/riders/RiderProfileHeader';
import { RiderSummaryCard } from '../components/riders/RiderSummaryCard';
import { RiderInformationCard } from '../components/riders/RiderInformationCard';
import { RiderQRCodeCard } from '../components/riders/RiderQRCodeCard';
import { RiderTimeline } from '../components/riders/RiderTimeline';
import { MedicalNotesCard } from '../components/riders/MedicalNotesCard';
import { RiderProfileActions } from '../components/riders/RiderProfileActions';
import { EditRiderModal } from '../components/riders/EditRiderModal';
import { RiderProfileData } from '../components/riders/mockRiderProfileData';
import { RiderStatus } from '../components/riders/mockRidersData';
import { riderService, eventService } from '../api/services';
import { colors } from '../theme/colors';
import { RideButton } from '../components/ui/RideButton';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

export interface RiderProfilePageProps {
  riderId?: string;
  onNavigateBack: () => void;
}

export const RiderProfilePage: React.FC<RiderProfilePageProps> = ({
  riderId,
  onNavigateBack,
}) => {
  const [profile, setProfile] = useState<RiderProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(riderId));
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [verifyingPayment, setVerifyingPayment] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (riderId) {
      setLoading(true);
      riderService
        .getRider(riderId)
        .then(async (r) => {
          if (!isMounted) return;
          const ev = r.eventId ? await eventService.getEvent(r.eventId).catch(() => null) : null;
          if (!isMounted) return;
          setProfile({
            id: r.riderId || r.id,
            name: r.name,
            mobile: r.mobile,
            emergencyContact: r.emergencyContact || 'Not provided',
            bloodGroup: r.bloodGroup || 'O+',
            age: r.age || 25,
            gender: r.gender || 'Not specified',
            club: r.club || 'Independent',
            bicycleType: r.bicycleType || 'Road Bike',
            jerseyNumber: r.jerseyNumber || 101,
            event: ev?.eventName || 'Cycling Event',
            rideDistance: ev?.rideDistance ? `${ev.rideDistance} km` : '',
            status: (r.status === 'Completed' || r.status === 'finished'
              ? 'Finished'
              : r.status === 'In-Transit' || r.status === 'started'
              ? 'Active'
              : r.status === 'DNF' || r.status === 'dnf'
              ? 'DNF'
              : 'Registered') as RiderStatus,
            paymentStatus: r.paymentStatus || (r.paymentRequired ? 'pending' : 'verified'),
            paymentRequired: r.paymentRequired !== undefined ? r.paymentRequired : false,
            medicalNotes: r.medicalNotes || 'No known medical information provided.',
            timeline: (r.timeline || []).map((t: any) => ({
              sequence: t.sequence || '01',
              name: t.name || 'Checkpoint',
              type: t.type || 'Checkpoint',
              status: t.status || 'Pending',
              time: t.time ? new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            })),
          });
        })
        .catch((err) => {
          console.error('Failed to load rider profile:', err);
          if (isMounted) setProfile(null);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [riderId]);

  const handleVerifyPayment = async () => {
    if (!profile) return;
    setVerifyingPayment(true);
    try {
      await riderService.updatePaymentStatus(profile.id, 'verified');
      setProfile((prev) => (prev ? { ...prev, paymentStatus: 'verified' } : null));
    } catch (err) {
      console.error('Failed to verify payment:', err);
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleMarkPending = async () => {
    if (!profile) return;
    setVerifyingPayment(true);
    try {
      await riderService.updatePaymentStatus(profile.id, 'pending');
      setProfile((prev) => (prev ? { ...prev, paymentStatus: 'pending' } : null));
    } catch (err) {
      console.error('Failed to mark payment pending:', err);
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: colors.text.secondary }}>
        Loading rider profile...
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ width: '100%', pb: 4 }}>
        <RiderProfileHeader riderName="Rider Profile" onBack={onNavigateBack} />
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: colors.surface.card,
            borderRadius: '8px',
            border: `1px solid ${colors.surface.borderStrong}`,
            mt: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: colors.text.secondary }}>
            Rider profile not found.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* 1. Global Header with Breadcrumbs and Back Action */}
      <RiderProfileHeader
        riderName={profile.name}
        onBack={onNavigateBack}
      />

      {/* 2. Prominent Rider Summary Card */}
      <RiderSummaryCard profile={profile} />

      {/* Organizer Payment Verification Action Banner */}
      {profile.paymentStatus === 'pending' && (
        <Box
          id="organizer-payment-verification-banner"
          sx={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '8px',
            p: 2.5,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PaymentOutlinedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem', color: '#92400E' }}>
                Payment Verification Pending
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#B45309' }}>
                Rider payment is currently marked as pending. Mark as paid / verified below.
              </Typography>
            </Box>
          </Box>

          <RideButton
            id="btn-verify-payment"
            variant="primary"
            size="sm"
            disabled={verifyingPayment}
            onClick={handleVerifyPayment}
            sx={{
              minWidth: 180,
              fontWeight: 700,
              backgroundColor: '#059669',
              '&:hover': { backgroundColor: '#047857' },
              whiteSpace: 'nowrap',
            }}
          >
            {verifyingPayment ? 'Verifying...' : 'Mark as Paid / Verified'}
          </RideButton>
        </Box>
      )}

      {profile.paymentStatus === 'verified' && (
        <Box
          id="organizer-payment-verified-banner"
          sx={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '8px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            mb: 3,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircleOutlinedIcon sx={{ fontSize: 22, color: '#059669' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#065F46' }}>
              Payment Status: Paid / Verified — QR Timing Pass is Active
            </Typography>
          </Box>
          <RideButton
            id="btn-mark-pending"
            variant="secondary"
            size="sm"
            disabled={verifyingPayment}
            onClick={handleMarkPending}
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {verifyingPayment ? 'Updating...' : 'Mark as Pending'}
          </RideButton>
        </Box>
      )}

      {/* 3. Main Content: 2-Column Responsive Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
          gap: { xs: 2.5, sm: 3 },
          alignItems: 'start',
          mt: 3,
        }}
      >
        {/* Left Column: Rider Information & Medical Notes */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
          <RiderInformationCard
            profile={profile}
            onEditRider={() => setIsEditModalOpen(true)}
          />

          <MedicalNotesCard notes={profile.medicalNotes} />
        </Box>

        {/* Right Column: QR Code Card & Ride Timeline */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
          <RiderQRCodeCard
            riderId={profile.id}
            paymentRequired={profile.paymentRequired}
            paymentStatus={profile.paymentStatus}
          />

          <RiderTimeline timeline={profile.timeline} />
        </Box>
      </Box>

      {/* 4. Page Bottom Actions */}
      <RiderProfileActions
        onBack={onNavigateBack}
        onEdit={() => setIsEditModalOpen(true)}
      />

      {/* 5. Edit Rider Modal */}
      <EditRiderModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        riderName={profile.name}
        riderId={profile.id}
      />
    </Box>
  );
};
