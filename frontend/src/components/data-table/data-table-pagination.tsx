import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '~/components/globals/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/globals/select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="mt-4 overflow-hidden rounded-md bg-pager-foreground">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:text-primary flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          {/* <Button */}
          {/*   variant="ghost" */}
          {/*   className="h-8 w-8 p-0 hover:text-primary" */}
          {/*   onClick={() => table.previousPage()} */}
          {/*   disabled={!table.getCanPreviousPage()} */}
          {/* > */}
          {/*   <span className="sr-only">Go to previous page</span> */}
          {/*   <ArrowLeftIcon className="mr-2 h-3 w-3" /> */}
          {/*   Previous */}
          {/* </Button> */}
          {/* {[2, 3, 4, 5, 6, 7].map((page) => ( */}
          {/*   <Button */}
          {/*     key={page} */}
          {/*     size="page" */}
          {/*     variant="ghost" */}
          {/*     className="hidden h-8 w-14 p-0 hover:text-primary lg:flex" */}
          {/*     onClick={() => table.setPageIndex(page - 1)} */}
          {/*     disabled={!table.getCanNextPage()} */}
          {/*   > */}
          {/*     {page} */}
          {/*   </Button> */}
          {/* ))} */}
          {/* <Button */}
          {/*   variant="ghost" */}
          {/*   className="h-8 w-8 p-0 hover:text-primary" */}
          {/*   onClick={() => table.nextPage()} */}
          {/*   disabled={!table.getCanNextPage()} */}
          {/* > */}
          {/*   Next */}
          {/*   <span className="sr-only">Go to next page</span> */}
          {/*   <ArrowRightIcon className="ml-2 h-3 w-3" /> */}
          {/* </Button> */}
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:text-primary flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="md:w-32">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="rounded-none border-none bg-pager-background text-foreground outline-none">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[
                { name: '5 per page', value: 5 },
                { name: '10 per page', value: 10 },
                { name: '15 per page', value: 15 },
                { name: '20 per page', value: 20 },
              ].map((pageSize) => (
                <SelectItem key={pageSize.value} value={`${pageSize.value}`}>
                  {pageSize.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
