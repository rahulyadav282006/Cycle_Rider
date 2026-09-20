import React, { useState, useEffect, useMemo } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import {
  Volunteer,
  VolunteerSummary,
} from '../components/volunteers/mockVolunteersData';
import { VolunteersPageHeader } from '../components/volunteers/VolunteersPageHeader';
import { VolunteerSummaryCards } from '../components/volunteers/VolunteerSummaryCards';
import {
  VolunteersToolbar,
  VolunteerStatusFilter,
} from '../components/volunteers/VolunteersToolbar';
import { VolunteerTable } from '../components/volunteers/VolunteerTable';
import { VolunteerCard } from '../components/volunteers/VolunteerCard';
import { AssignVolunteerDialog } from '../components/volunteers/AssignVolunteerDialog';
import { VolunteerDetailDialog } from '../components/volunteers/VolunteerDetailDialog';
import { EmptyVolunteersState } from '../components/volunteers/EmptyVolunteersState';
import { NoVolunteerSearchResultsState } from '../components/volunteers/NoVolunteerSearchResultsState';
import { volunteerService, eventService, checkpointService } from '../api/services';

export interface VolunteersPageProps {
  eventId?: string;
}

export const VolunteersPage: React.FC<VolunteersPageProps> = ({ eventId }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [eventName, setEventName] = useState<string>('Event');
  const [, setLoading] = useState<boolean>(Boolean(eventId));
  const [activeEventId, setActiveEventId] = useState<string>(eventId || '');
  const [availableEvents, setAvailableEvents] = useState<{ id: string; name: string }[]>([]);
  const [availableCheckpoints, setAvailableCheckpoints] = useState<{ id: string; name: string; sequenceNumber?: number }[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('All Events');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>('All Checkpoints');
  const [selectedStatus, setSelectedStatus] = useState<VolunteerStatusFilter>('All');

  // Dialogs State
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);
  const [selectedVolunteerForAssign, setSelectedVolunteerForAssign] = useState<Volunteer | null>(null);

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const [selectedVolunteerForDetail, setSelectedVolunteerForDetail] = useState<Volunteer | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load events list
  useEffect(() => {
    let isMounted = true;
    eventService
      .listEvents()
      .then((events) => {
        if (!isMounted) return;
        const list = events.map((e) => ({ id: e.id, name: e.eventName }));
        setAvailableEvents(list);
        if (!activeEventId && list.length > 0) {
          setActiveEventId(list[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load events list:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (eventId) {
      setActiveEventId(eventId);
    }
  }, [eventId]);

  // Fetch real volunteers and checkpoints from backend
  const loadVolunteers = () => {
    const targetId = activeEventId || eventId;
    if (!targetId) {
      setVolunteers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      eventService.getEvent(targetId).catch(() => null),
      volunteerService.listVolunteers(targetId).catch(() => []),
      checkpointService.listCheckpoints(targetId).catch(() => []),
    ])
      .then(([ev, volData, cpData]) => {
        if (ev) setEventName(ev.eventName);

        let cps: { id: string; name: string; sequenceNumber?: number }[] = [];
        if (Array.isArray(cpData)) {
          cps = cpData.map((c) => ({
            id: c.id,
            name: c.name,
            sequenceNumber: c.sequenceNumber,
          }));
          setAvailableCheckpoints(cps);
        }

        if (Array.isArray(volData)) {
          const mapped: Volunteer[] = volData.map((v: any) => {
            const matchedCp = cps.find(
              (c) => c.id === v.checkpointId || c.name.toLowerCase() === (v.checkpointId || '').toLowerCase()
            );

            // Determine accurate checkpoint name:
            // 1. Backend-returned checkpointName
            // 2. Name from matching checkpoint in list
            // 3. checkpointId itself if it's already a checkpoint name (e.g. "Start" or "Breakfast")
            // 4. If assigned but missing name, default to first available checkpoint or "Start"
            let cpName = v.checkpointName || matchedCp?.name || '';
            if (!cpName && v.checkpointId && v.checkpointId !== 'unassigned' && v.checkpointId !== 'None') {
              cpName = v.checkpointId;
            }
            if (cpName === 'Assigned Checkpoint' || !cpName) {
              if (v.status?.toLowerCase() === 'assigned') {
                cpName = cps.length > 0 ? cps[0].name : 'Start';
              } else {
                cpName = 'Unassigned';
              }
            }

            const hasAssignedCheckpoint = Boolean(
              (v.checkpointId && v.checkpointId !== 'unassigned' && v.checkpointId !== 'None') ||
              (v.checkpointName && v.checkpointName !== 'Unassigned') ||
              (v.status?.toLowerCase() === 'assigned')
            );
            const isAssigned = hasAssignedCheckpoint;

            return {
              id: v.id,
              name: v.name,
              mobile: v.mobile,
              email: `${v.name.toLowerCase().replace(/\s+/g, '.')}@volunteers.com`,
              event: ev?.eventName || 'Event',
              checkpoint: isAssigned && cpName !== 'Unassigned' ? cpName : 'Unassigned',
              checkpointId: v.checkpointId || (isAssigned ? cpName : undefined),
              status: isAssigned ? 'Assigned' : 'Unassigned',
              role: 'Timekeeper & Scanner',
              assignedDate: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            };
          });
          setVolunteers(mapped);
        } else {
          setVolunteers([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load volunteers:', err);
        setVolunteers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (activeEventId) {
      loadVolunteers();
    }
  }, [activeEventId]);

  // Calculate dynamic summary metrics
  const summary: VolunteerSummary = useMemo(() => {
    const assignedCount = volunteers.filter(
      (v) => v.status === 'Assigned' || (v.checkpoint && v.checkpoint !== 'Unassigned')
    ).length;
    return {
      totalVolunteers: volunteers.length,
      assigned: assignedCount,
      unassigned: volunteers.length - assignedCount,
    };
  }, [volunteers]);

  // Calculate status counts based on current event and checkpoint filters
  const statusCounts = useMemo(() => {
    const baseList = volunteers.filter((v) => {
      const matchEvent = selectedEvent === 'All Events' || v.event === selectedEvent;
      const matchCp =
        selectedCheckpoint === 'All Checkpoints' || v.checkpoint === selectedCheckpoint;
      return matchEvent && matchCp;
    });

    const assignedCount = baseList.filter(
      (v) => v.status === 'Assigned' || (v.checkpoint && v.checkpoint !== 'Unassigned')
    ).length;

    const counts: Record<VolunteerStatusFilter, number> = {
      All: baseList.length,
      Assigned: assignedCount,
      Unassigned: baseList.length - assignedCount,
    };
    return counts;
  }, [volunteers, selectedEvent, selectedCheckpoint]);

  // Filter volunteers based on search query, event, checkpoint, and status
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) => {
      // 1. Search Query (name or mobile)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        volunteer.name.toLowerCase().includes(q) ||
        volunteer.mobile.toLowerCase().includes(q);

      // 2. Event Filter
      const matchesEvent = selectedEvent === 'All Events' || volunteer.event === selectedEvent;

      // 3. Checkpoint Filter
      const matchesCheckpoint =
        selectedCheckpoint === 'All Checkpoints' || volunteer.checkpoint === selectedCheckpoint;

      // 4. Status Filter
      const isAssigned =
        volunteer.status === 'Assigned' || (volunteer.checkpoint && volunteer.checkpoint !== 'Unassigned');
      const volunteerStatus: VolunteerStatusFilter = isAssigned ? 'Assigned' : 'Unassigned';
      const matchesStatus = selectedStatus === 'All' || volunteerStatus === selectedStatus;

      return matchesSearch && matchesEvent && matchesCheckpoint && matchesStatus;
    });
  }, [searchQuery, selectedEvent, selectedCheckpoint, selectedStatus, volunteers]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedEvent('All Events');
    setSelectedCheckpoint('All Checkpoints');
    setSelectedStatus('All');
  };

  const handleOpenNewAssign = () => {
    setSelectedVolunteerForAssign(null);
    setIsAssignDialogOpen(true);
  };

  const handleEditAssignment = (volunteer: Volunteer) => {
    setSelectedVolunteerForAssign(volunteer);
    setIsAssignDialogOpen(true);
  };

  const handleViewDetail = (volunteer: Volunteer) => {
    setSelectedVolunteerForDetail(volunteer);
    setIsDetailDialogOpen(true);
  };

  const handleSaveVolunteer = async (data: {
    id?: string;
    name: string;
    mobile: string;
    event: string;
    checkpoint: string;
    checkpointId?: string;
  }) => {
    const targetId = activeEventId || eventId;
    if (!targetId) {
      setToastMessage('Please select an active event first.');
      return;
    }

    try {
      const selectedCp = data.checkpoint || data.checkpointId || '';
      const hasCheckpoint = Boolean(
        selectedCp &&
        selectedCp !== 'unassigned' &&
        selectedCp !== 'Unassigned'
      );
      const checkpointIdToSave = hasCheckpoint ? (data.checkpointId || data.checkpoint) : undefined;
      const checkpointNameToSave = hasCheckpoint ? data.checkpoint : undefined;

      const payload = {
        name: data.name,
        mobile: data.mobile,
        checkpointId: checkpointIdToSave,
        checkpointName: checkpointNameToSave,
        status: hasCheckpoint ? 'Assigned' : 'Unassigned',
      };

      if (data.id) {
        // Update existing volunteer
        await volunteerService.updateVolunteer(data.id, payload);
        setToastMessage(`Volunteer "${data.name}" updated successfully.`);
      } else {
        // Create new volunteer
        await volunteerService.createVolunteer(targetId, payload);
        setToastMessage(`Volunteer "${data.name}" assigned successfully.`);
      }
      setIsAssignDialogOpen(false);
      loadVolunteers();
    } catch (err: any) {
      setToastMessage(err?.message || 'Failed to save volunteer assignment.');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 1. Page Header with Title, Subtitle, & + Assign Volunteer CTA */}
      <VolunteersPageHeader onAssignVolunteer={handleOpenNewAssign} />

      {/* 2. Dynamic Volunteer Summary Metrics */}
      {volunteers.length > 0 && <VolunteerSummaryCards summary={summary} />}

      {/* 3. Empty State or Populated List */}
      {volunteers.length === 0 ? (
        <EmptyVolunteersState onAssignVolunteer={handleOpenNewAssign} />
      ) : (
        <>
          {/* 3A. Search & Filter Toolbar */}
          <VolunteersToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedEvent={selectedEvent}
            onEventChange={setSelectedEvent}
            selectedCheckpoint={selectedCheckpoint}
            onCheckpointChange={setSelectedCheckpoint}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            statusCounts={statusCounts}
            onClearFilters={handleClearFilters}
            hasActiveFilters={
              searchQuery.trim() !== '' ||
              selectedEvent !== 'All Events' ||
              selectedCheckpoint !== 'All Checkpoints' ||
              selectedStatus !== 'All'
            }
            eventOptions={availableEvents.map((e) => e.name)}
            checkpointOptions={availableCheckpoints.map((cp) => cp.name)}
          />

          {/* 3B. Content Area: Table / Cards or No Results */}
          {filteredVolunteers.length === 0 ? (
            <NoVolunteerSearchResultsState onClearFilters={handleClearFilters} />
          ) : (
            <>
              {/* Desktop Table */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <VolunteerTable
                  volunteers={filteredVolunteers}
                  onAssignVolunteer={handleEditAssignment}
                  onViewVolunteer={handleViewDetail}
                />
              </Box>

              {/* Mobile Cards */}
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <VolunteerCard
                  volunteers={filteredVolunteers}
                  onAssignVolunteer={handleEditAssignment}
                  onViewVolunteer={handleViewDetail}
                />
              </Box>
            </>
          )}
        </>
      )}

      {/* Dialog: Assign / Edit Volunteer */}
      <AssignVolunteerDialog
        open={isAssignDialogOpen}
        initialVolunteer={selectedVolunteerForAssign}
        events={availableEvents}
        checkpoints={availableCheckpoints}
        currentEventName={eventName}
        onClose={() => setIsAssignDialogOpen(false)}
        onSave={handleSaveVolunteer}
      />

      {/* Dialog: Volunteer Detail View */}
      <VolunteerDetailDialog
        open={isDetailDialogOpen}
        volunteer={selectedVolunteerForDetail}
        onClose={() => setIsDetailDialogOpen(false)}
        onEditAssignment={(v: Volunteer) => {
          setIsDetailDialogOpen(false);
          handleEditAssignment(v);
        }}
      />

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="info"
          sx={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
