<template>
  <template v-if="s">
    <SettingRow :label="t('settings.general.autostart')" :description="t('settings.general.autostart_desc')" label-id="lbl-autostart">
      <ToggleSwitch :model-value="s.autostart" labelledby="lbl-autostart" @update:model-value="(v) => save((x) => (x.autostart = v))" />
    </SettingRow>
    <SettingRow
      :label="t('settings.general.start_minimized')"
      :description="t('settings.general.start_minimized_desc')"
      label-id="lbl-minimized"
    >
      <ToggleSwitch
        :model-value="s.startMinimized"
        labelledby="lbl-minimized"
        @update:model-value="(v) => save((x) => (x.startMinimized = v))"
      />
    </SettingRow>
    <SettingRow :label="t('settings.general.language')" :description="t('settings.general.language_desc')" for-id="language">
      <select
        id="language"
        class="select"
        :value="s.language"
        @change="(e) => save((x) => (x.language = (e.target as HTMLSelectElement).value as Settings['language']))"
      >
        <option value="system">{{ t("settings.general.language_system") }}</option>
        <option value="de">{{ t("settings.general.language_de") }}</option>
        <option value="en">{{ t("settings.general.language_en") }}</option>
      </select>
    </SettingRow>
    <p class="version">{{ t("settings.general.version", { version: view?.version }) }}</p>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import SettingRow from "../../../components/SettingRow.vue";
import ToggleSwitch from "../../../components/ToggleSwitch.vue";
import type { Settings } from "../../../lib/api";
import { save, view } from "../store";

const { t } = useI18n();
const s = computed(() => view.value?.settings);
</script>

<style scoped>
.version { margin: 16px 0 0; font-size: 12px; color: var(--muted); }
</style>
