import { useEffect, useRef, useState } from 'react';
import { createDiaryDraft, type DiaryDraft } from './diary-draft';
import { readDiaryEntry, saveDiaryEntry } from './diary-storage';

export function useDiaryEntry() {
  const [date, setDate] = useState(() => createDiaryDraft().date);
  const [drafts, setDrafts] = useState<Record<string, DiaryDraft>>({});
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [notice, setNotice] = useState<{ text: string; error?: boolean }>();
  const [saving, setSaving] = useState(false);
  const pendingSave = useRef(false);
  const draft = drafts[date];
  const loaded = Boolean(draft);

  useEffect(() => {
    if (loaded) return;
    let current = true;
    void readDiaryEntry(date).then(
      (entry) => {
        if (current) {
          setDrafts((previous) => ({
            ...previous,
            [date]: entry ?? { date, title: '', body: '', photos: [] },
          }));
        }
      },
      () => {
        if (current) setLoadError(true);
      },
    );
    return () => {
      current = false;
    };
  }, [date, loaded, attempt]);

  function selectDate(next: string) {
    if (!next || next === date || pendingSave.current) return;
    setLoadError(false);
    setNotice(undefined);
    setDate(next);
  }

  function updateDraft(update: (current: DiaryDraft) => DiaryDraft) {
    if (pendingSave.current) return;
    setNotice(undefined);
    setDrafts((previous) =>
      previous[date] ? { ...previous, [date]: update(previous[date]) } : previous,
    );
  }

  async function save() {
    if (!draft || pendingSave.current) return;
    if (!draft.body.trim()) {
      setNotice({ text: '본문을 입력해 주세요.', error: true });
      return;
    }
    pendingSave.current = true;
    setSaving(true);
    setNotice(undefined);
    try {
      await saveDiaryEntry(draft);
      setNotice({ text: '일기를 저장했어요.' });
    } catch {
      setNotice({
        text: '일기를 저장하지 못했어요. 입력한 내용은 남아 있으니 다시 시도해 주세요.',
        error: true,
      });
    } finally {
      pendingSave.current = false;
      setSaving(false);
    }
  }

  return {
    date,
    draft,
    loadError,
    notice,
    saving,
    save,
    selectDate,
    updateDraft,
    retryLoad() {
      setLoadError(false);
      setAttempt((previous) => previous + 1);
    },
  };
}
