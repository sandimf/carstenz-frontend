
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { columns, Screening } from './columns';
import { DataTable } from '@/components/data-table';
import { apiClient } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ScreeningsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ['screenings', page, searchQuery],
    queryFn: () =>
      apiClient.getScreeningsC({
        page,
        per_page: perPage,
        search: searchQuery || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-5 w-1/6" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-5 w-1/6" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Failed to load data</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'An error occurred while fetching screenings'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = data?.meta?.last_page || 1;
  const currentTotal = data?.data?.length || 0;
  const grandTotal = data?.meta?.total || 0;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-8 py-2 flex justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            List
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            variant="outline"
            size="icon"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search patient name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-9"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {currentTotal === 0 && !isFetching ? (
        <div className="text-center py-12 border rounded-md">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : 'No screenings available'}
          </p>
        </div>
      ) : (
        <DataTable<Screening, unknown>
          columns={columns}
          data={data?.data || []}
        />
      )}

      {/* Pagination */}
      {currentTotal > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {((page - 1) * perPage) + 1} -{' '}
            {Math.min(page * perPage, grandTotal)} of {grandTotal} results
            {searchQuery && ` for "${searchQuery}"`}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1 || isFetching}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>

            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages || isFetching}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
