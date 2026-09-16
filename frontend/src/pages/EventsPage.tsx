import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { PageContainer } from '../components/layout/PageContainer';
import { EventsPageHeader } from '../components/events/EventsPageHeader';
import { EventsToolbar, StatusFilterType } from '../components/events/EventsToolbar';
import { EventTable } from '../components/events/EventTable';
import { EventCard } from '../components/events/EventCard';
import { EmptyEventsState } from '../components/events/EmptyEventsState';
import { NoSearchResultsState } from '../components/events/NoSearchResultsState';
import { RideEvent } from '../components/events/mockEventsData';

export interface EventsPageProps {
  events?: RideEvent[];
  onNavigateCreateEvent?: () => void;
  onNavigateEventDetails?: (eventId: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events = [],
  onNavigateCreateEvent,
  onNavigateEventDetails,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>('all');

  // Calculate status counts from real dataset
  const statusCounts = useMemo(() => {
    return {
      all: events.length,
      upcoming: events.filter((e) => e.status === 'upcoming').length,
      active: events.filter((e) => e.status === 'active').length,
      completed: events.filter((e) => e.status === 'completed').length,
    };
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Status Filter
      if (selectedStatus !== 'all' && event.status !== selectedStatus) {
        return false;
      }

      // 2. Search Query (name or location)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = event.name.toLowerCase().includes(query);
        const matchesLocation = event.location.toLowerCase().includes(query);
        if (!matchesName && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedStatus, searchQuery]);

  const handleCreateEventClick = () => {
    onNavigateCreateEvent?.();
  };

  const handleViewEventClick = (event: RideEvent) => {
    onNavigateEventDetails?.(event.id);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
  };

  return (
    <PageContainer>
      {/* 1. Page Header with Title, Supporting Text & Create Event CTA */}
      <EventsPageHeader onCreateEvent={handleCreateEventClick} />

      {/* 2. Main Content Area */}
      {events.length === 0 ? (
        <EmptyEventsState onCreateEvent={handleCreateEventClick} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Search and Status Filter Toolbar */}
          <EventsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            statusCounts={statusCounts}
          />

          {/* Events List or Search Empty State */}
          {filteredEvents.length === 0 ? (
            <NoSearchResultsState onClearFilters={handleClearFilters} />
          ) : (
            <Box>
              {/* Desktop Table View (Visible on md+) */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <EventTable
                  events={filteredEvents}
                  onViewEvent={handleViewEventClick}
                />
              </Box>

              {/* Mobile / Tablet Stacked Cards View (Visible on < md) */}
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <EventCard
                  events={filteredEvents}
                  onViewEvent={handleViewEventClick}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </PageContainer>
  );
};
