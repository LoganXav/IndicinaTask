import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '~/components/globals/button';
import { Typography } from '~/components/globals/typography';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '~/components/globals/card';
import { XCircle } from 'lucide-react';

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
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-8 w-8 text-destructive" />
                <div className="space-y-1">
                  <Typography as="h2" size="h3" color="error">
                    Oops, something went wrong!
                  </Typography>
                  <Typography color="muted" size="small">
                    {this.state.error?.message ||
                      'An unexpected error occurred'}
                  </Typography>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Typography color="muted" size="small">
                Don't worry, you can try:
                <ul className="ml-6 mt-2 list-disc space-y-1">
                  <li>Refreshing the page</li>
                  <li>Checking your internet connection</li>
                  <li>Coming back later</li>
                </ul>
              </Typography>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh the page
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
