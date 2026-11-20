<template>
  <div class="model card">
    <div class="head">
      <div class="text">
        <span>{{ t("settings.voice.model_title") }}</span>
        <span class="desc">{{ t("settings.voice.model_desc") }}</span>
      </div>
      <button v-if="status?.downloading" class="button" @click="api.modelCancel()">{{ t("common.cancel") }}</button>
      <button v-else-if="status && !status.installed" class="button accent" @click="api.modelDownload()">
        {{ status.error ? t("settings.voice.retry") : t("settings.voice.download") }}
      </button>
    </div>
    <div v-if="status?.downloading" class="progress-wrap">
      <div
        class="track"
        role="progressbar"
        :aria-label="t('settings.voice.model_title')"
        :aria-valuenow="percent"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="bar" :style="{ width: `${percent}%` }"></div>
      </div>
      <span class="desc">{{ t("settings.voice.model_downloading", { done: mb(status.downloaded), total: mb(status.total), percent }) }}</span>
    </div>
    <span v-else-if="status?.error" class="desc error">{{ status.error }}</span>
    <span v-else-if="status" class="desc">
      {{ status.installed ? t("settings.voice.model_installed", { size: mb(status.total) }) : t("settings.voice.model_not_installed", { size: mb(status.total) }) }}
    </span>
  </div>

  <SettingRow v-if="s" :label="t('settings.voice.microphone')" :description="t('settings.voice.microphone_desc')" for-id="mic">
    <select
      id="mic"
      class="select wide"
      :value="s.voice.microphone ?? ''"
      @change="(e) => save((x) => (x.voice.microphone = (e.target as HTMLSelectElement).value || null))"
    >
      <option value="">{{ t("settings.voice.microphone_default") }}</option>
      <option v-for="m in microphones" :key="m" :value="m">{{ m }}</option>
    </select>
  </SettingRow>

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
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import SettingRow from "../../../components/SettingRow.vue";
import ToggleSwitch from "../../../components/ToggleSwitch.vue";
import { api, type ModelStatus } from "../../../lib/api";
import { onEvent } from "../../../lib/events";
import { save, view } from "../store";

const { t } = useI18n();
const s = computed(() => view.value?.settings);
const status = ref<ModelStatus | null>(null);
const microphones = ref<string[]>([]);
const percent = computed(() =>
  status.value && status.value.total > 0 ? Math.floor((status.value.downloaded / status.value.total) * 100) : 0,
);
const mb = (bytes: number) => Math.round(bytes / 1_000_000);

let unlisten: (() => void) | null = null;
onMounted(async () => {
  status.value = await api.modelStatus();
  microphones.value = await api.listMicrophones();
  unlisten = await onEvent<ModelStatus>("model-progress", (p) => (status.value = p));
});
onUnmounted(() => unlisten?.());
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
}
.head { display: flex; align-items: center; gap: 16px; }
.text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.desc { font-size: 12px; color: var(--muted); }
.desc.error { color: var(--danger); }
.select.wide { width: 240px; }
.progress-wrap { display: flex; flex-direction: column; gap: 6px; }
.track { height: 4px; border-radius: 2px; background: var(--track); overflow: hidden; }
.bar { height: 4px; border-radius: 2px; background: var(--accent); transition: width 0.2s ease; }
</style>
