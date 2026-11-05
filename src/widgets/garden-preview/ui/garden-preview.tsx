import Link from 'next/link';
import { GardenViewport } from './garden-viewport';

export function GardenPreview() {
  return (
    <>
      <a
        href="#garden-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-20 focus:bg-paper focus:p-3"
      >
        본문으로 건너뛰기
      </a>
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-7 md:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold"
          aria-label="기억의 정원 홈"
        >
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-moss text-paper"
          >
            ✳
          </span>
          기억의 정원
        </Link>
        <Link href="/" className="text-sm underline decoration-moss/40 underline-offset-8">
          소개로 돌아가기
        </Link>
      </header>
      <main id="garden-main" className="mx-auto max-w-7xl px-6 pb-12 md:px-12">
        <div className="pt-8 pb-9 md:pt-12">
          <p className="text-xs tracking-[0.25em] text-moss">GARDEN NO. 001</p>
          <h1 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] sm:text-5xl">
            당신의 첫 번째 정원
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink/70">
            아직 아무것도 쓰지 않은 날에도, 쉴 수 있는 자리는 있어요.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10">
          <GardenViewport />
          <aside aria-labelledby="places-title" className="py-2">
            <p className="text-xs tracking-[0.2em] text-moss">LITTLE PLACES</p>
            <h2 id="places-title" className="mt-4 text-xl leading-8 font-medium">
              오래 머물고 싶은 작은 장소들
            </h2>
            <details className="group mt-5 rounded-2xl border border-moss/20 bg-[#eef0e2]">
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden="true"
                  className="h-7 w-5 shrink-0 rounded-r-sm border-l-4 border-[#a95f45] bg-[#d29067] shadow-sm"
                />
                정원 안내서
                <span aria-hidden="true" className="ml-auto group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <div
                role="region"
                aria-label="정원 안내서 내용"
                className="px-4 pt-1 pb-4 text-sm leading-6 text-ink/80"
              >
                <ol className="grid list-decimal gap-2 pl-4">
                  <li>3D 정원과 정적 지도에서 돌길 끝의 기억의 책장을 찾아보세요.</li>
                  <li>기록한 날마다 정원에 그날의 꽃 한 송이가 피어나요.</li>
                  <li>한 달에 한 권, 책장에서 그달의 일기를 날짜별로 다시 읽을 수 있어요.</li>
                </ol>
                <p className="mt-3 border-t border-moss/15 pt-2 text-xs text-moss">
                  지금은 정원과 안내서를 둘러볼 수 있어요. 일기 쓰기는 이후에 열려요.
                </p>
              </div>
            </details>
            <dl className="mt-6 grid gap-5 border-t border-ink/15 pt-5">
              <div>
                <dt className="font-medium">01. 그늘 나무</dt>
                <dd className="mt-2 text-sm leading-7 text-ink/70">
                  그늘 나무 옆 벤치에 앉아 잠깐 쉬어가도 괜찮아요.
                </dd>
              </div>
              <div>
                <dt className="font-medium">02. 작은 꽃밭</dt>
                <dd className="mt-2 text-sm leading-7 text-ink/70">
                  소박한 하루도 저마다의 빛깔로 피어날 거예요.
                </dd>
              </div>
              <div>
                <dt className="font-medium">03. 기억의 책장</dt>
                <dd className="mt-2 text-sm leading-7 text-ink/70">
                  돌길 끝 책장에는 정원 안내서가 꽂혀 있어요. 앞으로 이곳에 한 달씩 기억을 모아요.
                </dd>
              </div>
            </dl>
          </aside>
        </div>
        <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-ink/15 pt-6 text-xs text-ink/60">
          <span>서두르지 않아도, 기억은 자라니까.</span>
          <span>기억의 정원</span>
        </footer>
      </main>
    </>
  );
}
