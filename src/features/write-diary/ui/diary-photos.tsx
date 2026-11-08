'use client';

import { useEffect, useRef, useState } from 'react';
import type { DiaryDraft, DiaryPhoto } from '../model/diary-draft';

const photoLimit = 8;
const sizeLimit = 10 * 1024 * 1024;
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function PhotoPreview({ photo }: { photo: DiaryPhoto }) {
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(photo.file);
    if (image.current) image.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [photo.file]);

  return (
    // Local file previews use an object URL whose lifetime matches this element.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={image}
      alt={photo.description || photo.file.name}
      className="aspect-[4/3] w-full rounded-sm object-cover"
    />
  );
}

async function canPreview(file: File) {
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    image.src = url;
    await image.decode();
    return true;
  } catch {
    return false;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function DiaryPhotos({
  photos,
  onChange,
}: {
  photos: DiaryPhoto[];
  onChange: (update: (draft: DiaryDraft) => DiaryDraft) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const pending = useRef(false);

  async function addPhotos(files: File[]) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setMessage('');
    const accepted: DiaryPhoto[] = [];
    const problems: string[] = [];
    try {
      for (const file of files) {
        if (photos.length + accepted.length >= photoLimit) {
          problems.push('사진은 최대 8장까지 추가할 수 있어요.');
          break;
        }
        if (!imageTypes.has(file.type)) {
          problems.push(`${file.name} — JPG, PNG, WebP, GIF 사진을 선택해 주세요.`);
        } else if (file.size > sizeLimit) {
          problems.push(`${file.name} — 한 장에 10MB 이하로 선택해 주세요.`);
        } else if (!(await canPreview(file))) {
          problems.push(`${file.name} — 사진을 읽을 수 없어요. 다른 파일을 선택해 주세요.`);
        } else {
          accepted.push({ id: crypto.randomUUID(), file, description: '' });
        }
      }
      if (accepted.length > 0) {
        onChange((current) => ({
          ...current,
          photos: [...current.photos, ...accepted].slice(0, photoLimit),
        }));
      }
      setMessage(problems.join(' '));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="diary-photos-title" className="mt-7">
      <div className="flex items-center justify-between gap-3">
        <h3 id="diary-photos-title" className="text-sm font-semibold text-ink">
          오늘의 사진
        </h3>
        <span className="text-xs text-moss">
          {photos.length} / {photoLimit}
        </span>
      </div>
      <label className="relative mt-3 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#acb18d] bg-white/35 p-4 text-center text-moss hover:bg-white/60 focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-moss">
        <span aria-hidden="true" className="text-3xl font-light">
          ＋
        </span>
        <span className="mt-1 text-sm font-medium">
          {busy ? '사진을 살펴보고 있어요…' : '사진 추가'}
        </span>
        <span className="mt-2 text-[11px] leading-5 text-ink/60">
          JPG · PNG · WebP · GIF, 한 장에 10MB까지
        </span>
        <input
          type="file"
          aria-label="사진 추가"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          disabled={busy}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait"
          onChange={(event) => {
            const files = Array.from(event.currentTarget.files ?? []);
            event.currentTarget.value = '';
            void addPhotos(files);
          }}
        />
      </label>
      <p role="status" className="sr-only">
        {busy ? '사진을 불러오는 중이에요.' : `사진 ${photos.length}장이 있어요.`}
      </p>
      {message && (
        <p role="alert" className="mt-3 text-xs leading-6 text-[#914b35]">
          {message}
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {photos.map((photo, index) => (
          <figure
            key={photo.id}
            className="rounded-sm border border-[#e5d8bd] bg-[#fffdf5] p-2 shadow-[2px_5px_10px_#74634718]"
          >
            <PhotoPreview photo={photo} />
            <figcaption className="mt-2">
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-[10px] text-ink/60">{photo.file.name}</span>
                <button
                  type="button"
                  aria-label={`사진 ${index + 1} 삭제`}
                  className="min-h-11 shrink-0 cursor-pointer px-2 text-xs text-[#914b35] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-moss"
                  onClick={() =>
                    onChange((current) => ({
                      ...current,
                      photos: current.photos.filter((item) => item.id !== photo.id),
                    }))
                  }
                >
                  삭제
                </button>
              </div>
              <input
                aria-label={`사진 ${index + 1} 설명`}
                placeholder="이 사진은 어떤 순간인가요?"
                value={photo.description}
                className="min-h-11 w-full border-b border-[#d9cfb7] bg-transparent px-1 text-xs text-ink focus-visible:outline-2 focus-visible:outline-moss"
                onChange={(event) => {
                  const description = event.target.value;
                  onChange((current) => ({
                    ...current,
                    photos: current.photos.map((item) =>
                      item.id === photo.id ? { ...item, description } : item,
                    ),
                  }));
                }}
              />
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
