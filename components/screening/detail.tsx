'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, User } from 'lucide-react';

interface ScreeningDetailProps {
  uuid: string;
}

const parseAnswer = (answer: any): string => {
  if (!answer) return '-';
  if (Array.isArray(answer)) return answer.join(', ');
  if (typeof answer === 'string') {
    try {
      const parsed = JSON.parse(answer);
      if (parsed.options && Array.isArray(parsed.options)) {
        const opts = parsed.options.join(', ');
        const textarea = parsed.textarea || '';
        return textarea ? `${opts} (${textarea})` : opts;
      }
      if (Array.isArray(parsed)) return parsed.join(', ');
      return parsed.toString();
    } catch {
      return answer;
    }
  }
  return String(answer);
};

const FIELD_LABELS: Record<string, string> = {
  name: 'Nama',
  email: 'Email',
  contact: 'Nomor Telepon',
  date_of_birth: 'Tanggal Lahir',
  gender: 'Jenis Kelamin',
  nationality: 'Kewarganegaraan',
  passport_number: 'No. Paspor',
};

export default function ScreeningDetail({ uuid }: ScreeningDetailProps) {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['screening', uuid],
    queryFn: () => apiClient.getScreeningByUUIDC(uuid),
    enabled: !!uuid,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const patient = response?.data;
  const questionsAndAnswers = response?.data?.answers ?? [];

  if (!uuid) {
    return (
      <div className="min-h-screen p-4">
        <Alert variant="destructive">
          <AlertDescription>UUID pasien tidak tersedia</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen p-4">
        <Alert variant="destructive">
          <AlertDescription>Error loading patient data</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Detail Screening</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">Pasien: {patient.name}</p>

      <Tabs defaultValue="questionnaire" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="patient"
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            <User className="h-4 w-4" />
            Informasi Pasien
          </TabsTrigger>
          <TabsTrigger
            value="questionnaire"
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            <FileText className="h-4 w-4" />
            Kuesioner
          </TabsTrigger>
        </TabsList>

        {/* Patient Info Tab */}
        <TabsContent value="patient" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-black dark:text-white">Data Pasien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(patient)
                  .filter(([key]) => Object.keys(FIELD_LABELS).includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{FIELD_LABELS[key]}</span>
                      <span className="font-medium text-black dark:text-white">{value != null ? String(value) : '-'}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questionnaire Tab */}
        {/* Questionnaire Tab */}
        <TabsContent value="questionnaire" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-black dark:text-white">Jawaban Kuesioner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questionsAndAnswers.map((qa: any, index: number) => (
                <div
                  key={qa.question_id}
                  className="border-b border-gray-200 dark:border-gray-800 pb-2 last:border-b-0"
                >
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {index + 1}. {qa.question_text || `Question ${qa.question_id}`}
                  </p>
                  <p className="text-black dark:text-white">{parseAnswer(qa.answer)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
