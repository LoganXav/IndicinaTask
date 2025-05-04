import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { UrlType } from '~/types';
import { debounce } from '~/utils';
import { useMemo, useState } from 'react';
import { Card } from '~/components/globals/card';
import { Input } from '~/components/globals/input';
import { Badge } from '~/components/globals/badge';
import { useGetUrlListQuery } from '~/apis/core-url-api';
import { LoadingContent } from '~/components/loading-content';
import { DataTable } from '~/components/data-table/data-table';

export function ListUrlTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    data: urlList,
    isLoading: isLoadingUrlList,
    error: errorUrlList,
    refetch: refetchUrlList,
  } = useGetUrlListQuery();

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Original URL',
      accessorKey: 'url',
    },
    {
      header: 'Short URL',
      accessorKey: 'shortUrl',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ row }: { row: { original: UrlType } }) => {
        const isActive = row.original.isActive;
        return (
          <Badge variant={isActive ? 'default' : 'destructive'}>
            {isActive ? 'Active' : 'Expired'}
          </Badge>
        );
      },
    },
    {
      header: 'Visit Count',
      accessorKey: 'visitCount',
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: { original: UrlType } }) => {
        const date = row.original.createdAt;
        return format(new Date(date), 'PPpp');
      },
    },
    {
      header: 'Last Visited At',
      accessorKey: 'lastVisitedAt',
      cell: ({ row }: { row: { original: UrlType } }) => {
        const date = row.original.lastVisitedAt;

        if (date) {
          return format(new Date(date), 'PPpp');
        } else {
          return '-';
        }
      },
    },
  ];

  const table = useReactTable({
    data: urlList?.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
    },
  });

  const debouncedSetFilter = useMemo(
    () =>
      debounce((value: string) => {
        if (value === '' || value.length >= 3) {
          table.getColumn('url')?.setFilterValue(value);
        }
      }, 300),
    [table]
  );

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search URLs (minimum 3 characters)..."
          onChange={(event) => debouncedSetFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <LoadingContent
          data={urlList}
          loading={isLoadingUrlList}
          error={errorUrlList}
          retry={refetchUrlList}
        >
          <DataTable table={table} />
        </LoadingContent>
      </Card>
    </>
  );
}
