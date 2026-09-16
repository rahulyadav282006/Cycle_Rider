import React from 'react';
import { Box, Typography } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { colors } from '../../theme/colors';

export interface AuthLayoutProps {
  children: React.ReactNode;
  currentRoute: 'login' | 'register';
  onNavigate: (route: 'login' | 'register') => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  currentRoute,
  onNavigate,
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F0F7FD',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        py: { xs: 8, md: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Cycling Landscape Background SVG */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="60%" stopColor="#EFF6FF" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#EFF6FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background fill */}
          <rect width="1440" height="900" fill="url(#bgGrad)" />

          {/* Distant Mountains Layer 1 */}
          <path
            d="M-50 650 Q 200 420 500 560 T 1100 480 Q 1300 520 1500 680 L1500 950 L-50 950 Z"
            fill="#E0F2FE"
            opacity="0.5"
          />

          {/* Mid Mountains Layer 2 */}
          <path
            d="M-20 700 Q 280 480 620 620 T 1250 560 Q 1400 590 1520 720 L1520 950 L-20 950 Z"
            fill="#BAE6FD"
            opacity="0.4"
          />

          {/* Foreground Mountain / Hill */}
          <path
            d="M-40 760 Q 320 620 740 730 T 1480 680 L1480 950 L-40 950 Z"
            fill="#93C5FD"
            opacity="0.25"
          />

          {/* Winding Highway / Road */}
          <path
            d="M-50 880 C 400 870, 700 790, 1100 780 C 1300 775, 1450 765, 1500 760"
            stroke="url(#roadGrad)"
            strokeWidth="38"
            fill="none"
          />
          {/* Road center dashed line */}
          <path
            d="M-50 880 C 400 870, 700 790, 1100 780 C 1300 775, 1450 765, 1500 760"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeDasharray="14 14"
            fill="none"
            opacity="0.6"
          />

          {/* Cyclist Silhouette (Left Side) */}
          <g opacity="0.32" transform="translate(140, 480) scale(1.6)">
            {/* Cyclist Helmet & Head */}
            <ellipse cx="78" cy="42" rx="9" ry="7" fill="#0284C7" transform="rotate(-15 78 42)" />
            {/* Torso leaning forward */}
            <path
              d="M74 46 L60 68 L78 74 L94 60 Z"
              fill="#0284C7"
            />
            {/* Arms reaching to drop handlebars */}
            <path
              d="M76 52 L98 62 L102 70"
              stroke="#0284C7"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Thigh & Leg */}
            <path
              d="M60 68 L66 90 L52 110"
              stroke="#0284C7"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Other Leg */}
            <path
              d="M60 68 L48 84 L58 102"
              stroke="#0284C7"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Bicycle Front Wheel */}
            <circle cx="118" cy="116" r="24" stroke="#0284C7" strokeWidth="3" fill="none" />
            <circle cx="118" cy="116" r="3" fill="#0284C7" />
            {/* Bicycle Rear Wheel */}
            <circle cx="36" cy="116" r="24" stroke="#0284C7" strokeWidth="3" fill="none" />
            <circle cx="36" cy="116" r="3" fill="#0284C7" />
            {/* Bicycle Frame */}
            <path
              d="M36 116 L62 116 L104 92 L70 92 Z"
              stroke="#0284C7"
              strokeWidth="3.5"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M62 116 L70 82"
              stroke="#0284C7"
              strokeWidth="3.5"
            />
            <path
              d="M104 92 L118 116"
              stroke="#0284C7"
              strokeWidth="3.5"
            />
            {/* Handlebars */}
            <path
              d="M101 84 Q 106 72 112 76 Q 116 82 112 90"
              stroke="#0284C7"
              strokeWidth="3"
              fill="none"
            />
            {/* Saddle */}
            <path
              d="M62 82 L76 82"
              stroke="#0284C7"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </Box>

      {/* Top Bar: Brand on Left, Sign In | Register on Right */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 68,
          px: { xs: 2.5, sm: 4, md: 6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        {/* Brand: [🚲] RideTrack */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '6px',
              backgroundColor: colors.brand.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
            }}
          >
            <DirectionsBikeIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: colors.text.primary,
            }}
          >
            RideTrack
          </Typography>
        </Box>

        {/* Top Right Navigation: Sign In | Register */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            component="button"
            type="button"
            onClick={() => onNavigate('login')}
            sx={{
              background: 'none',
              border: 'none',
              p: 0,
              pb: 0.5,
              fontSize: '0.875rem',
              fontWeight: currentRoute === 'login' ? 700 : 500,
              color: currentRoute === 'login' ? colors.brand.accent : colors.text.secondary,
              cursor: 'pointer',
              fontFamily: 'inherit',
              position: 'relative',
              transition: 'color 0.15s ease',
              borderBottom: currentRoute === 'login' ? `2px solid ${colors.brand.accent}` : '2px solid transparent',
              '&:hover': {
                color: colors.brand.accent,
              },
            }}
          >
            Sign In
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => onNavigate('register')}
            sx={{
              background: 'none',
              border: 'none',
              p: 0,
              pb: 0.5,
              fontSize: '0.875rem',
              fontWeight: currentRoute === 'register' ? 700 : 500,
              color: currentRoute === 'register' ? colors.brand.accent : colors.text.secondary,
              cursor: 'pointer',
              fontFamily: 'inherit',
              position: 'relative',
              transition: 'color 0.15s ease',
              borderBottom: currentRoute === 'register' ? `2px solid ${colors.brand.accent}` : '2px solid transparent',
              '&:hover': {
                color: colors.brand.accent,
              },
            }}
          >
            Register
          </Box>
        </Box>
      </Box>

      {/* Main Centered Content Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 460,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          my: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
