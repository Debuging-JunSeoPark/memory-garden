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
            <dl className="mt-7 grid gap-6 border-t border-ink/15 pt-7">
              <div>
                <dt className="font-medium">01. 그늘 나무</dt>
                <dd className="mt-2 text-sm leading-7 text-ink/70">
                  천천히 자란 나무 아래, 잠깐 쉬어가도 괜찮아요.
                </dd>
              </div>
              <div>
                <dt className="font-medium">02. 작은 꽃밭</dt>
                <dd className="mt-2 text-sm leading-7 text-ink/70">
                  소박한 하루도 저마다의 빛깔로 피어날 거예요.
                </dd>
              </div>
              <div>
                <dt className="font-medium">03. 쉬어가는 벤치</dt>
                <dd className="mt-2 text-sm leading-7 text-ink/70">
                  오늘의 마음을 가만히 내려놓는 자리예요.
                </dd>
              </div>
            </dl>
            <p className="mt-8 rounded-2xl bg-[#e8ebdd] p-5 text-sm leading-7 text-moss">
              지금은 정원을 바라볼 수 있어요. 이곳에 남길 이야기를 기다리고 있어요.
            </p>
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
