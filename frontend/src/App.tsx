import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { rideTheme } from './theme/muiTheme';
import { colors } from './theme/colors';
import { AppShell } from './components/layout/AppShell';
import { AuthLayout } from './components/layout/AuthLayout';
import { ShellPreviewPage } from './pages/ShellPreviewPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { EditEventPage } from './pages/EditEventPage';
import { ConfigureCheckpointsPage } from './pages/ConfigureCheckpointsPage';
import { AddCheckpointPage } from './pages/AddCheckpointPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { RidersPage } from './pages/RidersPage';
import { RegisterRiderPage } from './pages/RegisterRiderPage';
import { RiderProfilePage } from './pages/RiderProfilePage';
import { VolunteersPage } from './pages/VolunteersPage';
import { VolunteerHomePage } from './features/volunteers/VolunteerHomePage';
import { VolunteerScannerPage } from './features/volunteers/scanner/VolunteerScannerPage';
import { LiveTrackingPage } from './features/events/live';
import { ReportsPage } from './features/reports';
import { AdminModule } from './features/admin';
import { RideButton } from './components/ui/RideButton';
import { RideEvent } from './components/events/mockEventsData';
import { authService, eventService, User } from './api/services';
import { getStoredUser } from './api/client';

export type AppRoute = 'app' | 'login' | 'register' | 'shell' | 'volunteer' | 'scanner' | 'admin';
export type EventSubView =
  | 'list'
  | 'create'
  | 'details'
  | 'edit'
  | 'checkpoints'
  | 'add-checkpoint'
  | 'live';
export type RiderSubView = 'list' | 'register' | 'profile';

export function App() {
  // Determine initial route from URL pathname
  const getInitialRoute = (): AppRoute => {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/admin')) return 'admin';
    if (path === '/volunteer/scanner' || path.startsWith('/volunteer/scanner')) return 'scanner';
    if (path === '/volunteer' || path.startsWith('/volunteer')) return 'volunteer';
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/shell') return 'shell';
    return 'app';
  };

  const getInitialNav = (): string => {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/reports')) return 'reports';
    if (path.includes('/events')) return 'events';
    if (path.startsWith('/riders')) return 'riders';
    if (path.startsWith('/volunteers')) return 'volunteers';
    return 'dashboard';
  };

  const getInitialSubView = (): EventSubView => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/live')) return 'live';
    if (path.includes('/checkpoints/new')) return 'add-checkpoint';
    if (path.includes('/checkpoints')) return 'checkpoints';
    if (path.endsWith('/edit') && path.includes('/events/')) return 'edit';
    if (path === '/events/create') return 'create';
    if (path.includes('/events/') && path !== '/events/' && path !== '/events') return 'details';
    return 'list';
  };

  const getInitialRiderId = (): string => {
    const path = window.location.pathname;
    const match = path.match(/\/riders\/([A-Za-z0-9-]+)/i);
    if (match && match[1].toLowerCase() !== 'register') {
      return match[1].toUpperCase();
    }
    return '';
  };

  const getInitialEventId = (): string => {
    const path = window.location.pathname;
    const match = path.match(/\/events\/([A-Za-z0-9-]+)/i);
    if (match && match[1].toLowerCase() !== 'create') {
      return match[1];
    }
    return '';
  };

  const getInitialRiderSubView = (): RiderSubView => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/riders/register') return 'register';
    if (path.startsWith('/riders/rt-') || path.includes('/profile') || (path.startsWith('/riders/') && path !== '/riders' && path !== '/riders/')) return 'profile';
    return 'list';
  };

  const [, setCurrentUser] = useState<User | null>(getStoredUser);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [activeNav, setActiveNav] = useState<string>(getInitialNav);
  const [eventSubView, setEventSubView] = useState<EventSubView>(getInitialSubView);
  const [riderSubView, setRiderSubView] = useState<RiderSubView>(getInitialRiderSubView);
  const [selectedRiderId, setSelectedRiderId] = useState<string>(getInitialRiderId);
  const [selectedEventId, setSelectedEventId] = useState<string>(getInitialEventId);
  const [eventsList, setEventsList] = useState<RideEvent[]>([]);

  // Fetch real events from FastAPI MongoDB backend
  useEffect(() => {
    let isMounted = true;
    eventService.listEvents()
      .then((events) => {
        if (isMounted && events) {
          const mapped: RideEvent[] = events.map((ev) => ({
            id: ev.id,
            name: ev.eventName,
            date: ev.rideDate,
            location: ev.location,
            distanceKm: ev.rideDistance,
            riderCount: ev.riderCount || 0,
            status: ev.status === 'active' ? 'active' : ev.status === 'completed' ? 'completed' : 'upcoming',
            tagline: ev.description || '',
          }));
          setEventsList(mapped);
          if (mapped.length > 0 && !selectedEventId) {
            setSelectedEventId(mapped[0].id);
          }
        }
      })
      .catch(() => {
        if (isMounted) setEventsList([]);
      });
    return () => { isMounted = false; };
  }, []);

  const handleSaveEvent = (newEvent: RideEvent) => {
    setEventsList((prev) => [newEvent, ...prev]);
    setSelectedEventId(newEvent.id);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'SUPER_ADMIN') {
      setCurrentRoute('admin');
      window.history.pushState(null, '', '/admin/dashboard');
    } else if (user.role === 'VOLUNTEER') {
      setCurrentRoute('volunteer');
      window.history.pushState(null, '', '/volunteer');
    } else {
      setCurrentRoute('app');
      setActiveNav('dashboard');
      window.history.pushState(null, '', '/dashboard');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setCurrentRoute('login');
    window.history.pushState(null, '', '/login');
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/admin')) {
        setCurrentRoute('admin');
      } else if (path === '/volunteer/scanner' || path.startsWith('/volunteer/scanner')) {
        setCurrentRoute('scanner');
      } else if (path === '/volunteer' || path.startsWith('/volunteer')) {
        setCurrentRoute('volunteer');
      } else if (path === '/login') setCurrentRoute('login');
      else if (path === '/register') setCurrentRoute('register');
      else if (path === '/shell') setCurrentRoute('shell');
      else {
        setCurrentRoute('app');
        if (path === '/dashboard') {
          setActiveNav('dashboard');
        } else if (path === '/riders/register') {
          setActiveNav('riders');
          setRiderSubView('register');
        } else if (path.startsWith('/riders/rt-') || (path.startsWith('/riders/') && path !== '/riders' && path !== '/riders/')) {
          setActiveNav('riders');
          setRiderSubView('profile');
          const parts = window.location.pathname.split('/');
          if (parts[2]) setSelectedRiderId(parts[2].toUpperCase());
        } else if (path === '/riders' || path === '/riders/') {
          setActiveNav('riders');
          setRiderSubView('list');
        } else if (path.startsWith('/volunteers')) {
          setActiveNav('volunteers');
        } else if (path.startsWith('/reports')) {
          setActiveNav('reports');
        } else if (path.includes('/live')) {
          setActiveNav('events');
          setEventSubView('live');
        } else if (path.includes('/checkpoints/new')) {
          setActiveNav('events');
          setEventSubView('add-checkpoint');
        } else if (path.includes('/checkpoints')) {
          setActiveNav('events');
          setEventSubView('checkpoints');
        } else if (path.endsWith('/edit') && path.includes('/events/')) {
          setActiveNav('events');
          setEventSubView('edit');
        } else if (path === '/events/create') {
          setActiveNav('events');
          setEventSubView('create');
        } else if (path.startsWith('/events/') && path !== '/events' && path !== '/events/') {
          setActiveNav('events');
          setEventSubView('details');
        } else if (path === '/events' || path === '/events/') {
          setActiveNav('events');
          setEventSubView('list');
        } else {
          setActiveNav('dashboard');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    const targetPath =
      route === 'admin'
        ? '/admin/dashboard'
        : route === 'login'
        ? '/login'
        : route === 'register'
        ? '/register'
        : route === 'shell'
        ? '/shell'
        : route === 'scanner'
        ? '/volunteer/scanner'
        : route === 'volunteer'
        ? '/volunteer'
        : '/dashboard';

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  const getPageTitle = (nav: string) => {
    if (nav === 'events') {
      if (eventSubView === 'details') return 'Kolhapur Endurance Ride';
      if (eventSubView === 'edit') return 'Edit Event';
      if (eventSubView === 'add-checkpoint') return 'Add Checkpoint';
      if (eventSubView === 'checkpoints') return 'Ride Checkpoints';
      if (eventSubView === 'create') return 'Create Event';
      return 'Events';
    }

    switch (nav) {
      case 'riders':
        if (riderSubView === 'register') return 'Register Rider';
        if (riderSubView === 'profile') return 'Rider Profile';
        return 'Riders';
      case 'volunteers':
        return 'Volunteers';
      case 'reports':
        return 'Reports';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  const getBreadcrumbs = (nav: string) => {
    if (nav === 'events') {
      if (eventSubView === 'details') {
        return ['RideTrack', 'Events', 'Kolhapur Endurance Ride'];
      }
      if (eventSubView === 'edit') {
        return ['RideTrack', 'Events', 'Kolhapur Endurance Ride', 'Edit Event'];
      }
      if (eventSubView === 'add-checkpoint') {
        return ['RideTrack', 'Events', 'Kolhapur Endurance Ride', 'Checkpoints', 'Add Checkpoint'];
      }
      if (eventSubView === 'checkpoints') {
        return ['RideTrack', 'Events', 'Kolhapur Endurance Ride', 'Checkpoints'];
      }
      if (eventSubView === 'create') {
        return ['RideTrack', 'Events', 'Create Event'];
      }
      return ['RideTrack', 'Events'];
    }
    if (nav === 'riders') {
      if (riderSubView === 'register') {
        return ['RideTrack', 'Riders', 'Register Rider'];
      }
      if (riderSubView === 'profile') {
        return ['RideTrack', 'Riders', 'Rahul Patil'];
      }
      return ['RideTrack', 'Riders'];
    }
    if (nav === 'volunteers') {
      return ['RideTrack', 'Volunteers'];
    }
    return ['RideTrack', getPageTitle(nav)];
  };

  return (
    <ThemeProvider theme={rideTheme}>
      <CssBaseline />

      {currentRoute === 'scanner' && (
        <VolunteerScannerPage
          onNavigateHome={() => {
            setCurrentRoute('volunteer');
            window.history.pushState(null, '', '/volunteer');
          }}
        />
      )}

      {currentRoute === 'volunteer' && (
        <VolunteerHomePage
          onLogout={handleLogout}
          onNavigateScanner={() => {
            setCurrentRoute('scanner');
            window.history.pushState(null, '', '/volunteer/scanner');
          }}
        />
      )}

      {currentRoute === 'login' && (
        <AuthLayout currentRoute="login" onNavigate={(r) => navigate(r)}>
          <LoginPage
            onNavigateRegister={() => navigate('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        </AuthLayout>
      )}

      {currentRoute === 'register' && (
        <AuthLayout currentRoute="register" onNavigate={(r) => navigate(r)}>
          <RegisterPage onNavigateLogin={() => navigate('login')} />
        </AuthLayout>
      )}

      {currentRoute === 'app' && (
        <AppShell
          activeNavId={activeNav}
          onNavChange={(id) => {
            setActiveNav(id);
            if (id === 'volunteers') {
              window.history.pushState(null, '', '/volunteers');
            } else if (id === 'riders') {
              setRiderSubView('list');
              window.history.pushState(null, '', '/riders');
            } else if (id === 'events') {
              setEventSubView('list');
              window.history.pushState(null, '', '/events');
            } else if (id === 'reports') {
              window.history.pushState(null, '', '/reports');
            } else if (id === 'dashboard') {
              window.history.pushState(null, '', '/dashboard');
            }
          }}
          pageTitle={getPageTitle(activeNav)}
          breadcrumb={getBreadcrumbs(activeNav)}
          onLogout={handleLogout}
        >
          {activeNav === 'volunteers' && <VolunteersPage eventId={selectedEventId} />}

          {activeNav === 'riders' && (
            riderSubView === 'profile' ? (
              <RiderProfilePage
                riderId={selectedRiderId}
                onNavigateBack={() => {
                  setRiderSubView('list');
                  window.history.pushState(null, '', '/riders');
                }}
              />
            ) : riderSubView === 'register' ? (
              <RegisterRiderPage
                eventId={selectedEventId}
                onNavigateBack={() => {
                  setRiderSubView('list');
                  window.history.pushState(null, '', '/riders');
                }}
              />
            ) : (
              <RidersPage
                eventId={selectedEventId}
                onNavigateRegisterRider={() => {
                  setRiderSubView('register');
                  window.history.pushState(null, '', '/riders/register');
                }}
                onViewRider={(rider) => {
                  setSelectedRiderId(rider.id);
                  setRiderSubView('profile');
                  window.history.pushState(null, '', `/riders/${rider.id.toLowerCase()}`);
                }}
              />
            )
          )}

          {activeNav === 'events' && (
            eventSubView === 'details' ? (
              <EventDetailsPage
                eventId={selectedEventId}
                onNavigateEditEvent={() => {
                  setEventSubView('edit');
                  window.history.pushState(null, '', selectedEventId ? `/events/${selectedEventId}/edit` : '/events');
                }}
                onNavigateCheckpoints={() => {
                  setEventSubView('checkpoints');
                  window.history.pushState(null, '', selectedEventId ? `/events/${selectedEventId}/checkpoints` : '/events');
                }}
                onNavigateRiders={() => {
                  setActiveNav('riders');
                  setRiderSubView('list');
                  window.history.pushState(null, '', '/riders');
                }}
                onNavigateRegisterRider={() => {
                  setActiveNav('riders');
                  setRiderSubView('register');
                  window.history.pushState(null, '', '/riders/register');
                }}
                onNavigateVolunteers={() => {
                  setActiveNav('volunteers');
                  window.history.pushState(null, '', '/volunteers');
                }}
                onNavigateLiveTracking={() => {
                  setEventSubView('live');
                  window.history.pushState(null, '', selectedEventId ? `/events/${selectedEventId}/live` : '/events');
                }}
                onNavigateReports={() => {
                  setActiveNav('reports');
                  window.history.pushState(null, '', '/reports');
                }}
              />
            ) : eventSubView === 'edit' ? (
              <EditEventPage
                eventId={selectedEventId}
                onNavigateBack={() => {
                  setEventSubView('details');
                  window.history.pushState(null, '', selectedEventId ? `/events/${selectedEventId}` : '/events');
                }}
                onNavigateCheckpoints={() => {
                  setEventSubView('checkpoints');
                  window.history.pushState(null, '', selectedEventId ? `/events/${selectedEventId}/checkpoints` : '/events');
                }}
              />
            ) : eventSubView === 'add-checkpoint' ? (
              <AddCheckpointPage
                eventId={selectedEventId}
                onBackToCheckpoints={() => {
                  setEventSubView('checkpoints');
                  window.history.pushState(null, '', selectedEventId ? `/events/${selectedEventId}/checkpoints` : '/events');
                }}
              />
            ) : eventSubView === 'checkpoints' ? (
              <ConfigureCheckpointsPage
                eventId={selectedEventId}
                onNavigateAddCheckpoint={() => {
                  setEventSubView('add-checkpoint');
                  window.history.pushState(null, '', selectedEventId ? `/events/${selectedEventId}/checkpoints/new` : '/events');
                }}
                onNavigateEventOverview={() => {
                  setEventSubView('details');
                  window.history.pushState(null, '', selectedEventId ? `/events/${selectedEventId}` : '/events');
                }}
              />
            ) : eventSubView === 'live' ? (
              <LiveTrackingPage
                eventId={selectedEventId}
                onBackToEvent={() => {
                  setEventSubView('details');
                  window.history.pushState(null, '', selectedEventId ? `/events/${selectedEventId}` : '/events');
                }}
              />
            ) : eventSubView === 'create' ? (
              <CreateEventPage
                onSaveEvent={handleSaveEvent}
                onNavigateBack={() => {
                  setEventSubView('list');
                  window.history.pushState(null, '', '/events');
                }}
                onNavigateEventDetails={(id) => {
                  setSelectedEventId(id);
                  setEventSubView('details');
                  window.history.pushState(null, '', `/events/${id}`);
                }}
              />
            ) : (
              <EventsPage
                events={eventsList}
                onNavigateCreateEvent={() => {
                  setEventSubView('create');
                  window.history.pushState(null, '', '/events/create');
                }}
                onNavigateEventDetails={(id) => {
                  setSelectedEventId(id);
                  setEventSubView('details');
                  window.history.pushState(null, '', `/events/${id}`);
                }}
              />
            )
          )}

          {activeNav === 'dashboard' && (
            <DashboardPage
              onNavigateCreateEvent={() => {
                setActiveNav('events');
                setEventSubView('create');
                window.history.pushState(null, '', '/events/create');
              }}
              onNavigateRegisterRider={() => {
                setActiveNav('riders');
                setRiderSubView('register');
                window.history.pushState(null, '', '/riders/register');
              }}
              onNavigateScanner={() => {
                setCurrentRoute('scanner');
                window.history.pushState(null, '', '/volunteer/scanner');
              }}
              onNavigateReports={() => {
                setActiveNav('reports');
                window.history.pushState(null, '', '/reports');
              }}
            />
          )}
          {activeNav === 'reports' && <ReportsPage eventId={selectedEventId} />}

          {activeNav !== 'events' && activeNav !== 'dashboard' && activeNav !== 'riders' && activeNav !== 'volunteers' && activeNav !== 'reports' && (
            <Box
              sx={{
                maxWidth: 540,
                mx: 'auto',
                mt: { xs: 4, sm: 6 },
                px: 3,
                py: 4,
                backgroundColor: colors.surface.card,
                border: `1px solid ${colors.surface.border}`,
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: colors.brand.accentLight,
                  color: colors.brand.accent,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 24 }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: colors.text.primary,
                  mb: 1,
                }}
              >
                {getPageTitle(activeNav)} Module
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: colors.text.secondary,
                  mb: 3,
                  lineHeight: 1.5,
                }}
              >
                The {getPageTitle(activeNav)} management interface will be developed in future milestones as per the project specification.
              </Typography>
              <RideButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setActiveNav('events');
                  setEventSubView('checkpoints');
                }}
              >
                Return to Events
              </RideButton>
            </Box>
          )}
        </AppShell>
      )}

      {currentRoute === 'shell' && (
        <AppShell
          activeNavId={activeNav}
          onNavChange={(id) => setActiveNav(id)}
          pageTitle={getPageTitle(activeNav)}
          breadcrumb={['RideTrack', activeNav.charAt(0).toUpperCase() + activeNav.slice(1)]}
        >
          <ShellPreviewPage
            activeNav={activeNav}
            onSelectNav={(id) => setActiveNav(id)}
          />
        </AppShell>
      )}

      {currentRoute === 'admin' && (
        <AdminModule
          onLogout={handleLogout}
          onExitAdmin={() => {
            setCurrentRoute('app');
            setActiveNav('events');
            setEventSubView('list');
            window.history.pushState(null, '', '/events');
          }}
          onNavigateToEventDetails={(eventId) => {
            setSelectedEventId(eventId);
            setCurrentRoute('app');
            setActiveNav('events');
            setEventSubView('details');
            window.history.pushState(null, '', `/events/${eventId}`);
          }}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
