import Link from 'next/link';
import { GardenViewport } from './garden-viewport';

export function GardenPreview() {
  return (
    <main>
      <h1 className="sr-only">기억의 정원</h1>
      <GardenViewport>
        <h3 className="text-lg font-semibold">당신의 첫 번째 정원</h3>
        <p className="mt-2">아직 아무것도 쓰지 않은 날에도, 쉴 수 있는 자리는 있어요.</p>
        <dl className="mt-5 grid gap-3 border-y border-moss/20 py-4">
          <div>
            <dt className="font-semibold">그늘 나무와 벤치</dt>
            <dd>돌길 옆, 잠깐 앉아서 쉬어갈 수 있는 곳이에요.</dd>
          </div>
          <div>
            <dt className="font-semibold">작은 꽃밭</dt>
            <dd>기록한 날마다 정원에 그날의 꽃 한 송이가 피어나요.</dd>
          </div>
          <div>
            <dt className="font-semibold">기억의 책장</dt>
            <dd>한 달에 한 권, 책장에서 그달의 일기를 날짜별로 다시 읽을 수 있어요.</dd>
          </div>
        </dl>
        <p className="mt-4 text-moss">
          지금은 정원과 안내서를 둘러볼 수 있어요. 일기 쓰기는 이후에 열려요.
        </p>
        <Link
          href="/"
          className="mt-3 inline-flex min-h-11 items-center underline underline-offset-4"
        >
          소개로 돌아가기
        </Link>
      </GardenViewport>
    </main>
  );
}
