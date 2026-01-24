<script setup lang="ts">
const emit = defineEmits<{
  (e: 'toggle-settings'): void
}>()
</script>

<template>
  <div class="title-bar">
    <div class="title-drag-region">
      <span class="app-title">{{ $t('app.title') }}</span>
    </div>
    
    <div class="window-controls-spacer">
      <!-- The native window controls (min/max/close) will appear here in the overlay -->
    </div>

    <button class="settings-btn" :title="$t('app.settings')" @click="emit('toggle-settings')">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px; /* Must match main.ts titleBarOverlay height */
  background: rgba(0, 0, 0, 0.4); /* Semi-transparent dark background */
  backdrop-filter: blur(10px);
  color: white;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: 10px;
  /* Make space for window controls on the right (approx 140px on Windows) */
  padding-right: 140px; 
}

.title-drag-region {
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  flex-grow: 1;
  height: 100%;
}

.app-icon img {
  height: 20px;
  margin-right: 10px;
}

.app-title {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.settings-btn {
  -webkit-app-region: no-drag;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-right: 8px; /* Spacing from window controls area */
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
</style>
