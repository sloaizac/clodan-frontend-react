import React from 'react';
import AppRoutes from './routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AlertProvider } from './AlertContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#94B754',
      contrastText: '#ffffff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <AppRoutes />
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
