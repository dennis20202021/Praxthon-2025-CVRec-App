const { createTheme } = require('@mui/material/styles');

const theme = createTheme({
  palette: {
    primary: {
      main: '#0A0A1A',
      light: '#1A1A2E',
      dark: '#050510',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#16213E',
      light: '#1E2A4E',
      dark: '#0F1830',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E94560',
      light: '#ED677D',
      dark: '#D42A45',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFD700',
      light: '#FFDF33',
      dark: '#E6C200',
      contrastText: '#0A0A1A',
    },
    info: {
      main: '#4CC9F0',
      light: '#70D4F3',
      dark: '#36A5CC',
      contrastText: '#0A0A1A',
    },
    success: {
      main: '#00CC99',
      light: '#33D6AD',
      dark: '#00B386',
      contrastText: '#0A0A1A',
    },
    background: {
      default: 'linear-gradient(135deg, #0A0A1A 0%, #16213E 100%)',
      paper: 'rgba(26, 26, 46, 0.8)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 215, 0, 0.2)',
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
      fontSize: '3.5rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #FFD700 0%, #E94560 50%, #4CC9F0 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 2px 10px rgba(255, 215, 0, 0.3)',
      marginBottom: '1.5rem',
      '@media (max-width:992px)': {
        fontSize: '2.8rem',
      },
      '@media (max-width:768px)': {
        fontSize: '2.2rem',
      },
      '@media (max-width:576px)': {
        fontSize: '1.8rem',
      },
    },
    h2: {
      fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#FFD700',
      textShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
      marginBottom: '1rem',
    },
    h3: {
      fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FFD700',
      marginBottom: '0.75rem',
    },
    h4: {
      fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#FFD700',
    },
    h5: {
      fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.7,
      color: 'rgba(255, 255, 255, 0.85)',
      '@media (max-width:768px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 4px 20px rgba(0, 0, 0, 0.3)',
    '0 8px 30px rgba(0, 0, 0, 0.4)',
    '0 12px 40px rgba(0, 0, 0, 0.5)',
    '0 16px 50px rgba(0, 0, 0, 0.6)',
    ...Array(20).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0A0A1A 0%, #16213E 100%)',
          backgroundAttachment: 'fixed',
          color: '#FFFFFF',
          lineHeight: 1.6,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #FFD700 0%, #E94560 100%)',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 26, 0.9) !important',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 46, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #FFD700, #E94560, #4CC9F0)',
          },
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            '&:before': {
              background: 'linear-gradient(90deg, #4CC9F0, #FFD700, #E94560)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          padding: '12px 28px',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.5s ease',
          },
          '&:hover:before': {
            left: '100%',
          },
        },
        contained: {
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3) !important',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4) !important',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
      variants: [
        {
          props: { variant: 'outlined', color: 'warning' },
          style: {
            borderColor: '#FFD700',
            color: '#FFD700',
            '&:hover': {
              backgroundColor: '#FFD700',
              color: '#0A0A1A',
              borderColor: '#FFD700',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'error' },
          style: {
            background: 'linear-gradient(135deg, #E94560 0%, #D42A45 100%)',
            border: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #D42A45 0%, #E94560 100%)',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'success' },
          style: {
            background: 'linear-gradient(135deg, #00CC99 0%, #00B386 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #00B386 0%, #00CC99 100%)',
            },
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 215, 0, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E94560',
              boxShadow: '0 0 0 2px rgba(233, 69, 96, 0.3)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: 'rgba(255, 255, 255, 0.7)', // White when focused
            },
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF',
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E94560',
            boxShadow: '0 0 0 2px rgba(233, 69, 96, 0.3)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(233, 69, 96, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(233, 69, 96, 0.3)',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          '&.Mui-selected': {
            color: '#FFD700',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          padding: '6px',
          '& .MuiTabs-indicator': {
            backgroundColor: '#FFD700',
            height: '100%',
            borderRadius: '8px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          '&.MuiChip-outlined': {
            borderColor: 'rgba(255, 215, 0, 0.5)',
            color: '#FFD700',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            transform: 'scale(1.1)',
          },
        },
      },
    },
  },
});

module.exports = theme;