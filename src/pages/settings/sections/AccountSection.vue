<template>
  <SettingRow :label="t('settings.account.title')" :description="t('settings.account.desc')">
    <button class="button accent" @click="api.loginWithBrowser()">{{ t("settings.account.login_browser") }}</button>
  </SettingRow>
  <SettingRow :label="t('settings.account.reset')" :description="t('settings.account.reset_desc')">
    <button class="button" @click="api.resetSession()">{{ t("settings.account.reset") }}</button>
  </SettingRow>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import SettingRow from "../../../components/SettingRow.vue";
import { api } from "../../../lib/api";

const { t } = useI18n();
</script>
