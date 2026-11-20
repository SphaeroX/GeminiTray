<template>
  <span class="state">{{ modelValue ? t("common.on") : t("common.off") }}</span>
  <button
    type="button"
    role="switch"
    class="switch"
    :class="{ on: modelValue }"
    :aria-checked="modelValue"
    :aria-labelledby="labelledby"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="knob"></span>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
defineProps<{ modelValue: boolean; labelledby?: string }>();
defineEmits<{ "update:modelValue": [value: boolean] }>();
const { t } = useI18n();
</script>

<style scoped>
.state { font-size: 13px; min-width: 24px; text-align: right; }
.switch {
  position: relative;
  width: 40px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid var(--muted);
  background: transparent;
  padding: 0;
  cursor: pointer;
}
.knob {
  position: absolute;
  left: 4px;
  top: 3px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background: var(--muted);
  transition: left 0.12s ease;
}
.switch.on { background: var(--accent); border-color: var(--accent); }
.switch.on .knob { left: 23px; background: var(--on-accent); }
</style>
