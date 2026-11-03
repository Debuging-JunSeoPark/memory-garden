import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '기억의 정원 | 작은 하루가 자라는 곳',
  description: '글과 사진으로 남긴 하루가 작은 정원으로 자라는 공간, 기억의 정원.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
