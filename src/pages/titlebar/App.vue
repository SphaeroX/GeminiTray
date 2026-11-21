<template>
  <header class="bar" data-tauri-drag-region @dblclick="act('maximize')">
    <div class="brand" data-tauri-drag-region>
      <AppMark data-tauri-drag-region />
      <span data-tauri-drag-region>Gemini Tray</span>
    </div>

    <div class="tools">
      <button class="tool" :title="t('titlebar.new_chat')" :aria-label="t('titlebar.new_chat')" @click="act('newChat')" @dblclick.stop>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
          <path d="M8.5 2.5H4A1.5 1.5 0 0 0 2.5 4v8A1.5 1.5 0 0 0 4 13.5h8a1.5 1.5 0 0 0 1.5-1.5V7.5" />
          <path d="M11.8 1.9a1.3 1.3 0 0 1 1.9 1.9L8.2 9.3 6 9.9l.6-2.2 5.2-5.8Z" />
        </svg>
      </button>
      <button class="tool" :title="t('titlebar.prompts')" :aria-label="t('titlebar.prompts')" @click="act('prompts')" @dblclick.stop>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
          <path d="M5.5 4h8M5.5 8h8M5.5 12h8" />
          <circle cx="2.8" cy="4" r=".6" fill="currentColor" />
          <circle cx="2.8" cy="8" r=".6" fill="currentColor" />
          <circle cx="2.8" cy="12" r=".6" fill="currentColor" />
        </svg>
      </button>
      <button
        class="tool"
        :class="{ active: pinned }"
        :title="pinned ? t('titlebar.unpin') : t('titlebar.pin')"
        :aria-label="pinned ? t('titlebar.unpin') : t('titlebar.pin')"
        :aria-pressed="pinned"
        @click="act('pin')"
        @dblclick.stop
      >
        <svg width="16" height="16" viewBox="0 0 16 16" :fill="pinned ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
          <path d="M10.2 1.8l4 4-2.1.9-2.6 2.6.4 3-1.2 1.2-2.8-2.8L2.5 14.1 1.9 13.5l3.4-3.4-2.8-2.8L3.7 6.1l3 .4 2.6-2.6.9-2.1Z" />
        </svg>
      </button>
      <button class="tool" :title="t('titlebar.settings')" :aria-label="t('titlebar.settings')" @click="act('settings')" @dblclick.stop>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
          <path stroke-linejoin="round" d="M6.9 1.5h2.2l.4 1.8 1.2.5 1.6-1 1.6 1.6-1 1.6.5 1.2 1.8.4v2.2l-1.8.4-.5 1.2 1 1.6-1.6 1.6-1.6-1-1.2.5-.4 1.8H6.9l-.4-1.8-1.2-.5-1.6 1-1.6-1.6 1-1.6-.5-1.2-1.8-.4V6.9l1.8-.4.5-1.2-1-1.6 1.6-1.6 1.6 1 1.2-.5.4-1.8ZM8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
        </svg>
      </button>
    </div>

    <div class="captions">
      <button class="caption" :aria-label="t('common.minimize')" @click="act('minimize')" @dblclick.stop>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 5h10" stroke="currentColor" /></svg>
      </button>
      <button class="caption" :aria-label="t('titlebar.maximize')" @click="act('maximize')" @dblclick.stop>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect x=".5" y=".5" width="9" height="9" fill="none" stroke="currentColor" /></svg>
      </button>
      <button class="caption close" :aria-label="t('common.close')" @click="act('close')" @dblclick.stop>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" /></svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppMark from "../../lib/AppMark.vue";
import { api, type SettingsView } from "../../lib/api";
import { onEvent } from "../../lib/events";
import { setLanguage } from "../../lib/i18n";

const { t } = useI18n();
const pinned = ref(false);

function apply(v: SettingsView) {
  pinned.value = v.settings.window.alwaysOnTop;
  setLanguage(v.language);
}

function act(action: string) {
  api.titlebarAction(action);
}

onMounted(async () => {
  apply(await api.getSettings());
  await onEvent<SettingsView>("settings-changed", apply);
});
</script>

<style>
html, body { background: var(--tb-bg) !important; overflow: hidden; }
</style>

<style scoped>
.bar {
  height: 100vh;
  display: flex;
  align-items: center;
  padding-left: 14px;
  background: var(--tb-bg);
  color: var(--tb-text);
}
.brand { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; font-size: 13px; color: var(--tb-muted); white-space: nowrap; }
.tools { display: flex; align-items: center; gap: 2px; margin-right: 6px; }
.tool {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--tb-muted);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.tool:hover { background: var(--tb-hover); color: var(--tb-text); }
.tool.active { color: var(--tb-accent); }
.captions { display: flex; align-self: stretch; }
.caption {
  width: 46px;
  border: 0;
  background: transparent;
  color: var(--tb-text);
  display: grid;
  place-items: center;
}
.caption:hover { background: var(--tb-hover); }
.caption.close:hover { background: #c42b1c; color: #fff; }
</style>
