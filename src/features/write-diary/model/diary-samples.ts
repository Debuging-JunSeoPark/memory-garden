import type { DiaryDraft } from './diary-draft';

const scenes = [
  [
    '창가에 내려앉은 눈',
    '새해 첫 산책길에 눈이 얇게 쌓여 있었다. 발자국을 남기고 돌아와 따뜻한 차를 마셨다.',
  ],
  [
    '겨울 끝의 햇빛',
    '목도리를 느슨하게 풀고 걸었다. 아직 차가운 바람 사이로 햇살이 조금 길어졌다.',
  ],
  [
    '작은 새싹을 발견한 날',
    '화단 가장자리에서 연한 초록색 새싹을 발견했다. 오늘은 작은 일부터 차근차근 시작했다.',
  ],
  ['벚꽃 아래 천천히', '분홍 꽃잎이 길 위에 내려앉았다. 잠시 걸음을 멈추고 바람을 기다렸다.'],
  [
    '풀꽃이 피어난 오후',
    '햇빛이 드는 벤치에 앉아 책을 읽었다. 이름 모를 작은 꽃들이 가까이 피어 있었다.',
  ],
  [
    '비 오는 날의 수국',
    '빗소리를 들으며 할 일을 정리했다. 저녁 산책에서 푸른 수국 한 무더기를 만났다.',
  ],
  [
    '그늘에서 쉬어가기',
    '초록 잎이 짙어졌다. 한낮에는 나무 그늘에서 쉬고 해가 내려간 뒤 동네를 걸었다.',
  ],
  [
    '여름빛을 모은 하루',
    '더운 오후에는 창문을 조금 닫고 차가운 물을 마셨다. 긴 하루 끝에 본 노을이 오래 기억났다.',
  ],
  [
    '바람이 달라진 날',
    '아침 바람이 어제보다 선선했다. 여름에 미뤄 두었던 일 하나를 다시 꺼내 보았다.',
  ],
  [
    '단풍길 산책',
    '붉고 노란 잎 사이를 걸었다. 바스락거리는 소리를 들으며 이번 달의 작은 변화를 돌아봤다.',
  ],
  [
    '낙엽을 밟으며',
    '나뭇잎이 많이 내려앉았다. 따뜻한 옷을 챙겨 입고 한 해 동안 쌓인 기억을 천천히 읽었다.',
  ],
  [
    '겨울을 맞는 저녁',
    '일찍 어두워진 창밖을 보며 따뜻한 저녁을 준비했다. 올해 고마웠던 순간을 적었다.',
  ],
] as const;

export function createDiarySamples(today = new Date()): DiaryDraft[] {
  const samples: DiaryDraft[] = [];
  for (let month = 0; month <= today.getMonth(); month += 1) {
    const lastDay = new Date(today.getFullYear(), month + 1, 0).getDate();
    const [title, scene] = scenes[month];
    for (const day of [1, 7, 14, 21, lastDay]) {
      if (month === today.getMonth() && day > today.getDate()) continue;
      const date = `${today.getFullYear()}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      samples.push({
        date,
        title: `[예시] ${month + 1}월 ${day}일, ${title}`,
        body: `사용성 확인을 위한 가상 일기입니다.\n\n${scene}\n\n${day === 1 ? '새로운 달의 첫 기록을 남긴다.' : '오늘 해낸 작은 일과 잠깐의 휴식을 기억해 두고 싶다.'}\n\n${day === lastDay ? '이번 달의 기록을 책장에 모아 두고 다음 달을 맞을 준비를 했다.' : '정원에 남긴 하루가 나중에도 작은 쉼표가 되었으면 좋겠다.'}`,
        photos: [],
      });
    }
  }
  return samples;
}
