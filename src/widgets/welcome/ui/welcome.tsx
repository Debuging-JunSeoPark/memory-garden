export function Welcome() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10 focus:bg-paper focus:p-3"
      >
        본문으로 건너뛰기
      </a>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-7 md:px-12">
        <a
          href="#"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight"
          aria-label="기억의 정원 홈"
        >
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-moss text-paper"
          >
            ✳
          </span>
          기억의 정원
        </a>
        <a href="#garden-story" className="text-sm underline decoration-moss/40 underline-offset-8">
          정원 이야기
        </a>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-6 md:px-12">
        <section
          className="grid min-h-[65vh] items-center gap-10 border-b border-ink/15 py-16 md:grid-cols-[1.3fr_1fr] md:py-24"
          aria-labelledby="welcome-title"
        >
          <div>
            <p className="mb-6 text-xs font-medium tracking-[0.25em] text-moss">
              A LITTLE PLACE FOR YOUR DAYS
            </p>
            <h1
              id="welcome-title"
              className="text-5xl leading-[1.25] font-medium tracking-[-0.06em] md:text-7xl"
            >
              작은 하루가
              <br />
              자라는 곳.
            </h1>
            <p className="mt-8 max-w-md text-base leading-8 text-ink/75">
              흘려보내기 아쉬운 순간들을 글과 사진으로.
              <br className="hidden sm:block" />
              당신의 기억이 머물 작은 정원을 준비하고 있어요.
            </p>
            <a
              href="#garden-story"
              className="mt-10 inline-flex items-center gap-8 rounded-full bg-ink px-7 py-4 text-sm text-paper"
            >
              어떤 공간인가요? <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div
            aria-hidden="true"
            className="relative mx-auto flex aspect-square w-full max-w-80 items-center justify-center rounded-t-full rounded-b-[42%] bg-[#e4e8d6]"
          >
            <div className="absolute inset-5 rounded-t-full rounded-b-[42%] border border-moss/20" />
            <svg viewBox="0 0 220 220" className="size-56 text-moss" fill="none">
              <ellipse cx="110" cy="172" rx="60" ry="14" fill="#d2dabe" />
              <path d="M110 169V94" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <path d="M110 133C74 137 62 117 65 96C91 95 109 106 110 133Z" fill="#8caa70" />
              <path d="M110 108C108 78 125 57 151 56C155 84 141 105 110 108Z" fill="#627d4c" />
              <circle cx="110" cy="165" r="5" fill="currentColor" />
              <path d="M63 69L66 62L69 69L76 72L69 75L66 82L63 75L56 72Z" fill="#b1b982" />
            </svg>
            <span className="absolute bottom-9 text-[10px] tracking-[0.3em] text-moss">
              EVERY DAY, A LITTLE GROWTH
            </span>
          </div>
        </section>

        <section
          id="garden-story"
          className="scroll-mt-8 py-16 md:py-20"
          aria-labelledby="story-title"
        >
          <p className="mb-4 text-xs tracking-[0.2em] text-moss">OUR GARDEN</p>
          <h2 id="story-title" className="text-3xl font-medium tracking-tight">
            기억이 자라는 방식
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <article>
              <p className="text-xs text-moss">01 / 남기기</p>
              <h3 className="mt-4 text-xl">평범한 날도, 특별한 순간도</h3>
              <p className="mt-3 text-sm leading-7 text-ink/75">
                짧은 글 한 줄과 사진 한 장에서 시작해요. 잘 쓴 글이 아니어도 괜찮아요.
              </p>
            </article>
            <article>
              <p className="text-xs text-moss">02 / 거닐기</p>
              <h3 className="mt-4 text-xl">기록이 풍경이 되는 정원</h3>
              <p className="mt-3 text-sm leading-7 text-ink/75">
                기억이 담긴 정원을 걸으며 지난 하루를 만나요. 잠시 쉬어가도 정원은 기다려요.
              </p>
            </article>
            <article>
              <p className="text-xs text-moss">03 / 엮기</p>
              <h3 className="mt-4 text-xl">몇 번의 하루를 하나의 이야기로</h3>
              <p className="mt-3 text-sm leading-7 text-ink/75">
                다시 꺼내 보고 싶은 기억을 골라 나만의 글로 엮어요.
              </p>
            </article>
          </div>
          <p className="mt-12 text-sm text-moss">
            아직 정원을 가꾸는 중이에요. 기록과 정원 기능은 차근차근 열릴 예정입니다.
          </p>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-ink/15 px-6 py-7 text-xs text-ink/60 md:px-12">
        <span>기억의 정원</span>
        <span>서두르지 않아도, 기억은 자라니까.</span>
      </footer>
    </>
  );
}
