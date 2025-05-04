import { useNavigate } from 'react-router-dom';
import { RouteEnums } from '~/constants/routes';
import { Button } from '~/components/globals/button';
import { Typography } from '~/components/globals/typography';

export function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Typography className="text-9xl font-extrabold text-primary">
        404
      </Typography>
      <Typography className="text-2xl font-semibold mt-4 mb-1">
        Page Not Found
      </Typography>
      <Typography className="text-muted-foreground mb-8">
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button onClick={() => navigate(RouteEnums.HOME)}>Go Back Home</Button>
    </div>
  );
}
