import { useNavigate } from 'react-router-dom';
import { RouteEnums } from '~/constants/routes';
import { toast } from '~/components/globals/toast';
import { Input } from '~/components/globals/input';
import { Button } from '~/components/globals/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <Input placeholder="Shorten your link" />
      <div className="grid grid-cols-3 gap-4">
        <Button
          className="col-span-2"
          onClick={() => toast.info('Hello, world!')}
        >
          Click me
        </Button>
        <Button
          className="col-span-1"
          variant={'outline'}
          onClick={() => navigate(RouteEnums.LIST)}
        >
          View all links <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
