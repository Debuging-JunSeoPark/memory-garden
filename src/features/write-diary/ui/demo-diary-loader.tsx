'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { addDiarySamples } from '../model/diary-storage';
import type { DiaryDraft } from '../model/diary-draft';

const scenes = [
  [
    '비 온 뒤의 산책',
    '비가 그친 뒤 동네를 한 바퀴 걸었다. 젖은 나뭇잎이 유난히 선명했다. 평소에 지나치던 작은 화단 앞에서 잠시 멈췄다.',
  ],
  [
    '조용히 읽은 책',
    '오후에는 창가에 앉아 책을 읽었다. 많이 읽으려던 계획과 달리 한 문장을 오래 바라봤다.\n\n책장을 덮고 나니 마음이 한결 조용해졌다.',
  ],
  [
    '잘 안 풀리던 날',
    '계획한 일이 생각보다 오래 걸렸다. 자꾸 처음으로 돌아오는 기분이었다.\n\n잠깐 자리에서 일어나 물을 마셨다. 오늘 해결한 작은 것 세 가지를 적어보니 멈춰 있었던 하루는 아니었다. 내일은 가장 작은 일부터 시작해보자.',
  ],
  [
    '따뜻한 저녁 한 끼',
    '냉장고에 남은 재료로 저녁을 만들었다. 보기 좋은 모양은 아니었지만 따뜻해서 좋았다. 설거지를 끝내고 틀어둔 노래까지 마음에 남았다.',
  ],
  [
    '오래 이야기한 오후',
    '오랜만에 친구와 만나 근황을 나눴다. 별것 아닌 이야기에 웃다가 시간이 훌쩍 지났다. 집으로 돌아오는 길에도 대화의 조각들이 생각났다.',
  ],
  [
    '아무것도 서두르지 않기',
    '알람 없이 눈을 떴다. 커피를 내리고 창문을 열었다.\n\n해야 할 일을 적는 대신 오늘 눈에 들어오는 것들을 적었다. 구름의 모양, 컵에 닿는 빛, 멀리서 들리는 새소리.\n\n쉬는 날에도 무언가를 해내야 한다는 생각을 잠시 내려놓았다. 아무것도 서두르지 않은 하루가 오히려 오래 기억날 것 같다.',
  ],
] as const;

function createSamples(): DiaryDraft[] {
  const samples: DiaryDraft[] = [];
  // Six completed months keep every sample in the past, including month boundaries.
  const today = new Date();
  for (let offset = 6; offset >= 1; offset -= 1) {
    const month = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (const day of [1, 7, 14, 21, lastDay]) {
      const [title, body] = scenes[samples.length % scenes.length];
      const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      samples.push({
        date,
        title: `[예시] ${title}`,
        body: `사용성 확인을 위한 가상 일기입니다.\n\n${body}`,
        photos: [],
      });
    }
  }
  return samples;
}

export function DemoDiaryLoader() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const pending = useRef(false);
  async function load() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setMessage('');
    try {
      const added = await addDiarySamples(createSamples());
      setMessage(`예시 일기 ${added}개를 추가했어요. 기존 날짜는 건너뛰었어요.`);
    } catch {
      setMessage('예시를 추가하지 못했어요. 다시 시도해 주세요.');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <main className="min-h-svh bg-[#e8eddf] px-6 py-16 text-ink">
      <div className="mx-auto max-w-xl rounded-3xl bg-paper p-8">
        <h1 className="text-2xl font-semibold">과거 일기로 정원 둘러보기</h1>
        <p className="mt-4 leading-7">
          지난 6개월에 걸친 가상 일기 30개를 이 브라우저에 추가해요. 같은 날짜의 기록이 있으면
          그대로 보관하고 건너뛰어요. 예시 제목에는 [예시]가 붙어요.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => void load()}
          className="mt-6 min-h-11 rounded-full bg-moss px-5 text-white disabled:opacity-50"
        >
          {busy ? '예시 추가 중…' : '예시 일기 30개 넣기'}
        </button>
        <p role="status" className="mt-4 text-sm leading-6">
          {message}
        </p>
        <Link href="/garden" className="mt-5 inline-flex min-h-11 items-center underline">
          정원에서 사용해보기
        </Link>
      </div>
    </main>
  );
}
