<template>
  <div class="stack">
    <div v-for="item in items" :key="item.id" class="toast" :role="item.level === 'error' ? 'alert' : 'status'">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" class="icon">
        <circle cx="9" cy="9" r="8" :fill="color(item.level)" />
        <path v-if="item.level === 'success'" d="M5.5 9.2l2.3 2.3 4.7-4.9" fill="none" stroke="var(--on-accent)" stroke-width="1.6" />
        <path v-else-if="item.level === 'error'" d="M6.2 6.2l5.6 5.6M11.8 6.2l-5.6 5.6" stroke="var(--on-accent)" stroke-width="1.6" />
        <path v-else-if="item.level === 'warning'" d="M9 4.8v5M9 12.4v.4" stroke="#000" stroke-width="1.8" stroke-linecap="round" />
        <path v-else d="M9 8v5M9 5.2v.4" stroke="var(--on-accent)" stroke-width="1.8" stroke-linecap="round" />
      </svg>
      <div class="text">
        <span class="title">{{ title(item) }}</span>
        <span v-if="body(item)" class="body">{{ body(item) }}</span>
      </div>
      <button class="close" :aria-label="t('common.close')" @click="dismiss(item.id)">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { onEvent } from "../../lib/events";
import { api, type Level, type Notification } from "../../lib/api";
import { toastText, toastTimeout } from "../../lib/toast";

interface Item extends Notification {
  id: number;
}

const { t, te } = useI18n();
const items = ref<Item[]>([]);
let nextId = 1;
const MAX = 3;

function color(level: Level) {
  return { info: "var(--accent)", success: "var(--success)", warning: "var(--caution)", error: "var(--danger)" }[level];
}
const title = (n: Notification) => toastText(t, te, n).title;
const body = (n: Notification) => toastText(t, te, n).body;

function dismiss(id: number) {
  items.value = items.value.filter((i) => i.id !== id);
  if (items.value.length === 0) api.toastIdle();
}

function push(n: Notification) {
  const item = { ...n, id: nextId++ };
  items.value = [...items.value, item].slice(-MAX);
  setTimeout(() => dismiss(item.id), toastTimeout(n.level));
}

onMounted(async () => {
  await onEvent<Notification>("toast", push);
  for (const n of await api.toastReady()) push(n);
});
</script>

<style>
html, body { background: transparent !important; }
</style>

<style scoped>
.stack {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 12px;
  padding: 8px;
}
.toast {
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 14px 12px 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-window);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}
.icon { flex-shrink: 0; margin-top: 1px; }
.text { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.title { font-weight: 600; }
.body { font-size: 13px; color: var(--muted); overflow-wrap: anywhere; }
.close {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: 0;
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--muted);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.close:hover { background: var(--selected); }
</style>
