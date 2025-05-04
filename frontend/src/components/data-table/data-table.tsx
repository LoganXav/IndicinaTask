import {
  TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/globals/table';
import { flexRender, Table } from '@tanstack/react-table';
import { DataTablePagination } from '~/components/data-table/data-table-pagination';
import { UrlType } from '~/types';

interface TableProps {
  table: Table<UrlType>;
}

export function DataTable({ table }: TableProps) {
  return (
    <>
      <TableRoot>
        <TableHeader>
          {table?.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table?.getRowModel()?.rows?.length > 0 ? (
            table?.getRowModel()?.rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>
      <DataTablePagination table={table} />
    </>
  );
}
