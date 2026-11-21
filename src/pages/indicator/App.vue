<template>
  <div class="stage">
    <div v-if="state.error" class="pill" role="alert">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#FF99A4" stroke-width="1.4" aria-hidden="true">
        <circle cx="8" cy="8" r="6.3" />
        <path d="M8 4.5v4M8 10.8v.2" />
      </svg>
      <span>{{ t(`indicator.error.${state.error}`) }}</span>
      <a v-if="state.error === 'micFailed'" href="#" class="link" @click.prevent="api.openMicPrivacy()">{{ t("indicator.open_settings") }}</a>
      <button class="icon" :aria-label="t('common.close')" @click="api.voiceDismiss()">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" /></svg>
      </button>
    </div>

    <div v-else-if="state.phase === 'starting'" class="pill" role="status">
      <svg class="spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
        <path d="M8 2a6 6 0 0 1 6 6" stroke="var(--pill-accent)" stroke-width="2" stroke-linecap="round" />
      </svg>
      <span>{{ t("indicator.starting") }}</span>
      <span v-if="state.prompt" class="chip">{{ t("indicator.prompt", { name: state.prompt }) }}</span>
      <button class="icon" :aria-label="t('common.cancel')" @click="api.voiceCancel()">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" /></svg>
      </button>
    </div>

    <div v-else-if="state.phase === 'recording'" class="pill" role="status">
      <span class="dot"></span>
      <span>{{ state.mode === "message" ? t("indicator.message") : t("indicator.dictation") }}</span>
      <span v-if="state.prompt" class="chip">{{ t("indicator.prompt", { name: state.prompt }) }}</span>
      <span class="time">{{ time }}</span>
      <button class="primary" @click="api.voiceFinish()">
        {{ state.mode === "message" ? t("indicator.send") : t("indicator.done") }}
      </button>
      <button class="icon" :aria-label="t('common.cancel')" @click="api.voiceCancel()">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" /></svg>
      </button>
    </div>

    <div v-else-if="state.phase === 'transcribing'" class="pill compact" role="status">
      <svg class="spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
        <path d="M8 2a6 6 0 0 1 6 6" stroke="var(--pill-accent)" stroke-width="2" stroke-linecap="round" />
      </svg>
      <span>{{ t("indicator.transcribing") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api, type IndicatorState } from "../../lib/api";
import { onEvent } from "../../lib/events";
import { formatDuration } from "../../lib/indicator";
import { isTauri } from "@tauri-apps/api/core";

/** Browser preview: indicator.html#recording | #message | #starting | #transcribing | #error */
function demo() {
  const h = location.hash.slice(1);
  if (h === "starting") Object.assign(state, { phase: "starting", mode: "dictation" });
  else if (h === "transcribing") Object.assign(state, { phase: "transcribing", mode: "dictation" });
  else if (h === "error") Object.assign(state, { phase: "idle", error: "micFailed" });
  else Object.assign(state, { phase: "recording", mode: h === "message" ? "message" : "dictation", prompt: h === "message" ? (navigator.language.startsWith("de") ? "Kurz erklären" : "Explain briefly") : null });
  seconds.value = 12;
}

const { t } = useI18n();
const state = reactive<IndicatorState>({ phase: "idle", mode: undefined, prompt: null, error: null });
const seconds = ref(0);
let errorTimer: ReturnType<typeof setTimeout> | undefined;

const time = computed(() => formatDuration(seconds.value));

onMounted(async () => {
  if (import.meta.env.DEV && !isTauri()) demo();
  await onEvent<IndicatorState>("voice-state", (s) => {
    Object.assign(state, { mode: undefined, prompt: null, error: null }, s);
    if (s.phase === "recording" && !s.error) seconds.value = 0;
    clearTimeout(errorTimer);
    if (s.error) errorTimer = setTimeout(() => api.voiceDismiss(), 6000);
  });
  await onEvent<{ seconds: number }>("voice-level", (l) => (seconds.value = l.seconds));
});
</script>

<style>
html, body { background: transparent !important; }
</style>

<style scoped>
.stage {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pill {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 8px 0 16px;
  border-radius: 24px;
  background: var(--pill);
  border: 1px solid var(--pill-border);
  color: #fff;
  white-space: nowrap;
}
.pill.compact { padding: 0 20px 0 16px; }
.dot { width: 10px; height: 10px; border-radius: 5px; background: var(--rec); animation: pulse 1.2s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: 0.45; } }
.chip { height: 24px; display: flex; align-items: center; padding: 0 10px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); font-size: 12px; color: #e0e0e0; max-width: 160px; overflow: hidden; text-overflow: ellipsis; }
.time { font-variant-numeric: tabular-nums; color: #d0d0d0; min-width: 32px; }
.primary { height: 32px; padding: 0 12px; border-radius: 16px; border: 0; background: var(--pill-accent); color: #000; font-size: 13px; font-weight: 600; cursor: pointer; }
.icon { width: 32px; height: 32px; border-radius: 16px; border: 0; background: rgba(255, 255, 255, 0.08); color: #fff; display: grid; place-items: center; cursor: pointer; }
.icon:hover { background: rgba(255, 255, 255, 0.16); }
.link { color: #99ebff; font-size: 13px; }
.spin { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
