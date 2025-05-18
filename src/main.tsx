
import { CssBaseline, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LocaleProvider } from './contexts/LocaleContext.tsx';
import './i18n';
import theme from './theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
    </LocaleProvider>
  </StrictMode>,
)
