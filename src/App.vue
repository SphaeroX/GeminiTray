<script setup lang="ts">
import { ref, watch } from 'vue'
import TitleBar from './components/TitleBar.vue'
import SettingsView from './components/SettingsView.vue'
import ToastNotification from './components/ToastNotification.vue'

const isSettingsOpen = ref(false)

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

watch(isSettingsOpen, (isOpen) => {
  window.ipcRenderer.send('toggle-settings', isOpen)
})
</script>

<template>
  <div class="app-container">
    <TitleBar @toggle-settings="toggleSettings" />
    <div class="content-overlay">
      <SettingsView v-if="isSettingsOpen" style="pointer-events: auto;" @close="toggleSettings" />
    </div>
    <ToastNotification />
  </div>
</template>

<style>
/* Global reset for this app container */
body {
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevent scrolling in the main UI frame */
  background: transparent;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: transparent; /* Allow transparency */
}

.content-overlay {
  flex-grow: 1;
  pointer-events: none; /* Let clicks pass through to BrowserView below where there is no UI */
}

/* If we had a settings panel, we would re-enable pointer-events on it */
</style>
