<template>
  <div class="stage">
    <div class="menu" role="dialog" :aria-label="t('prompts_menu.title')">
      <div class="search">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--muted)" stroke-width="1.4" aria-hidden="true">
          <circle cx="7" cy="7" r="4.8" />
          <path d="M10.5 10.5l4 4" />
        </svg>
        <label for="q" class="sr-only">{{ t("prompts_menu.search") }}</label>
        <input
          id="q"
          ref="input"
          v-model="query"
          :placeholder="t('prompts_menu.search')"
          autocomplete="off"
          spellcheck="false"
          @keydown="onKey"
        />
        <span class="shortcut">{{ shortcut }}</span>
      </div>
      <div class="list" role="listbox" :aria-label="t('prompts_menu.title')">
        <p v-if="prompts.length === 0" class="empty">
          {{ t("prompts_menu.empty") }}
          <a href="#" @click.prevent="api.openSettings('prompts')">{{ t("prompts_menu.empty_hint") }}</a>
        </p>
        <p v-else-if="filtered.length === 0" class="empty">{{ t("prompts_menu.no_match") }}</p>
        <button
          v-for="(p, i) in filtered"
          :key="p.id"
          role="option"
          :aria-selected="i === selected"
          class="item"
          :class="{ selected: i === selected }"
          @mouseenter="selected = i"
          @click="choose(p.id)"
        >
          <span v-if="i === selected" class="bar"></span>
          <span class="name">
            {{ p.name }}
            <span v-if="p.id === activeId" class="badge">{{ t("prompts_menu.active") }}</span>
          </span>
          <span class="preview">{{ previewContent(p.content) }}</span>
        </button>
      </div>
      <div class="footer">
        <span>{{ t("prompts_menu.select") }}</span>
        <span>{{ t("prompts_menu.apply") }}</span>
        <span class="grow">{{ t("prompts_menu.close") }}</span>
        <a v-if="activeId" href="#" @click.prevent="api.promptClear()">{{ t("prompts_menu.clear") }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api, type Prompt } from "../../lib/api";
import { onEvent } from "../../lib/events";
import { displayAccelerator } from "../../lib/accelerator";
import { filterPrompts, moveSelection, previewContent } from "../../lib/prompts";
import { setLanguage } from "../../lib/i18n";

const { t, locale } = useI18n();
const prompts = ref<Prompt[]>([]);
const activeId = ref<string | null>(null);
const query = ref("");
const selected = ref(0);
const input = ref<HTMLInputElement>();
const accel = ref("Alt+J");

const filtered = computed(() => filterPrompts(prompts.value, query.value));
const shortcut = computed(() => displayAccelerator(accel.value, locale.value as "de" | "en"));
watch(query, () => (selected.value = 0));

async function refresh() {
  const [data, view] = await Promise.all([api.promptsMenuData(), api.getSettings()]);
  prompts.value = data.prompts;
  activeId.value = data.activeId;
  accel.value = view.settings.shortcuts.prompts || "";
  setLanguage(view.language);
  query.value = "";
  selected.value = 0;
  await nextTick();
  input.value?.focus();
}

function choose(id: string) {
  api.promptSelect(id);
}

function onKey(e: KeyboardEvent) {
  const n = filtered.value.length;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    selected.value = moveSelection(selected.value, 1, n);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selected.value = moveSelection(selected.value, -1, n);
  } else if (e.key === "Enter") {
    const p = filtered.value[selected.value];
    if (p) choose(p.id);
  } else if (e.key === "Escape") {
    api.promptsClose();
  }
}

onMounted(async () => {
  await refresh();
  await onEvent("prompts-open", refresh);
});
</script>

<style>
html, body { background: transparent !important; }
</style>

<style scoped>
.stage { height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 16px; }
.menu {
  width: 520px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius-window);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}
.search { display: flex; align-items: center; gap: 12px; height: 52px; padding: 0 16px; border-bottom: 1px solid var(--divider); flex-shrink: 0; }
.search input { flex: 1; height: 32px; border: 0; background: transparent; font-size: 16px; outline: none; }
.shortcut { font-size: 12px; color: var(--muted); }
.list { display: flex; flex-direction: column; gap: 2px; padding: 6px; overflow-y: auto; }
.item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px 12px 8px 16px;
  border: 0;
  border-radius: var(--radius-control);
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.item.selected { background: var(--selected); }
.bar { position: absolute; left: 0; top: 14px; width: 3px; height: 16px; border-radius: 2px; background: var(--accent); }
.name { font-weight: 600; display: flex; align-items: center; gap: 8px; }
.badge { font-size: 11px; font-weight: 400; padding: 1px 6px; border-radius: 8px; background: var(--accent); color: var(--on-accent); }
.preview { font-size: 12px; color: var(--muted); }
.empty { margin: 12px; font-size: 13px; color: var(--muted); display: flex; flex-direction: column; gap: 6px; }
.footer { display: flex; align-items: center; gap: 16px; height: 40px; padding: 0 16px; border-top: 1px solid var(--divider); background: var(--footer); font-size: 12px; color: var(--muted); flex-shrink: 0; }
.grow { flex: 1; }
.sr-only { position: absolute; left: -9999px; }
</style>
