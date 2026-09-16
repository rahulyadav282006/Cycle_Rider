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
import { riderService } from '../api/services';
import { colors } from '../theme/colors';

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

  useEffect(() => {
    let isMounted = true;
    if (riderId) {
      setLoading(true);
      riderService
        .getRider(riderId)
        .then((r) => {
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
            event: 'Cycling Event',
            rideDistance: '200 km',
            status: (r.status === 'Completed' || r.status === 'finished'
              ? 'Finished'
              : r.status === 'In-Transit' || r.status === 'started'
              ? 'Active'
              : r.status === 'DNF' || r.status === 'dnf'
              ? 'DNF'
              : 'Registered') as RiderStatus,
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
          <RiderQRCodeCard riderId={profile.id} />

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
