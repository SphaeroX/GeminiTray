<template>
  <div
    class="overlay"
    :class="{ ready: !!src }"
    @mousedown.left="down"
    @mousemove="move"
    @mouseup.left="up"
    @contextmenu.prevent="cancel"
  >
    <img v-if="src" :src="src" class="frozen" alt="" draggable="false" />
    <div v-if="!rect" class="dim"></div>
    <div v-if="rect" class="selection" :style="selectionStyle">
      <span class="handle tl"></span><span class="handle tr"></span><span class="handle bl"></span><span class="handle br"></span>
      <span class="size">{{ sizeLabel }}</span>
    </div>
    <div class="hint" role="status">
      <span>{{ t("overlay.hint") }}</span>
      <span class="keys">{{ t("overlay.keys") }}</span>
      <button class="icon" :aria-label="t('common.cancel')" @mousedown.stop @click="cancel">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "../../lib/api";
import { normalizeRect, selectionLabel, type Rect } from "../../lib/selection";

const { t } = useI18n();
const index = Number(new URLSearchParams(location.search).get("m") ?? 0);
const src = ref<string | null>(null);
const start = ref<{ x: number; y: number } | null>(null);
const current = ref<{ x: number; y: number } | null>(null);

const rect = computed<Rect | null>(() =>
  start.value && current.value ? normalizeRect(start.value, current.value) : null,
);
const selectionStyle = computed(() =>
  rect.value
    ? { left: `${rect.value.x}px`, top: `${rect.value.y}px`, width: `${rect.value.width}px`, height: `${rect.value.height}px` }
    : {},
);
const sizeLabel = computed(() => (rect.value ? selectionLabel(rect.value, window.devicePixelRatio) : ""));

function down(e: MouseEvent) {
  start.value = { x: e.clientX, y: e.clientY };
  current.value = { x: e.clientX, y: e.clientY };
}
function move(e: MouseEvent) {
  if (start.value) current.value = { x: e.clientX, y: e.clientY };
}
function up() {
  confirm();
}
function confirm() {
  const r = rect.value;
  start.value = null;
  if (!r || r.width < 3 || r.height < 3) {
    current.value = null;
    return;
  }
  api.overlaySelect(index, r);
}
function cancel() {
  api.overlayCancel();
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") cancel();
  if (e.key === "Enter") confirm();
}

onMounted(async () => {
  window.addEventListener("keydown", onKey);
  const img = await api.overlayImage(index);
  src.value = img.dataUrl;
});
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<style>
html, body { background: #000 !important; overflow: hidden; }
</style>

<style scoped>
.overlay { position: fixed; inset: 0; cursor: crosshair; user-select: none; }
.frozen { position: absolute; inset: 0; width: 100vw; height: 100vh; pointer-events: none; }
.dim { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.45); }
.selection {
  position: absolute;
  box-sizing: border-box;
  border: 2px solid var(--pill-accent);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.45);
}
.handle { position: absolute; width: 10px; height: 10px; background: #fff; border: 1px solid var(--pill-accent); }
.tl { left: -6px; top: -6px; } .tr { right: -6px; top: -6px; } .bl { left: -6px; bottom: -6px; } .br { right: -6px; bottom: -6px; }
.size {
  position: absolute;
  right: 0;
  bottom: -34px;
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 4px;
  background: var(--pill);
  color: #fff;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.hint {
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  height: 44px;
  padding: 0 8px 0 18px;
  border-radius: 22px;
  background: var(--pill);
  border: 1px solid var(--pill-border);
  color: #fff;
  cursor: default;
  white-space: nowrap;
}
.keys { font-size: 12px; color: #c8c8c8; }
.icon { width: 32px; height: 32px; border-radius: 16px; border: 0; background: rgba(255, 255, 255, 0.08); color: #fff; display: grid; place-items: center; cursor: pointer; }
</style>
