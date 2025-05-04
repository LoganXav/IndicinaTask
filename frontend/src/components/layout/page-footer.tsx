import { Link } from 'react-router-dom';
import { Typography } from '~/components/globals/typography';

export function PageFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div />
        <Typography size="small" color="muted" className="flex text-center">
          © {new Date().getFullYear()} ShortLink. Developed by
          <Link to="https://logan-bay.vercel.app/">
            <Typography
              size="small"
              color="muted"
              className="ml-1 underline underline-offset-4"
            >
              Sogbesan Timilehin Segun
            </Typography>
          </Link>
          .
        </Typography>
      </div>
    </footer>
  );
}
