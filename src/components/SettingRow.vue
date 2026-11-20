<template>
  <div class="row" :class="{ stacked }">
    <div class="text">
      <label v-if="forId" :for="forId" class="label">{{ label }}</label>
      <span v-else :id="labelId" class="label">{{ label }}</span>
      <span v-if="description" class="desc" :class="{ error: !!error }">{{ error || description }}</span>
      <span v-else-if="error" class="desc error">{{ error }}</span>
    </div>
    <div class="control"><slot /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  description?: string;
  error?: string;
  forId?: string;
  labelId?: string;
  stacked?: boolean;
}>();
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 64px;
  padding: 10px 16px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
}
.row.stacked { flex-direction: column; align-items: stretch; }
.text { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.label { font-size: 14px; }
.desc { font-size: 12px; color: var(--muted); }
.desc.error { color: var(--danger); }
.control { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
</style>
