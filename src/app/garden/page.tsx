import type { Metadata } from 'next';
import { GardenPreview } from '@/widgets/garden-preview';

export const metadata: Metadata = {
  title: '첫 번째 정원 | 기억의 정원',
  description: '나무와 꽃밭, 작은 벤치가 기다리는 첫 번째 기억의 정원을 둘러보세요.',
};

export default function GardenPage() {
  return <GardenPreview />;
}
