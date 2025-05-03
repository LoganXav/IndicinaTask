import { Card } from '~/components/globals/card';
import { toast } from '~/components/globals/toast';
import { Input } from '~/components/globals/input';
import { Button } from '~/components/globals/button';
import { ThemeToggler } from '~/components/theme-toggler';
import { DataTable } from '~/components/data-table/data-table';
import { LoadingContent } from '~/components/loading-content';

export default function App() {
  return (
    <div className="flex flex-col gap-4 max-w-4xl p-8">
      <ThemeToggler />
      <Button onClick={() => toast.info('Hello, world!')}>Click me</Button>

      <Input placeholder="Hello, world!" />

      <Card>
        <LoadingContent data={[]}>
          <DataTable
            data={[
              {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                address: '123 Main St, Anytown, USA',
              },
            ]}
            columns={[
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
            ]}
          />
        </LoadingContent>
      </Card>
    </div>
  );
}
