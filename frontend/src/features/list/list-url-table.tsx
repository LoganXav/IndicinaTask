import { format } from 'date-fns';
import { UrlType } from '~/types';
import { Card } from '~/components/globals/card';
import { useGetUrlListQuery } from '~/apis/core-url-api';
import { DataTable } from '~/components/data-table/data-table';
import { LoadingContent } from '~/components/loading-content';

export function ListUrlTable() {
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
  ];

  return (
    <Card>
      <LoadingContent
        data={urlList}
        loading={isLoadingUrlList}
        error={errorUrlList}
        retry={refetchUrlList}
      >
        <DataTable data={urlList?.data?.data} columns={columns} />
      </LoadingContent>
    </Card>
  );
}
