<template>
  <p class="intro">{{ t("settings.voice.intro") }}</p>

  <SettingRow v-if="s" :label="t('settings.voice.auto_send')" :description="t('settings.voice.auto_send_desc')" label-id="lbl-autosend">
    <ToggleSwitch
      :model-value="s.voice.autoSend"
      labelledby="lbl-autosend"
      @update:model-value="(v) => save((x) => (x.voice.autoSend = v))"
    />
  </SettingRow>

  <SettingRow v-if="s" :label="t('settings.voice.max_minutes')" :description="t('settings.voice.max_minutes_desc')" for-id="maxlen">
    <select
      id="maxlen"
      class="select"
      :value="s.voice.maxMinutes"
      @change="(e) => save((x) => (x.voice.maxMinutes = Number((e.target as HTMLSelectElement).value)))"
    >
      <option v-for="n in [1, 2, 5, 10, 15, 30]" :key="n" :value="n">{{ t("settings.voice.minutes", { n }) }}</option>
    </select>
  </SettingRow>

  <SettingRow :label="t('settings.voice.privacy')" :description="t('settings.voice.privacy_desc')">
    <button class="button" @click="api.openMicPrivacy()">{{ t("settings.voice.privacy_open") }}</button>
  </SettingRow>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import SettingRow from "../../../components/SettingRow.vue";
import ToggleSwitch from "../../../components/ToggleSwitch.vue";
import { api } from "../../../lib/api";
import { save, view } from "../store";

const { t } = useI18n();
const s = computed(() => view.value?.settings);
</script>

<style scoped>
.intro { margin: 0 0 12px; font-size: 12px; color: var(--muted); }
</style>
