import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/globals/button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { ListUrlTable } from '~/features/list/list-url-table';

export default function List() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-4">
      <Button
        className="underline self-start"
        variant="link"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Go back
      </Button>

      <ListUrlTable />
    </div>
  );
}
