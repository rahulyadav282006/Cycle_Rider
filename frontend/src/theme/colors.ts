// RideTrack Centralized Color System
// Operational, outdoor-friendly, enterprise endurance event management

export const colors = {
  // Brand foundation - Natural Outdoor Cycling (Forest Green, Sage, Deep Teal)
  brand: {
    primary: '#135F63',      // Rich forest teal / dark green
    primaryDark: '#0E484B',  // Deep forest
    primaryLight: '#1A7A7F', // Mid teal
    accent: '#2D6A4F',       // Natural forest green accent
    accentHover: '#1B4332',  // Deep pine green
    accentLight: '#E8F3EC',  // Soft sage tint
    highlight: '#10B981',    // Emerald green for active course
  },

  // Primary color alias
  primary: {
    main: '#135F63',
    dark: '#0E484B',
    light: '#E8F3EC',
  },

  // Surfaces & Backgrounds - Calm, Natural, Light Sage & Warm White
  surface: {
    page: '#F6FAF7',         // Calm, natural warm-white with subtle pale sage tint
    card: '#FFFFFF',         // Pure white card surfaces
    elevated: '#FFFFFF',
    subtle: '#EDF4F0',       // Light sage subtle background
    sidebar: '#EBF2ED',      // Light greenish / sage sidebar from design reference
    sidebarBorder: '#D8E5DC',// Subtle sage border for sidebar
    sidebarActive: '#D5E7DB',// Soft sage active navigation pill
    sidebarActiveText: '#135F63', // Dark forest teal active text
    header: '#FFFFFF',       // Clean white top header
    border: '#E0EAE2',       // Subtle natural sage border
    borderStrong: '#C8DACD', // Medium sage border
  },

  // Text Hierarchy - Natural Dark Slate / Forest
  text: {
    primary: '#0F1F17',      // Deep slate-forest text for maximum readability
    secondary: '#3D5245',    // Subtle dark green-slate secondary
    muted: '#6E8276',        // Muted sage-slate for metadata
    inverse: '#FFFFFF',      // White on dark backgrounds
    inverseMuted: '#D5E7DB', // Pale sage on dark
  },

  // Interactive / State Colors
  interactive: {
    focusRing: '#4338CA',
    hoverBg: '#EEF2FF',
    disabledBg: '#F1F5F9',
    disabledText: '#94A3B8',
    disabledBorder: '#E2E8F0',
  },

  // Semantic Status Tokens (Draft, Active, Completed, Cancelled, Online, Offline, Pending, Success, Error)
  status: {
    draft: {
      bg: '#F1F5F9',
      text: '#475569',
      border: '#CBD5E1',
      dot: '#64748B',
    },
    upcoming: {
      bg: '#F0F9FF',
      text: '#0369A1',
      border: '#BAE6FD',
      dot: '#0284C7',
    },
    published: {
      bg: '#F0F9FF',
      text: '#0369A1',
      border: '#BAE6FD',
      dot: '#0284C7',
    },
    active: {
      bg: '#ECFDF5',
      text: '#065F46',
      border: '#A7F3D0',
      dot: '#059669',
    },
    live: {
      bg: '#ECFDF5',
      text: '#065F46',
      border: '#A7F3D0',
      dot: '#059669',
    },
    completed: {
      bg: '#EFF6FF',
      text: '#1E40AF',
      border: '#BFDBFE',
      dot: '#2563EB',
    },
    cancelled: {
      bg: '#FEF2F2',
      text: '#991B1B',
      border: '#FECACA',
      dot: '#DC2626',
    },
    online: {
      bg: '#F0FDF4',
      text: '#166534',
      border: '#BBF7D0',
      dot: '#16A34A',
    },
    offline: {
      bg: '#F8FAFC',
      text: '#475569',
      border: '#E2E8F0',
      dot: '#94A3B8',
    },
    pending: {
      bg: '#FFFBEB',
      text: '#92400E',
      border: '#FDE68A',
      dot: '#D97706',
    },
    success: {
      bg: '#ECFDF5',
      text: '#065F46',
      border: '#A7F3D0',
      dot: '#059669',
    },
    error: {
      bg: '#FEF2F2',
      text: '#991B1B',
      border: '#FECACA',
      dot: '#DC2626',
    },
    registered: {
      bg: '#F0F9FF',
      text: '#0369A1',
      border: '#BAE6FD',
      dot: '#0284C7',
    },
    finished: {
      bg: '#EFF6FF',
      text: '#1E40AF',
      border: '#BFDBFE',
      dot: '#2563EB',
    },
    dnf: {
      bg: '#FEF2F2',
      text: '#991B1B',
      border: '#FECACA',
      dot: '#DC2626',
    },
    mandatory: {
      bg: '#ECFDF5',
      text: '#065F46',
      border: '#A7F3D0',
      dot: '#059669',
    },
    optional: {
      bg: '#F1F5F9',
      text: '#475569',
      border: '#CBD5E1',
      dot: '#64748B',
    },
  },

  // Outdoor / High-Contrast Foundation (Solar Mode ready)
  outdoor: {
    highContrastBorder: '#0F172A',
    sunlightText: '#000000',
    highVisAmber: '#D97706',
  }
} as const;

export type StatusType = keyof typeof colors.status;
