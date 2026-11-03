export function GardenMap() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <svg
        role="img"
        aria-labelledby="garden-map-title"
        aria-describedby="garden-map-desc"
        viewBox="0 0 400 360"
        className="h-full max-h-96 w-full max-w-md"
      >
        <title id="garden-map-title">정원의 정적 지도</title>
        <desc id="garden-map-desc">
          둥근 정원 북서쪽에 그늘 나무가 있고, 중앙 돌길 옆에는 벤치, 동쪽에는 작은 꽃밭이 있어요.
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
          d="M188 307C218 263 176 238 189 201S219 143 208 92"
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
        <g fill="#293e32" fontFamily="sans-serif" fontSize="13" textAnchor="middle">
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
    </div>
  );
}
