import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a2e', // Darker header background
          color: '#d1d1d1', // Faint font color
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#f9f9f9', // Light background for contrast
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#00008b', // Dark header row
          padding: '0px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#d1d1d1', // Faint text for table header
          fontWeight: 'bold',
        },
        body: {
          color: '#555', // Slightly darker gray text for body
          fontSize: '1rem', // Slightly larger font size
        },
      },
    },
  },
});

export default theme;
