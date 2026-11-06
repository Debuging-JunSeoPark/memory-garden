import type { Ref } from 'react';

export function GardenMap({
  onOpenShelf,
  actionRef,
}: {
  onOpenShelf: () => void;
  actionRef?: Ref<HTMLButtonElement>;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-16">
      <div className="relative aspect-[10/9] w-full max-w-[min(42rem,75svh)]">
        <svg
          role="img"
          aria-labelledby="garden-map-title"
          aria-describedby="garden-map-desc"
          viewBox="0 0 400 360"
          className="h-full w-full"
        >
          <title id="garden-map-title">정원의 정적 지도</title>
          <desc id="garden-map-desc">
            둥근 정원의 돌길 끝에는 기억의 책장이 있어요. 돌길 왼쪽에는 그늘 나무와 벤치, 오른쪽에는
            작은 꽃밭이 있어요.
          </desc>
          <ellipse
            cx="200"
            cy="189"
            rx="169"
            ry="145"
            fill="#a6b77e"
            stroke="#8a9e66"
            strokeWidth="6"
          />
          <path
            d="M188 307C218 263 176 238 189 201S219 153 208 114"
            fill="none"
            stroke="#e3d4b3"
            strokeWidth="35"
            strokeDasharray="17 8"
            strokeLinecap="round"
          />
          <g fill="#68864f">
            <circle cx="113" cy="114" r="42" />
            <circle cx="83" cy="139" r="33" />
            <circle cx="136" cy="142" r="36" />
          </g>
          <circle cx="113" cy="124" r="25" fill="#819d61" />
          <rect x="104" y="151" width="15" height="29" rx="5" fill="#7c6248" />
          <g fill="#8f704b">
            <rect x="102" y="221" width="57" height="10" rx="3" />
            <rect x="102" y="235" width="57" height="10" rx="3" />
          </g>
          <rect x="250" y="153" width="63" height="78" rx="18" fill="#8b7957" />
          <g fill="#efc37d">
            <circle cx="266" cy="171" r="8" />
            <circle cx="295" cy="197" r="8" />
            <circle cx="267" cy="218" r="8" />
          </g>
          <g fill="#dba79b">
            <circle cx="295" cy="171" r="8" />
            <circle cx="266" cy="195" r="8" />
            <circle cx="295" cy="219" r="8" />
          </g>
          <g transform="translate(181 76)">
            <rect x="3" y="8" width="54" height="32" rx="4" fill="#9a7457" />
            <path
              d="M1 10Q30 -17 59 10"
              fill="none"
              stroke="#648257"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path d="M8 27H52" stroke="#e1b382" strokeWidth="4" />
            <rect x="13" y="12" width="7" height="12" rx="1" fill="#efbb77" />
          </g>
          <g fill="#293e32" fontFamily="sans-serif" fontSize="13" textAnchor="middle">
            <text x="211" y="64">
              기억의 책장
            </text>
            <text x="112" y="194">
              그늘 나무
            </text>
            <text x="130" y="266">
              벤치
            </text>
            <text x="282" y="254">
              꽃밭
            </text>
          </g>
          <text
            x="200"
            y="28"
            fill="#536b40"
            fontFamily="sans-serif"
            fontSize="12"
            textAnchor="middle"
          >
            N ↑
          </text>
        </svg>
        <button
          ref={actionRef}
          type="button"
          aria-label="지도에서 책장 열기"
          onClick={onOpenShelf}
          className="absolute top-[25%] left-[53%] min-h-11 min-w-12 -translate-1/2 cursor-pointer rounded-xl border border-transparent hover:border-moss focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss"
        />
      </div>
    </div>
  );
}
