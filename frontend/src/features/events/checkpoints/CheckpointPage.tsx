import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { PageContainer } from '../../../components/layout/PageContainer';
import {
  CheckpointHeader,
} from './CheckpointHeader';
import { EventSummaryStrip } from './EventSummaryStrip';
import { CheckpointSummary } from './CheckpointSummary';
import { CheckpointTimeline } from './CheckpointTimeline';
import { EmptyCheckpointState } from './EmptyCheckpointState';
import { AddCheckpointDialog } from './AddCheckpointDialog';
import { EditCheckpointDialog } from './EditCheckpointDialog';
import { DeleteCheckpointDialog } from './DeleteCheckpointDialog';
import {
  CheckpointItem,
  EventSummaryInfo,
} from './mockCheckpointData';
import { checkpointService, eventService, volunteerService } from '../../../api/services';

export interface CheckpointPageProps {
  eventId?: string;
  onNavigateBackToEvent?: () => void;
  onNavigateAddCheckpoint?: () => void;
}

export const CheckpointPage: React.FC<CheckpointPageProps> = ({
  eventId,
  onNavigateBackToEvent,
  onNavigateAddCheckpoint,
}) => {
  const [checkpoints, setCheckpoints] = useState<CheckpointItem[]>([]);
  const [eventSummary, setEventSummary] = useState<EventSummaryInfo>({
    id: eventId || '',
    name: 'Event Checkpoints',
    status: 'Upcoming',
    date: 'Date not set',
    location: 'Location not set',
    distanceKm: 0,
    organizer: 'Organizer',
  });
  const [assignedVolunteersCount, setAssignedVolunteersCount] = useState<number>(0);
  const [, setLoading] = useState<boolean>(Boolean(eventId));

  // Dialog Controls
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<CheckpointItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<CheckpointItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load real checkpoints and event info from API
  const loadData = () => {
    if (!eventId) {
      setCheckpoints([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      eventService.getEvent(eventId).catch(() => null),
      checkpointService.listCheckpoints(eventId).catch(() => []),
      volunteerService.listVolunteers(eventId).catch(() => []),
    ])
      .then(([ev, cpData, volData]) => {
        if (ev) {
          setEventSummary({
            id: ev.id,
            name: ev.eventName || 'Untitled Event',
            status: ev.status === 'active' ? 'Active' : ev.status === 'completed' ? 'Completed' : ev.status === 'draft' ? 'Draft' : 'Upcoming',
            date: ev.rideDate || 'Date not set',
            location: ev.location || 'Location not set',
            distanceKm: Number(ev.rideDistance) || 0,
            organizer: ev.organizerName || 'Organizer',
          });
        }

        const volsWithCp = volData.filter((v: any) => Boolean(v.checkpointId || v.assignedCheckpointId)).length;
        setAssignedVolunteersCount(volsWithCp);

        if (Array.isArray(cpData)) {
          const mapped: CheckpointItem[] = cpData.map((cp: any, idx: number) => ({
            id: cp.id,
            sequence: cp.sequenceNumber || idx + 1,
            name: cp.name,
            type: (cp.type === 'Start' ? 'Start' : cp.type === 'Finish' ? 'Finish' : cp.type === 'Hydration' ? 'Refreshment' : 'Checkpoint') as any,
            requirement: (cp.isMandatory || cp.mandatory) ? 'Mandatory' : 'Optional',
            latitude: cp.latitude,
            longitude: cp.longitude,
            volunteersAssigned: volData.filter((v: any) => (v.checkpointId || v.assignedCheckpointId) === cp.id).length,
          }));
          setCheckpoints(mapped);
        } else {
          setCheckpoints([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load checkpoint data:', err);
        setCheckpoints([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleOpenAdd = () => {
    if (onNavigateAddCheckpoint) {
      onNavigateAddCheckpoint();
    } else {
      setIsAddOpen(true);
    }
  };

  // Open Edit Dialog
  const handleEditCheckpoint = (cp: CheckpointItem) => {
    setSelectedCheckpoint(cp);
    setIsEditOpen(true);
  };

  // Open Delete Confirmation Dialog
  const handleDeleteCheckpoint = (cp: CheckpointItem) => {
    setDeleteTarget(cp);
    setIsDeleteOpen(true);
  };

  // Save Add
  const handleSaveAdd = async (newCp: Omit<CheckpointItem, 'id' | 'volunteersAssigned'>) => {
    if (eventId) {
      try {
        const created = await checkpointService.createCheckpoint(eventId, {
          name: newCp.name,
          sequenceNumber: Number(newCp.sequence) || (checkpoints.length + 1),
          type: newCp.type,
          mandatory: newCp.requirement === 'Mandatory',
          latitude: newCp.latitude,
          longitude: newCp.longitude,
        });

        const item: CheckpointItem = {
          id: created.id,
          sequence: created.sequenceNumber || (checkpoints.length + 1),
          name: created.name,
          type: (created.type === 'Start' ? 'Start' : created.type === 'Finish' ? 'Finish' : created.type === 'Hydration' ? 'Refreshment' : 'Checkpoint') as any,
          requirement: created.mandatory ? 'Mandatory' : 'Optional',
          latitude: created.latitude,
          longitude: created.longitude,
          volunteersAssigned: 0,
        };

        setCheckpoints((prev) => [...prev, item]);
        setIsAddOpen(false);
        setToastMessage(`Checkpoint "${item.name}" added successfully.`);
      } catch (err: any) {
        setToastMessage(err?.message || 'Failed to add checkpoint.');
      }
    } else {
      setIsAddOpen(false);
    }
  };

  // Save Edit
  const handleSaveEdit = async (updated: CheckpointItem) => {
    if (eventId) {
      try {
        await checkpointService.updateCheckpoint(updated.id, {
          name: updated.name,
          sequenceNumber: Number(updated.sequence) || 1,
          type: updated.type,
          mandatory: updated.requirement === 'Mandatory',
          latitude: updated.latitude,
          longitude: updated.longitude,
        });

        setCheckpoints((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
        setIsEditOpen(false);
        setToastMessage(`Checkpoint "${updated.name}" updated successfully.`);
      } catch (err: any) {
        setToastMessage(err?.message || 'Failed to update checkpoint.');
      }
    } else {
      setIsEditOpen(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async (id: string) => {
    if (eventId) {
      try {
        await checkpointService.deleteCheckpoint(id);
        setCheckpoints((prev) => prev.filter((c) => c.id !== id));
        setIsDeleteOpen(false);
        setToastMessage(`Checkpoint removed from event route.`);
      } catch (err: any) {
        setToastMessage(err?.message || 'Failed to delete checkpoint.');
      }
    } else {
      setIsDeleteOpen(false);
    }
  };

  const totalCount = checkpoints.length;
  const mandatoryCount = checkpoints.filter((c) => c.requirement === 'Mandatory').length;
  const optionalCount = checkpoints.filter((c) => c.requirement === 'Optional').length;
  const volunteersAssignedStr = totalCount > 0 ? `${assignedVolunteersCount} / ${totalCount * 2}` : '0';

  return (
    <PageContainer maxWidth="lg">
      {/* 1. Page Header with Breadcrumbs and Actions */}
      <CheckpointHeader
        onBackToEvent={onNavigateBackToEvent}
        onAddCheckpoint={handleOpenAdd}
      />

      {/* 2. Event Summary Strip */}
      <EventSummaryStrip event={eventSummary} />

      {/* 3. Checkpoint Summary Metric Cards */}
      <CheckpointSummary
        total={totalCount}
        mandatory={mandatoryCount}
        optional={optionalCount}
        volunteersAssignedText={volunteersAssignedStr}
      />

      {/* 4. Empty State or Timeline */}
      {checkpoints.length === 0 ? (
        <EmptyCheckpointState onAddCheckpoint={handleOpenAdd} />
      ) : (
        <CheckpointTimeline
          checkpoints={checkpoints}
          onEdit={handleEditCheckpoint}
          onDelete={handleDeleteCheckpoint}
        />
      )}

      {/* Add Checkpoint Dialog */}
      <AddCheckpointDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleSaveAdd}
      />

      {/* Edit Checkpoint Dialog */}
      {selectedCheckpoint && (
        <EditCheckpointDialog
          open={isEditOpen}
          checkpoint={selectedCheckpoint}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Checkpoint Dialog */}
      {deleteTarget && (
        <DeleteCheckpointDialog
          open={isDeleteOpen}
          checkpoint={deleteTarget}
          onClose={() => setIsDeleteOpen(false)}
          onConfirmDelete={handleConfirmDelete}
        />
      )}

      {/* Toast feedback */}
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
    </PageContainer>
  );
};
