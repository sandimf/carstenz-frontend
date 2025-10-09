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
