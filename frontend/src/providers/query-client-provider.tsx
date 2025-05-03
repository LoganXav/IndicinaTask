import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
interface SiteProps {
  children: React.ReactNode;
}

export const QueryClientContextProvider = ({ children }: SiteProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientContextProvider;
