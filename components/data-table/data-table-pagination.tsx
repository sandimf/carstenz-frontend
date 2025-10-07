"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Props untuk server-side pagination
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = 1,
  pageIndex = 0,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    // Server-side pagination
    manualPagination: true,
    pageCount: pageCount,
    state: {
      sorting,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  const handlePreviousPage = () => {
    if (onPageChange && pageIndex > 0) {
      onPageChange(pageIndex);
    }
  };

  const handleNextPage = () => {
    if (onPageChange && pageIndex < pageCount - 1) {
      onPageChange(pageIndex + 2);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {pageIndex * pageSize + 1} -{" "}
          {Math.min((pageIndex + 1) * pageSize, totalItems)} dari {totalItems}{" "}
          hasil
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePreviousPage}
            disabled={pageIndex === 0 || isLoading}
            variant="outline"
            size="sm"
          >
            Sebelumnya
          </Button>

          <Button
            onClick={handleNextPage}
            disabled={pageIndex >= pageCount - 1 || isLoading}
            variant="outline"
            size="sm"
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}