import { useNavigate } from 'react-router-dom';
import { Card } from '~/components/globals/card';
import { Button } from '~/components/globals/button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { LoadingContent } from '~/components/loading-content';
import { DataTable } from '~/components/data-table/data-table';

export default function List() {
  const navigate = useNavigate();

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'Address',
      accessorKey: 'address',
    },
  ];

  const data = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St, Anytown, USA',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '1234567890',
      address: '123 Main St, Anytown, USA',
    },
    {
      id: 3,
      name: 'Steve Doe',
      email: 'steve.doe@example.com',
      phone: '1234567890',
      address: '123 Main St, Anytown, USA',
    },
    {
      id: 4,
      name: 'Emily Doe',
      email: 'emily.doe@example.com',
      phone: '1234567890',
      address: '123 Main St, Anytown, USA',
    },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <Button className="w-fit" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Go back
      </Button>
      <Card>
        <LoadingContent data={data}>
          <DataTable data={data} columns={columns} />
        </LoadingContent>
      </Card>
    </div>
  );
}
