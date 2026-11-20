<template>
  <template v-if="s">
    <SettingRow :label="t('settings.window.opacity')" :description="t('settings.window.opacity_desc')" for-id="opacity">
      <input
        id="opacity"
        type="range"
        class="slider"
        min="50"
        max="100"
        step="5"
        :value="Math.round(s.window.opacity * 100)"
        @change="(e) => save((x) => (x.window.opacity = Number((e.target as HTMLInputElement).value) / 100))"
      />
      <span class="value">{{ Math.round(s.window.opacity * 100) }} %</span>
    </SettingRow>
    <SettingRow :label="t('settings.window.always_on_top')" :description="t('settings.window.always_on_top_desc')" label-id="lbl-top">
      <ToggleSwitch
        :model-value="s.window.alwaysOnTop"
        labelledby="lbl-top"
        @update:model-value="(v) => save((x) => (x.window.alwaysOnTop = v))"
      />
    </SettingRow>
    <p class="note">{{ t("settings.window.position") }}</p>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import SettingRow from "../../../components/SettingRow.vue";
import ToggleSwitch from "../../../components/ToggleSwitch.vue";
import { save, view } from "../store";

const { t } = useI18n();
const s = computed(() => view.value?.settings);
</script>

<style scoped>
.slider { width: 180px; accent-color: var(--accent); }
.value { min-width: 44px; text-align: right; font-size: 13px; font-variant-numeric: tabular-nums; }
.note { margin: 12px 0 0; font-size: 12px; color: var(--muted); }
</style>
