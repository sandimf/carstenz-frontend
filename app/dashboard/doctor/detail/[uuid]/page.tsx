import ScreeningDetail from '@/components/screening/detail';

interface ScreeningPageProps {
  params: { uuid: string };
}

export default function ScreeningPage({ params }: ScreeningPageProps) {
  return <ScreeningDetail uuid={params.uuid} />;
}
