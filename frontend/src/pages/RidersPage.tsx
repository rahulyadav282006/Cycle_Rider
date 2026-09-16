import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import {
  Rider,
  RiderStatus,
  RiderSummaryMetrics,
} from '../components/riders/mockRidersData';
import { RidersPageHeader } from '../components/riders/RidersPageHeader';
import { RiderSummaryCards } from '../components/riders/RiderSummaryCards';
import { RidersToolbar, RiderStatusFilter } from '../components/riders/RidersToolbar';
import { RidersTable } from '../components/riders/RidersTable';
import { RiderCard } from '../components/riders/RiderCard';
import { RidersPagination } from '../components/riders/RidersPagination';
import { EmptyRidersState } from '../components/riders/EmptyRidersState';
import { NoRiderSearchResultsState } from '../components/riders/NoRiderSearchResultsState';
import {
  RiderProfileModal,
  RegisterRiderNoticeModal,
} from '../components/riders/RiderActionModal';

import { riderService, eventService } from '../api/services';

export interface RidersPageProps {
  eventId?: string;
  onNavigateRegisterRider?: () => void;
  onViewRider?: (rider: Rider) => void;
}

export const RidersPage: React.FC<RidersPageProps> = ({
  eventId,
  onNavigateRegisterRider,
  onViewRider,
}) => {
  const [ridersList, setRidersList] = useState<Rider[]>([]);
  const [, setEventName] = useState<string>('Event');
  const [, setLoading] = useState<boolean>(Boolean(eventId));

  // Load real riders from API
  useEffect(() => {
    let isMounted = true;
    if (!eventId) {
      setRidersList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      eventService.getEvent(eventId).catch(() => null),
      riderService.listRiders(eventId).catch(() => []),
    ])
      .then(([ev, data]) => {
        if (!isMounted) return;
        if (ev) {
          setEventName(ev.eventName);
        }
        if (Array.isArray(data)) {
          const mapped: Rider[] = data.map((r: any) => ({
            id: r.riderId || r.id,
            name: r.name,
            mobile: r.mobile,
            jerseyNo: parseInt(r.jerseyNumber) || 101,
            event: ev?.eventName || 'Event',
            bicycleType: r.bicycleType || 'Road Bike',
            status: (r.status === 'Completed' || r.status === 'finished'
              ? 'Finished'
              : r.status === 'In-Transit' || r.status === 'started'
              ? 'Active'
              : r.status === 'DNF' || r.status === 'dnf'
              ? 'DNF'
              : 'Registered') as RiderStatus,
            emergencyContact: {
              name: 'Emergency Contact',
              relation: 'Family',
              phone: r.emergencyContact || r.mobile,
            },
            bloodGroup: r.bloodGroup || 'O+',
            registeredDate: r.createdAt
              ? new Date(r.createdAt).toLocaleDateString()
              : new Date().toLocaleDateString(),
          }));
          setRidersList(mapped);
        } else {
          setRidersList([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load riders list:', err);
        if (isMounted) setRidersList([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('All Events');
  const [selectedStatus, setSelectedStatus] = useState<RiderStatusFilter>('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Modal State
  const [selectedRiderForView, setSelectedRiderForView] = useState<Rider | null>(null);
  const [isRegisterNoticeOpen, setIsRegisterNoticeOpen] = useState<boolean>(false);

  // Dynamic Summary Metrics computed from actual ridersList
  const dynamicSummary: RiderSummaryMetrics = useMemo(() => {
    const todayStr = new Date().toLocaleDateString();
    return {
      totalRiders: ridersList.length,
      activeEventRiders: ridersList.filter((r) => r.status === 'Active').length,
      registeredToday: ridersList.filter((r) => r.registeredDate === todayStr).length,
    };
  }, [ridersList]);

  // Calculate status counts based on current event filter
  const statusCounts = useMemo(() => {
    const baseRiders =
      selectedEvent === 'All Events'
        ? ridersList
        : ridersList.filter((r) => r.event === selectedEvent);

    const counts: Record<RiderStatusFilter, number> = {
      All: baseRiders.length,
      Registered: baseRiders.filter((r) => r.status === 'Registered').length,
      Active: baseRiders.filter((r) => r.status === 'Active').length,
      Finished: baseRiders.filter((r) => r.status === 'Finished').length,
      DNF: baseRiders.filter((r) => r.status === 'DNF').length,
    };
    return counts;
  }, [selectedEvent, ridersList]);

  // Filter riders based on search query, event, and status
  const filteredRiders = useMemo(() => {
    return ridersList.filter((rider) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        rider.name.toLowerCase().includes(q) ||
        rider.id.toLowerCase().includes(q) ||
        rider.jerseyNo.toString().includes(q);

      const matchesEvent = selectedEvent === 'All Events' || rider.event === selectedEvent;

      const matchesStatus =
        selectedStatus === 'All' || rider.status === (selectedStatus as RiderStatus);

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [searchQuery, selectedEvent, selectedStatus, ridersList]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedEvent('All Events');
    setSelectedStatus('All');
    setCurrentPage(1);
  };

  const handleRegisterRider = () => {
    if (onNavigateRegisterRider) {
      onNavigateRegisterRider();
    } else {
      setIsRegisterNoticeOpen(true);
    }
  };

  const handleViewRider = (rider: Rider) => {
    if (onViewRider) {
      onViewRider(rider);
    } else {
      setSelectedRiderForView(rider);
    }
  };

  const totalRidersCount = filteredRiders.length;
  const totalPages = Math.max(1, Math.ceil(totalRidersCount / pageSize));

  return (
    <Box sx={{ width: '100%' }}>
      {/* 1. Page Header with Title, Subtitle, + Register Rider button */}
      <RidersPageHeader onRegisterRider={handleRegisterRider} />

      {/* 2. Rider Summary Metrics */}
      {ridersList.length > 0 && <RiderSummaryCards summary={dynamicSummary} />}

      {/* 3. Empty State or Populated List */}
      {ridersList.length === 0 ? (
        <EmptyRidersState onRegisterRider={handleRegisterRider} />
      ) : (
        <>
          {/* 3A. Search & Filter Toolbar */}
          <RidersToolbar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            selectedEvent={selectedEvent}
            onEventChange={(evt) => {
              setSelectedEvent(evt);
              setCurrentPage(1);
            }}
            selectedStatus={selectedStatus}
            onStatusChange={(st) => {
              setSelectedStatus(st);
              setCurrentPage(1);
            }}
            statusCounts={statusCounts}
          />

          {/* 3B. Main Content: Table / Cards or No Search Results */}
          {filteredRiders.length === 0 ? (
            <NoRiderSearchResultsState onClearFilters={handleClearFilters} />
          ) : (
            <>
              {/* Desktop & Tablet Table (md and up) */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <RidersTable riders={filteredRiders} onViewRider={handleViewRider} />
              </Box>

              {/* Mobile Stacked Cards (below md) */}
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <RiderCard riders={filteredRiders} onViewRider={handleViewRider} />
              </Box>

              {/* 3C. Pagination */}
              <RidersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalRidersCount}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </>
      )}

      {/* 4. Action & Notice Modals */}
      <RiderProfileModal
        open={Boolean(selectedRiderForView)}
        onClose={() => setSelectedRiderForView(null)}
        rider={selectedRiderForView}
      />

      <RegisterRiderNoticeModal
        open={isRegisterNoticeOpen}
        onClose={() => setIsRegisterNoticeOpen(false)}
      />
    </Box>
  );
};
