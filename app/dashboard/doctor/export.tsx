'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface ExportCsvButtonProps {
  searchQuery?: string;
}

export default function ExportCsvButton({ searchQuery }: ExportCsvButtonProps) {
  const handleDownload = async () => {
    try {
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
    }
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <Download className="w-4 h-4 mr-2" /> Export CSV
    </Button>
  );
}
