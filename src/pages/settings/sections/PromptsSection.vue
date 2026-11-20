<template>
  <p class="intro">{{ t("settings.prompts.intro") }}</p>

  <div v-for="(p, i) in list" :key="p.id" class="card">
    <template v-if="editing === p.id">
      <label :for="`name-${p.id}`" class="field-label">{{ t("settings.prompts.name") }}</label>
      <input :id="`name-${p.id}`" v-model="draft.name" class="input" :placeholder="t('settings.prompts.name_placeholder')" />
      <label :for="`content-${p.id}`" class="field-label">{{ t("settings.prompts.content") }}</label>
      <textarea
        :id="`content-${p.id}`"
        v-model="draft.content"
        class="input area"
        rows="4"
        :placeholder="t('settings.prompts.content_placeholder')"
      ></textarea>
      <div class="actions">
        <button class="button" @click="cancelEdit(p.id)">{{ t("common.cancel") }}</button>
        <button class="button accent" :disabled="!draft.name.trim() || !draft.content.trim()" @click="commit(p.id)">
          {{ t("common.save") }}
        </button>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <div class="text">
          <span class="name">{{ p.name }}</span>
          <span class="desc">{{ previewContent(p.content, 90) }}</span>
        </div>
        <button class="icon-btn" :aria-label="t('settings.prompts.up')" :disabled="i === 0" @click="move(i, -1)">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 8l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
        </button>
        <button class="icon-btn" :aria-label="t('settings.prompts.down')" :disabled="i === list.length - 1" @click="move(i, 1)">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
        </button>
        <button class="button" @click="startEdit(p)">{{ t("settings.prompts.edit") }}</button>
        <button class="button" @click="remove(p.id)">{{ t("settings.prompts.delete") }}</button>
      </div>
    </template>
  </div>

  <p v-if="list.length === 0" class="empty">{{ t("settings.prompts.empty") }}</p>
  <div><button class="button accent add" @click="add">{{ t("settings.prompts.add") }}</button></div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { Prompt } from "../../../lib/api";
import { moveItem, newId, previewContent } from "../../../lib/prompts";
import { save, view } from "../store";

const { t } = useI18n();
const list = computed<Prompt[]>(() => {
  const saved = view.value?.settings.prompts ?? [];
  return pendingNew.value && !saved.some((p) => p.id === pendingNew.value!.id) ? [...saved, pendingNew.value] : saved;
});
const editing = ref<string | null>(null);
const draft = reactive({ name: "", content: "" });
const pendingNew = ref<Prompt | null>(null);

async function startEdit(p: Prompt) {
  editing.value = p.id;
  draft.name = p.name;
  draft.content = p.content;
  await nextTick();
  const input = document.getElementById(`name-${p.id}`) as HTMLInputElement | null;
  input?.scrollIntoView({ block: "nearest" });
  input?.focus();
}

function add() {
  const p = { id: newId(), name: "", content: "" };
  pendingNew.value = p;
  startEdit(p);
}

function cancelEdit(id: string) {
  if (pendingNew.value?.id === id) pendingNew.value = null;
  editing.value = null;
}

async function commit(id: string) {
  const updated = { id, name: draft.name.trim(), content: draft.content.trim() };
  await save((s) => {
    const idx = s.prompts.findIndex((p) => p.id === id);
    if (idx >= 0) s.prompts[idx] = updated;
    else s.prompts.push(updated);
  });
  pendingNew.value = null;
  editing.value = null;
}

async function remove(id: string) {
  await save((s) => (s.prompts = s.prompts.filter((p) => p.id !== id)));
}

async function move(index: number, delta: number) {
  await save((s) => (s.prompts = moveItem(s.prompts, index, delta)));
}
</script>

<style scoped>
.intro { margin: 0 0 12px; font-size: 12px; color: var(--muted); }
.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
}
.row { display: flex; align-items: center; gap: 8px; min-height: 40px; }
.text { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.name { font-size: 14px; }
.desc { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.field-label { font-size: 12px; color: var(--muted); }
.input {
  width: 100%;
  padding: 6px 10px;
  border-radius: var(--radius-control);
  border: 1px solid var(--control-border);
  border-bottom: 2px solid var(--accent);
  background: var(--control);
  font-size: 14px;
  user-select: text;
}
.area { resize: vertical; min-height: 80px; font-family: var(--font); }
.actions { display: flex; justify-content: flex-end; gap: 8px; }
.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-control);
  border: 1px solid var(--control-border);
  background: var(--control);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.icon-btn:disabled { opacity: 0.4; cursor: default; }
.empty { font-size: 13px; color: var(--muted); }
.add { margin-top: 8px; }
.button:disabled { opacity: 0.5; cursor: default; }
</style>
