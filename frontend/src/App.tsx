import { Suspense, useMemo, lazy } from 'react';
import { RouteEnums } from '~/constants/routes';
import { configureRoutes } from '~/utils/route';
import { Navigate, useRoutes } from 'react-router-dom';
import { PageHeader } from '~/components/layout/page-header';
import { PageFooter } from '~/components/layout/page-footer';

function App() {
  const routes = useRoutes(
    useMemo(() => getRoutes({ redirectTo: RouteEnums.HOME }), [])
  );

  return (
    <div className="min-h-screen bg-background font-primary text-foreground">
      <PageHeader />
      <div className="container mx-auto py-16">
        <Suspense>{routes}</Suspense>
      </div>
      <PageFooter />
    </div>
  );
}

export default App;

const getRoutes = function getRoutes({ redirectTo }: { redirectTo: string }) {
  return configureRoutes([
    {
      path: '*',
      element: <Navigate to={redirectTo} replace />,
    },
    {
      path: RouteEnums.HOME,
      element: lazy(() => import('~/pages/home')),
    },
    {
      path: RouteEnums.LIST,
      element: lazy(() => import('~/pages/list')),
    },
  ]);
};
