import App from '~/app';
import '~/styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '~/components/globals/toast';
import { ThemeProvider } from '~/providers/theme-provider';
import { ErrorBoundary } from '~/components/error-boundary';
import { TailwindIndicator } from '~/components/tailwind-indicator';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-background font-primary text-foreground">
          <App />
          <TailwindIndicator />
          <Toaster expand={true} visibleToasts={2} position="top-right" />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
