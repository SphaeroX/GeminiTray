<template>
  <div class="window">
    <header class="titlebar" data-tauri-drag-region>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" data-tauri-drag-region>
        <path d="M8 1.5c.6 3.4 3.1 5.9 6.5 6.5-3.4.6-5.9 3.1-6.5 6.5-.6-3.4-3.1-5.9-6.5-6.5 3.4-.6 5.9-3.1 6.5-6.5Z" fill="var(--accent)" />
      </svg>
      <span class="title" data-tauri-drag-region>{{ t("settings.window_title") }}</span>
      <button class="caption" :aria-label="t('common.minimize')" @click="minimize">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 5h10" stroke="currentColor" /></svg>
      </button>
      <button class="caption close" :aria-label="t('common.close')" @click="close">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" /></svg>
      </button>
    </header>
    <div class="body">
      <nav :aria-label="t('settings.nav_label')">
        <a
          v-for="c in categories"
          :key="c.id"
          :href="`#${c.id}`"
          :aria-current="c.id === current ? 'page' : undefined"
          :class="{ active: c.id === current }"
          @click.prevent="go(c.id)"
        >
          <span v-if="c.id === current" class="indicator"></span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
            <path :d="c.icon" />
          </svg>
          {{ t(`settings.nav.${c.id}`) }}
        </a>
      </nav>
      <main v-if="view">
        <h1>{{ t(`settings.nav.${current}`) }}</h1>
        <component :is="active" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { onEvent } from "../../lib/events";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { api } from "../../lib/api";
import { load, view } from "./store";
import { sections } from "./sections";

const { t } = useI18n();
const categories = sections;
const current = ref<string>(sections[0].id);
const active = computed(() => sections.find((s) => s.id === current.value)?.component);

function go(id: string) {
  if (sections.some((s) => s.id === id)) {
    current.value = id;
    history.replaceState(null, "", `#${id}`);
  }
}

function minimize() {
  getCurrentWindow().minimize();
}
function close() {
  api.closeWindow();
}

onMounted(async () => {
  go(location.hash.slice(1));
  window.addEventListener("hashchange", () => go(location.hash.slice(1)));
  await load();
  await onEvent<string>("settings-navigate", go);
});
</script>

<style scoped>
.window {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  border: 1px solid var(--border);
}
.titlebar { height: 40px; display: flex; align-items: center; gap: 10px; padding-left: 16px; flex-shrink: 0; }
.title { flex: 1; font-size: 12px; }
.caption {
  width: 46px;
  height: 40px;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: default;
}
.caption:hover { background: var(--nav-hover); }
.caption.close:hover { background: #c42b1c; color: #fff; }
.body { flex: 1; display: flex; min-height: 0; }
nav { width: 220px; padding: 4px 8px; display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
nav a {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 36px;
  padding: 0 12px;
  border-radius: var(--radius-control);
  color: var(--text);
  text-decoration: none;
}
nav a:hover { background: var(--nav-hover); }
nav a.active { background: var(--nav-active); }
.indicator { position: absolute; left: 0; top: 10px; width: 3px; height: 16px; border-radius: 2px; background: var(--accent); }
main {
  flex: 1;
  min-width: 0;
  background: var(--content);
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);
  border-top-left-radius: var(--radius-window);
  padding: 28px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  user-select: text;
}
h1 { margin: 0 0 16px; font-family: var(--font-display); font-size: 28px; font-weight: 600; }
</style>
