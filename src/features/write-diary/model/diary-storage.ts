import type { DiaryDraft } from './diary-draft';

const storeName = 'entries';

function openDiaryDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('memory-garden-diary', 1);
    let blocked = false;

    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName, { keyPath: 'date' });
    };
    request.onblocked = () => {
      blocked = true;
      reject(new Error('The diary database is blocked by another tab.'));
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      if (blocked) database.close();
      else resolve(database);
    };
  });
}

async function withEntryStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const database = await openDiaryDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(storeName, mode);
      const request = run(transaction.objectStore(storeName));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () =>
        reject(transaction.error ?? request.error ?? new Error('Transaction aborted.'));
    });
  } finally {
    database.close();
  }
}

export function readDiaryEntry(date: string) {
  return withEntryStore(
    'readonly',
    (store) => store.get(date) as IDBRequest<DiaryDraft | undefined>,
  );
}

export async function saveDiaryEntry(draft: DiaryDraft) {
  await withEntryStore('readwrite', (store) => store.put(draft));
}
