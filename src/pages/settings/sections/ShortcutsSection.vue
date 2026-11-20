<template>
  <p class="intro">{{ t("settings.shortcuts.intro") }}</p>
  <SettingRow
    v-for="action in SHORTCUT_ACTIONS"
    :key="action"
    :label="t(`settings.shortcuts.${action}`)"
    :description="t(`settings.shortcuts.${action}_desc`)"
    :error="errorFor(action)"
  >
    <ShortcutRecorder
      :model-value="view?.settings.shortcuts[action] ?? ''"
      :error="errorFor(action)"
      :label="t(`settings.shortcuts.${action}`)"
      @recording="onRecording"
      @hint="(h) => (hints[action] = h)"
      @update:model-value="(v) => change(action, v)"
    />
  </SettingRow>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import SettingRow from "../../../components/SettingRow.vue";
import ShortcutRecorder from "../../../components/ShortcutRecorder.vue";
import { api, SHORTCUT_ACTIONS, type ShortcutAction, type ShortcutProblem } from "../../../lib/api";
import { save, view } from "../store";

const { t } = useI18n();
const problems = reactive<Partial<Record<ShortcutAction, ShortcutProblem>>>({});
const hints = reactive<Partial<Record<ShortcutAction, string | null>>>({});

function errorFor(action: ShortcutAction): string | undefined {
  const hint = hints[action];
  if (hint) return hint;
  const p = problems[action];
  if (p?.kind === "duplicate") return t("settings.shortcuts.duplicate", { other: t(`settings.shortcuts.${p.other}`) });
  if (p?.kind === "invalid") return t("settings.shortcuts.invalid");
  if (p?.kind === "taken" || view.value?.shortcutFailures.includes(action)) return t("settings.shortcuts.taken");
  return undefined;
}

async function onRecording(active: boolean) {
  if (active) await api.pauseShortcuts();
  else await api.resumeShortcuts();
}

async function change(action: ShortcutAction, accel: string) {
  delete problems[action];
  const err = await save((s) => (s.shortcuts[action] = accel));
  if (err?.kind === "shortcuts") {
    for (const p of err.problems) problems[p.action] = p;
  }
}
</script>

<style scoped>
.intro { margin: 0 0 12px; font-size: 12px; color: var(--muted); }
</style>
