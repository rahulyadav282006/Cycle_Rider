// RideTrack Centralized Color System
// Operational, outdoor-friendly, enterprise endurance event management

export const colors = {
  // Brand foundation - Curated with #2A14B4 and #4338CA
  brand: {
    primary: '#4338CA',      // Rich Indigo (#4338CA)
    primaryDark: '#2A14B4',  // Deep Electric Indigo (#2A14B4)
    primaryLight: '#312E81', // Indigo 900
    accent: '#4338CA',       // #4338CA
    accentHover: '#2A14B4',  // #2A14B4
    accentLight: '#EEF2FF',  // Indigo 50
    highlight: '#10B981',    // Emerald 500 - Course active / green flag
  },

  // Primary color alias
  primary: {
    main: '#4338CA',
    dark: '#2A14B4',
    light: '#EEF2FF',
  },

  // Surfaces & Backgrounds
  surface: {
    page: '#F8FAFC',        // Slate 50 - Crisp, clear, outdoor readable
    card: '#FFFFFF',        // Pure white card background
    elevated: '#FFFFFF',
    subtle: '#F1F5F9',      // Slate 100
    sidebar: '#1E1B4B',     // Deep Indigo 950 for high-contrast enterprise stability
    sidebarActive: '#2A14B4',// #2A14B4 for active sidebar items
    header: '#FFFFFF',
    border: '#E0E7FF',      // Indigo-tinted border
    borderStrong: '#C7D2FE',
  },

  // Text Hierarchy - Incorporating #464555 for secondary text
  text: {
    primary: '#0F172A',     // Slate 900 - Max contrast
    secondary: '#464555',   // #464555 - Neutral secondary text
    muted: '#64748B',       // Slate 500
    inverse: '#FFFFFF',     // White on dark backgrounds
    inverseMuted: '#C7D2FE',// Indigo 200 on dark
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
