import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Typography } from '~/components/globals/typography';
import { Button } from '~/components/globals/button';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <Typography size={'h2'} color={'error'}>
              Oops, something went wrong!
            </Typography>
            <Typography color={'muted'}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
          </div>
          <Button onClick={() => window.location.reload()}>
            Refresh the page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
