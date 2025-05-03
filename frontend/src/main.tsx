import App from '~/app';
import '~/styles/global.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '~/components/globals/toast';
import { ThemeProvider } from '~/providers/theme-provider';
import { ErrorBoundary } from '~/components/error-boundary';
import { TailwindIndicator } from '~/components/tailwind-indicator';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider>
          <App />
          <TailwindIndicator />
          <Toaster expand={true} visibleToasts={2} position="top-right" />
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
