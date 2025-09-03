// src/app/layout/App.tsx
import { CssBaseline, ThemeProvider, createTheme, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAppSelector } from '../store/store';

export default function App() {
  const darkMode = useAppSelector((s) => s.ui.darkMode);

  const theme = createTheme({
    palette: { mode: darkMode ? 'dark' : 'light' },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}