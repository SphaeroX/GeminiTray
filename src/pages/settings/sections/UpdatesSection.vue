<template>
  <SettingRow :label="t('settings.updates.current', { version: view?.version ?? '' })" :description="message">
    <button v-if="status.state === 'available'" class="button accent" @click="install">{{ t("settings.updates.install") }}</button>
    <button
      v-else-if="status.state !== 'disabled'"
      class="button"
      :disabled="status.state === 'checking' || status.state === 'downloading'"
      @click="check"
    >
      {{ t("settings.updates.check") }}
    </button>
  </SettingRow>
  <div v-if="status.state === 'downloading'" class="track" role="progressbar" :aria-valuenow="status.percent" aria-valuemin="0" aria-valuemax="100">
    <div class="bar" :style="{ width: `${status.percent}%` }"></div>
  </div>
  <p class="note">
    <a href="https://github.com/SphaeroX/GeminiTray/releases" @click.prevent="api.openReleases()">{{ t("settings.updates.releases") }}</a>
  </p>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import SettingRow from "../../../components/SettingRow.vue";
import { api, type UpdateStatus } from "../../../lib/api";
import { onEvent } from "../../../lib/events";
import { view } from "../store";

const { t } = useI18n();
const status = ref<UpdateStatus>({ state: "idle" });

const message = computed(() => {
  const s = status.value;
  switch (s.state) {
    case "disabled":
      return t("settings.updates.disabled");
    case "checking":
      return t("settings.updates.checking");
    case "upToDate":
      return t("settings.updates.up_to_date");
    case "available":
      return t("settings.updates.available", { version: s.version });
    case "downloading":
      return t("settings.updates.downloading", { percent: s.percent });
    case "error":
      return t("settings.updates.error", { message: s.message });
    default:
      return t("settings.updates.idle");
  }
});

async function check() {
  status.value = { state: "checking" };
  status.value = await api.updateCheck();
}

async function install() {
  try {
    await api.updateInstall();
  } catch (e) {
    status.value = { state: "error", message: String(e) };
  }
}

let unlisten: (() => void) | null = null;
onMounted(async () => {
  status.value = await api.updateStatus();
  unlisten = await onEvent<UpdateStatus>("update-status", (s) => (status.value = s));
});
onUnmounted(() => unlisten?.());
</script>

<style scoped>
.track { height: 4px; border-radius: 2px; background: var(--track); overflow: hidden; margin: 4px 0; }
.bar { height: 4px; background: var(--accent); transition: width 0.2s ease; }
.note { margin: 12px 0 0; font-size: 12px; }
.button:disabled { opacity: 0.5; cursor: default; }
</style>
