'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { columns, Screening } from './columns';
import { DataTable } from '@/components/data-table';
import { apiClient } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, AlertCircle, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ScreeningsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

    const { data, isLoading, error, isFetching, refetch } = useQuery({
      queryKey: ['screenings', searchQuery],
      queryFn: () =>
        apiClient.getScreeningsC(),
    });

  const currentTotal = data?.data?.length || 0;

  const handleDownloadCsv = async () => {
    try {
      setIsDownloading(true);
      const blob = await apiClient.downloadScreeningsCsv(searchQuery);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `screenings_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download CSV. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-8 py-2 flex justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">List</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadCsv}
            disabled={isDownloading}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Export CSV'}
          </Button>

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
    </div>
  );
}
