import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export type Screening = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  contact: string;
  passport_number: string;
  screening_status: 'pending' | 'completed' | 'failed';
  queue: number;
  screening_date: string;
  answers: {
    question_id: number;
    answer: string;
  }[];
};

export const columns: ColumnDef<Screening>[] = [
  { accessorKey: 'name', header: 'Patient Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'contact', header: 'Contact' },
  { accessorKey: 'passport_number', header: 'Passport Number' },
  {
    accessorKey: 'screening_status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as 'pending' | 'completed' | 'failed';
      const statusMap = {
        pending: { text: 'Pending', className: 'bg-yellow-500 text-white' },
        completed: { text: 'Completed', className: 'bg-green-500 text-white' },
        failed: { text: 'Failed', className: 'bg-red-500 text-white' },
      };
      const { text, className } = statusMap[status] ?? { text: status, className: '' };
      return <Badge className={className}>{text}</Badge>;
    },
  },
  { accessorKey: 'queue', header: 'Queue' },
  {
    accessorKey: 'screening_date',
    header: 'Screening Date',
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
  {
    id: 'detail',
    header: 'Detail',
    cell: ({ row }) => (
      <Link
        href={`/dashboard/doctor/detail/${row.original.uuid}`}
        className="text-blue-600 hover:underline"
      >
        View
      </Link>
    ),
  },
];
