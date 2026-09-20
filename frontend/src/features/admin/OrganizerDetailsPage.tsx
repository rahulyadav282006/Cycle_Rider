import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import { colors } from '../../theme/colors';
import { RideBadge } from '../../components/ui/RideBadge';
import { RideButton } from '../../components/ui/RideButton';
import { MockOrganizer } from './mockAdminData';
import { adminService } from '../../api/services';

export type OrganizerDetailsState = 'populated' | 'empty_events';

export interface OrganizerDetailsPageProps {
  organizerId?: string;
  onBack: () => void;
  onViewEvent: (eventId: string) => void;
}

export const OrganizerDetailsPage: React.FC<OrganizerDetailsPageProps> = ({
  organizerId = '',
  onBack,
  onViewEvent,
}) => {
  const [prototypeState, setPrototypeState] = useState<OrganizerDetailsState>('populated');
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [organizer, setOrganizer] = useState<MockOrganizer>({
    id: organizerId || '',
    name: 'Organizer',
    email: '',
    mobile: '',
    organization: '',
    eventsCount: 0,
    activeEventsCount: 0,
    completedEventsCount: 0,
    totalRiders: 0,
    status: 'Active',
    joinedDate: '',
    recentEvents: [],
  });

  // Editable fields for Edit Organizer dialog
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editStatus, setEditStatus] = useState<MockOrganizer['status']>('Active');

  useEffect(() => {
    let isMounted = true;
    adminService.getOrganizers().then((data) => {
      if (!isMounted || !Array.isArray(data)) return;
      const found = data.find((o: any) => o.id === organizerId);
      if (found) {
        const mapped: MockOrganizer = {
          id: found.id,
          name: found.name,
          email: found.email,
          mobile: found.mobile || '',
          organization: found.organization || 'Independent Organizer',
          eventsCount: found.eventsCount || 0,
          activeEventsCount: found.activeEventsCount || 0,
          completedEventsCount: found.completedEventsCount || 0,
          totalRiders: found.totalRiders || 0,
          status: found.status === 'Active' ? 'Active' : found.status === 'Inactive' ? 'Inactive' : 'Pending',
          joinedDate: found.joinedDate || '',
          recentEvents: (found.recentEvents || []).map((e: any) => ({
            id: e.id,
            name: e.name,
            date: e.date,
            location: e.location,
            distance: e.distance,
            status: (e.status === 'active' ? 'active' : e.status === 'completed' ? 'completed' : 'upcoming') as 'active' | 'upcoming' | 'completed',
          })),
        };
        setOrganizer(mapped);
        setEditName(mapped.name);
        setEditEmail(mapped.email);
        setEditStatus(mapped.status);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, [organizerId]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getStatusBadge = (status: MockOrganizer['status']) => {
    if (status === 'Active') {
      return <RideBadge status="active" label="Active" size="sm" />;
    }
    if (status === 'Pending') {
      return <RideBadge status="pending" label="Pending" size="sm" />;
    }
    return <RideBadge status="draft" label="Inactive" size="sm" />;
  };

  const eventsToShow = prototypeState === 'empty_events' ? [] : organizer.recentEvents;

  const handleSaveEdit = () => {
    setEditDialogOpen(false);
    setToastMessage('Organizer details updated successfully.');
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Prototype State Switcher */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          mb: 3,
          p: 1.25,
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
          <LayersOutlinedIcon sx={{ fontSize: 16, color: colors.primary.main }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: colors.text.secondary,
              textTransform: 'uppercase',
            }}
          >
            Organizer Detail States:
          </Typography>
        </Box>
        {(
          [
            { key: 'populated', label: '1. Populated (With Events)' },
            { key: 'empty_events', label: '2. Empty Events' },
          ] as const
        ).map((st) => {
          const isSelected = prototypeState === st.key;
          return (
            <Box
              key={st.key}
              component="button"
              type="button"
              onClick={() => setPrototypeState(st.key)}
              sx={{
                px: 1.25,
                py: 0.35,
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 700 : 500,
                border: '1px solid',
                borderColor: isSelected ? colors.primary.main : colors.surface.borderStrong,
                backgroundColor: isSelected ? colors.brand.accentLight : 'transparent',
                color: isSelected ? colors.primary.dark : colors.text.secondary,
                cursor: 'pointer',
              }}
            >
              {st.label}
            </Box>
          );
        })}
      </Box>

      {/* Breadcrumb: RideTrack > Organizers > Organizer Details */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: colors.text.muted,
          fontSize: '0.75rem',
          mb: 1.5,
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>RideTrack</Typography>
        <NavigateNextIcon sx={{ fontSize: 14 }} />
        <Typography
          component="button"
          onClick={onBack}
          sx={{
            background: 'none',
            border: 'none',
            p: 0,
            fontSize: '0.75rem',
            color: colors.text.secondary,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Organizers
        </Typography>
        <NavigateNextIcon sx={{ fontSize: 14 }} />
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.primary.main }}>
          Organizer Details
        </Typography>
      </Box>

      {/* Back Button */}
      <Box
        component="button"
        type="button"
        onClick={onBack}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          backgroundColor: 'transparent',
          border: 'none',
          color: colors.text.secondary,
          fontSize: '0.8125rem',
          fontWeight: 600,
          cursor: 'pointer',
          mb: 2,
          p: 0,
          '&:hover': { color: colors.primary.main },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 16 }} />
        Back to Organizers
      </Box>

      {/* Header Info Card */}
      <Card
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '10px',
          boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
          mb: 3.5,
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  backgroundColor: colors.primary.light,
                  color: colors.primary.dark,
                  border: `2px solid #BAE6FD`,
                }}
              >
                {getInitials(editName)}
              </Avatar>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      fontWeight: 800,
                      color: colors.text.primary,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {editName}
                  </Typography>
                  {getStatusBadge(editStatus)}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1,
                      py: 0.25,
                      borderRadius: '9999px',
                      backgroundColor: colors.brand.accentLight,
                      color: colors.brand.accentHover,
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                    }}
                  >
                    <ShieldOutlinedIcon sx={{ fontSize: 13 }} />
                    {organizer.id}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                    color: colors.text.secondary,
                    fontSize: '0.8125rem',
                  }}
                >
                  {organizer.organization && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CorporateFareOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                      {organizer.organization}
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MailOutlineOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                    {editEmail}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                    Joined {organizer.joinedDate}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Edit Organizer Button */}
            <Box sx={{ flexShrink: 0 }}>
              <RideButton
                variant="secondary"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
              >
                <EditOutlinedIcon sx={{ fontSize: 15, mr: 0.75 }} />
                Edit Organizer
              </RideButton>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Organizer Stats: Total Events, Status, Joined */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: colors.surface.subtle }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase' }}>
                Total Events
              </Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: colors.text.primary, mt: 0.5 }}>
                {prototypeState === 'empty_events' ? 0 : organizer.eventsCount}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: colors.surface.subtle }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase' }}>
                Account Status
              </Typography>
              <Box sx={{ mt: 1 }}>
                {getStatusBadge(editStatus)}
              </Box>
            </Box>

            <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: colors.surface.subtle }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase' }}>
                Joined Date
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: colors.text.primary, mt: 0.75 }}>
                {organizer.joinedDate}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Simple Events Section */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: colors.text.primary,
            mb: 0.5,
          }}
        >
          Events
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mb: 2 }}>
          Events belonging to this organizer on RideTrack
        </Typography>

        {eventsToShow.length > 0 ? (
          <TableContainer
            sx={{
              backgroundColor: colors.surface.card,
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '10px',
              boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
              overflowX: 'auto',
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.surface.subtle }}>
                  <TableCell sx={{ py: 1.5, px: 2.5, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary }}>
                    Event
                  </TableCell>
                  <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary }}>
                    Location
                  </TableCell>
                  <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary }}>
                    Distance
                  </TableCell>
                  <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary }}>
                    Status
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.5, px: 2.5, fontSize: '0.75rem', fontWeight: 700, color: colors.text.secondary }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventsToShow.map((ev) => (
                  <TableRow key={ev.id} hover>
                    <TableCell sx={{ py: 2, px: 2.5, fontWeight: 700, color: colors.text.primary }}>
                      {ev.name}
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2, fontSize: '0.875rem', color: colors.text.secondary }}>
                      {ev.date}
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2, fontSize: '0.875rem', color: colors.text.secondary }}>
                      {ev.location}
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2, fontSize: '0.875rem', color: colors.text.secondary }}>
                      {ev.distance}
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <RideBadge
                        status={ev.status === 'upcoming' ? 'upcoming' : ev.status === 'active' ? 'active' : 'completed'}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2, px: 2.5 }}>
                      <RideButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewEvent(ev.id)}
                      >
                        <VisibilityOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        View Event
                      </RideButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* Empty events state */
          <Card
            sx={{
              p: 5,
              backgroundColor: colors.surface.card,
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: colors.surface.subtle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.5,
                color: colors.text.muted,
                border: `1px solid ${colors.surface.border}`,
              }}
            >
              <EventBusyOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: colors.text.primary, mb: 0.5 }}>
              No Events Found
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, maxWidth: 360, mx: 'auto' }}>
              This organizer does not have any cycling events registered yet.
            </Typography>
          </Card>
        )}
      </Box>

      {/* Edit Organizer Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '10px',
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.125rem', color: colors.text.primary }}>
          Edit Organizer
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                Organizer Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                Status
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as MockOrganizer['status'])}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <RideButton variant="secondary" size="sm" onClick={() => setEditDialogOpen(false)}>
            Cancel
          </RideButton>
          <RideButton variant="primary" size="sm" onClick={handleSaveEdit}>
            Save Changes
          </RideButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
      >
        <Alert severity="success" onClose={() => setToastMessage(null)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
