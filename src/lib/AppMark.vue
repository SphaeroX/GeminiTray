<!-- The app mark at 16 px: same drawing as images/brand/tray.svg (the tray icon). -->
<template>
  <svg width="16" height="16" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <linearGradient id="gt-tile" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#4248c8" />
        <stop offset="1" stop-color="#181b52" />
      </linearGradient>
      <linearGradient id="gt-spark" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0" stop-color="#8af2ff" />
        <stop offset="0.5" stop-color="#8fb0ff" />
        <stop offset="1" stop-color="#d99bff" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="62" height="62" rx="15" fill="url(#gt-tile)" />
    <path d="M32 6C34 19 37.5 22.5 52.5 24.8 37.5 27.1 34 30.6 32 43.6 30 30.6 26.5 27.1 11.5 24.8 26.5 22.5 30 19 32 6Z" fill="url(#gt-spark)" />
    <rect x="15" y="49" width="34" height="7" rx="3.5" fill="#8af2ff" />
  </svg>
</template>
