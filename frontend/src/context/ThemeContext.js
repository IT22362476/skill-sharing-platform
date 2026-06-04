import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext(null);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#dc004e',
            light: '#ff4081',
            dark: '#9a0036',
            contrastText: '#ffffff',
          },
          success: {
            main: '#4caf50',
            light: '#81c784',
            dark: '#388e3c',
            contrastText: '#ffffff',
          },
          warning: {
            main: '#ff9800',
            light: '#ffb74d',
            dark: '#f57c00',
            contrastText: '#ffffff',
          },
          error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
            contrastText: '#ffffff',
          },
          info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#111827' : '#f1f5f9',
            secondary: mode === 'light' ? '#6b7280' : '#94a3b8',
            disabled: mode === 'light' ? '#9ca3af' : '#4b5563',
          },
          divider: mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
          action: {
            hover: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
            selected: mode === 'light' ? 'rgba(25,118,210,0.08)' : 'rgba(25,118,210,0.16)',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Inter", "Helvetica Neue", sans-serif',
          h4: { fontWeight: 700 },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 600 },
          subtitle1: { fontWeight: 500 },
          subtitle2: { fontWeight: 600 },
          body1: { lineHeight: 1.65 },
          body2: { lineHeight: 1.5 },
          button: { fontWeight: 600, textTransform: 'none' },
        },
        shape: { borderRadius: 8 },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light'
                  ? '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)'
                  : '0 1px 3px rgba(0,0,0,0.5)',
                border: mode === 'light'
                  ? '1px solid rgba(0,0,0,0.06)'
                  : '1px solid rgba(255,255,255,0.06)',
                transition: 'box-shadow 0.2s ease, transform 0.15s ease',
                '&:hover': {
                  boxShadow: mode === 'light'
                    ? '0 4px 16px rgba(0,0,0,0.10)'
                    : '0 4px 16px rgba(0,0,0,0.7)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
                transition: 'all 0.18s ease',
              },
              contained: {
                boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(25,118,210,0.28)',
                  transform: 'translateY(-1px)',
                },
                '&:active': { transform: 'translateY(0)' },
              },
              outlined: {
                '&:hover': { transform: 'translateY(-1px)' },
                '&:active': { transform: 'translateY(0)' },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 6,
                fontWeight: 500,
                fontSize: '0.75rem',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 3px rgba(25,118,210,0.10)',
                  },
                  '&.Mui-error.Mui-focused': {
                    boxShadow: '0 0 0 3px rgba(244,67,54,0.10)',
                  },
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(12px)',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            },
          },
          MuiLinearProgress: {
            styleOverrides: {
              root: { borderRadius: 4, height: 8 },
              bar: { borderRadius: 4 },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: { borderRadius: 12 },
            },
          },
          MuiPopover: {
            styleOverrides: {
              paper: {
                borderRadius: 12,
                boxShadow: mode === 'light'
                  ? '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)'
                  : '0 8px 32px rgba(0,0,0,0.7)',
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: { borderRadius: 8 },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
