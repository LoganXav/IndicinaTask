import { Link } from 'react-router-dom';
import { Typography } from '~/components/globals/typography';

export function PageFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div />
        <Typography size="small" color="muted" className="flex text-center">
          © {new Date().getFullYear()} ShortLink. Developed by
          <Link to="https://github.com/LoganXav">
            <Typography size="small" color="muted" className="ml-1 underline">
              Sogbesan Timilehin
            </Typography>
          </Link>
          .
        </Typography>
      </div>
    </footer>
  );
}
