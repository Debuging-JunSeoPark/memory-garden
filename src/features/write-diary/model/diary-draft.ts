export type DiaryDraft = {
  date: string;
  title: string;
  body: string;
};

export function createDiaryDraft(): DiaryDraft {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return { date: `${today.getFullYear()}-${month}-${day}`, title: '', body: '' };
}
