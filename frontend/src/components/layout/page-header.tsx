import { cn } from '~/utils/style';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggler } from '~/components/theme-toggler';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'List', href: '/list' },
];

export function PageHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-display text-2xl font-extrabold">
              ShortLink
            </span>
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground/80',
                  location.pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
