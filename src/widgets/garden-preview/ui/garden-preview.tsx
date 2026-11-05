import Link from 'next/link';
import { GardenViewport } from './garden-viewport';

export function GardenPreview() {
  return (
    <main>
      <h1 className="sr-only">기억의 정원</h1>
      <GardenViewport>
        <div className="mx-auto grid max-w-3xl overflow-hidden rounded-[1.2rem] border-4 border-[#a76b4e] bg-[#f7edda] text-sm leading-7 shadow-xl sm:grid-cols-2">
          <section className="border-b border-[#dfc5a0] bg-linear-to-b from-[#fff8e9] to-[#f2e3c7] p-6 sm:border-r sm:border-b-0 sm:bg-linear-to-r sm:p-9">
            <p className="text-xs tracking-widest text-moss">첫 번째 책</p>
            <h2 className="mt-4 text-3xl font-semibold">정원 안내서</h2>
            <p className="mt-3 font-medium">당신의 첫 번째 정원</p>
            <p className="mt-3">아직 아무것도 쓰지 않은 날에도, 쉴 수 있는 자리는 있어요.</p>
            <p className="mt-5">
              방향키나 WASD, 또는 이동 조이스틱으로 정원을 걸어요. 돌길 끝의 책장에 가까워지면
              선반을 살펴볼 수 있어요.
            </p>
          </section>
          <section className="bg-linear-to-t from-[#fff8e9] to-[#f2e3c7] p-6 sm:bg-linear-to-l sm:p-9">
            <h3 className="text-lg font-semibold">기억이 자라는 곳</h3>
            <dl className="mt-4 grid gap-3">
              <div>
                <dt className="font-semibold">작은 꽃밭</dt>
                <dd>기록한 날마다 정원에 그날의 꽃 한 송이가 피어나요.</dd>
              </div>
              <div>
                <dt className="font-semibold">기억의 책장</dt>
                <dd>한 달에 한 권, 책장에서 그달의 일기를 날짜별로 다시 읽을 수 있어요.</dd>
              </div>
            </dl>
            <p className="mt-4 text-moss">일기 쓰기는 이후에 열려요.</p>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center underline underline-offset-4"
            >
              소개로 돌아가기
            </Link>
          </section>
        </div>
      </GardenViewport>
    </main>
  );
}
