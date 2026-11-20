<template>
  <button
    type="button"
    class="recorder"
    :class="{ recording, error: !!error }"
    :aria-label="label"
    @click="start"
    @keydown="onKey"
    @blur="stop(false)"
  >
    {{ recording ? t("settings.shortcuts.press_keys") : shown }}
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { displayAccelerator, recordKey } from "../lib/accelerator";

const props = defineProps<{ modelValue: string; error?: string; label: string }>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
  recording: [active: boolean];
  hint: [message: string | null];
}>();
const { t, locale } = useI18n();
const recording = ref(false);

const shown = computed(() =>
  props.modelValue ? displayAccelerator(props.modelValue, locale.value as "de" | "en") : t("settings.shortcuts.none"),
);

function start() {
  if (recording.value) return;
  recording.value = true;
  emit("hint", null);
  emit("recording", true);
}

function stop(_committed: boolean) {
  if (!recording.value) return;
  recording.value = false;
  emit("recording", false);
}

function onKey(e: KeyboardEvent) {
  if (!recording.value) return;
  e.preventDefault();
  e.stopPropagation();
  const r = recordKey(e);
  switch (r.kind) {
    case "pending":
      return;
    case "cancel":
      stop(false);
      return;
    case "clear":
      stop(true);
      emit("update:modelValue", "");
      return;
    case "needsModifier":
      emit("hint", t("settings.shortcuts.needs_modifier"));
      return;
    case "done":
      stop(true);
      emit("update:modelValue", r.accelerator);
  }
}
</script>

<style scoped>
.recorder {
  min-width: 140px;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-control);
  border: 1px solid var(--control-border);
  background: var(--control);
  font-size: 13px;
  cursor: pointer;
}
.recorder:hover { background: var(--control-hover); }
.recorder.recording { border: 2px solid var(--accent); color: var(--accent); }
.recorder.error { border-color: var(--danger); }
</style>
