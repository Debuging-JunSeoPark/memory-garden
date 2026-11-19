'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { addDiarySamples } from '../model/diary-storage';
import { createDiarySamples } from '../model/diary-samples';

export function DemoDiaryLoader() {
  const [samples] = useState(createDiarySamples);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const pending = useRef(false);
  async function load() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setMessage('');
    try {
      const added = await addDiarySamples(samples);
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
        <h1 className="text-2xl font-semibold">월별 예시 일기로 정원 둘러보기</h1>
        <p className="mt-4 leading-7">
          올해 1월부터 오늘까지의 가상 일기 {samples.length}개를 이 브라우저에 추가해요. 같은 날짜의
          기록이 있으면 그대로 보관하고 건너뛰어요. 예시 제목에는 [예시]가 붙어요.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => void load()}
          className="mt-6 min-h-11 rounded-full bg-moss px-5 text-white disabled:opacity-50"
        >
          {busy ? '예시 추가 중…' : `월별 예시 일기 ${samples.length}개 넣기`}
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
