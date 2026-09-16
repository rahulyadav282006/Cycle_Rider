import React from 'react';
import { Box } from '@mui/material';

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: number | string;
  sx?: object;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 1400,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2.5, sm: 3, md: 4 },
        boxSizing: 'border-box',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
