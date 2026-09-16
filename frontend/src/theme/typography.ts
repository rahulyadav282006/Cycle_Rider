// RideTrack Typography Hierarchy
// High legibility, outdoor readable, structured enterprise scale

export const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  // Heading scale: Inter Extra Bold (800) 36px (2.25rem) for page titles
  pageTitle: {
    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }, // 28px -> 32px -> 36px (2.25rem = 36px)
    lineHeight: 1.2,
    fontWeight: 800, // Extra Bold
    letterSpacing: '-0.025em',
    fontFamily: '"Inter", sans-serif',
  },
  sectionTitle: {
    fontSize: { xs: '1.25rem', sm: '1.5rem' }, // 20px -> 24px
    lineHeight: 1.3,
    fontWeight: 800, // Extra Bold
    letterSpacing: '-0.02em',
    fontFamily: '"Inter", sans-serif',
  },
  cardTitle: {
    fontSize: '1.125rem', // 18px
    lineHeight: 1.4,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    fontFamily: '"Inter", sans-serif',
  },

  // Body scale: Inter Regular (400) 16px (1rem) for text
  body: {
    fontSize: '1rem', // 16px
    lineHeight: 1.6,
    fontWeight: 400, // Regular
    fontFamily: '"Inter", sans-serif',
  },
  bodyMedium: {
    fontSize: '1rem', // 16px
    lineHeight: 1.6,
    fontWeight: 500,
    fontFamily: '"Inter", sans-serif',
  },
  secondary: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.5,
    fontWeight: 400,
    fontFamily: '"Inter", sans-serif',
  },
  metadata: {
    fontSize: '0.75rem', // 12px
    lineHeight: 1.4,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontFamily: '"Inter", sans-serif',
  },
  button: {
    fontSize: '0.9375rem', // 15px
    lineHeight: 1.25,
    fontWeight: 600,
    letterSpacing: '0.01em',
    fontFamily: '"Inter", sans-serif',
  },
} as const;
