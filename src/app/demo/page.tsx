import { notFound } from 'next/navigation';
import { DemoDiaryLoader } from '@/features/write-diary';

export default function DemoPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <DemoDiaryLoader />;
}
