<template>
  <svg class="hero-illustration" viewBox="0 0 700 400" fill="none" aria-hidden="true">
    <rect x="60" y="140" width="70" height="130" rx="8" stroke="var(--border-hi)" stroke-width="2" />
    <rect x="70" y="155" width="50" height="90" rx="2" fill="var(--surface-2)" />
    <circle cx="95" cy="255" r="4" fill="var(--border-hi)" />

    <path
      d="M 140 190 Q 350 100 560 190"
      stroke="var(--accent)"
      stroke-width="2"
      stroke-dasharray="6 6"
      class="transfer-path"
    />
    <circle cx="350" cy="128" r="14" fill="var(--accent)" opacity="0.15" />
    <text x="350" y="133" text-anchor="middle" fill="var(--accent)" font-size="14" font-family="var(--mono)">₦</text>

    <circle cx="590" cy="180" r="30" fill="var(--border-hi)" opacity="0.5" />
    <path
      d="M 555 260 Q 555 210 590 205 Q 625 210 625 260 Z"
      fill="var(--border-hi)"
      opacity="0.5"
    />
    <text x="590" y="188" text-anchor="middle" fill="var(--bg)" font-size="20" font-family="var(--mono)">?</text>

    <path
      d="M 350 60 L 366 86 L 334 86 Z"
      stroke="#f87171"
      stroke-width="2"
      fill="rgba(248,113,113,0.08)"
    />
    <text x="350" y="81" text-anchor="middle" fill="#f87171" font-size="12" font-family="var(--mono)">!</text>
  </svg>
</template>

<style scoped>
.hero-illustration {
  width: 100%;
  height: auto;
  display: block;
}

.transfer-path {
  stroke-dasharray: 6 6;
  animation: dash-flow 2s linear infinite;
}
@keyframes dash-flow {
  to { stroke-dashoffset: -24; }
}
</style>