<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import TitleBar from './components/TitleBar.vue'
import SettingsView from './components/SettingsView.vue'
import PromptsMenu from './components/PromptsMenu.vue'
import ToastNotification from './components/ToastNotification.vue'

const isSettingsOpen = ref(false)
const isPromptsMenuOpen = ref(false)

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
  if (isSettingsOpen.value) isPromptsMenuOpen.value = false
}

const togglePromptsMenu = () => {
  isPromptsMenuOpen.value = !isPromptsMenuOpen.value
  if (isPromptsMenuOpen.value) isSettingsOpen.value = false
}

const handlePromptSelect = (prompt: any) => {
  console.log('[App] handlePromptSelect called with:', prompt);
  // alert('Debug: App received prompt');
  // Ensure we send a plain object to IPC
  window.ipcRenderer.send('set-active-prompt', JSON.parse(JSON.stringify(prompt)))
  togglePromptsMenu()
}

// Check if any overlay is open
const isOverlayOpen = computed(() => isSettingsOpen.value || isPromptsMenuOpen.value)

watch(isOverlayOpen, (isOpen) => {
  window.ipcRenderer.send('toggle-settings', isOpen)
})

onMounted(() => {
  window.ipcRenderer.on('toggle-prompt-menu', () => {
    togglePromptsMenu()
  })
})
</script>

<template>
  <div class="app-container">
    <TitleBar @toggle-settings="toggleSettings" />
    <div class="content-overlay">
      <SettingsView v-if="isSettingsOpen" style="pointer-events: auto;" @close="toggleSettings" />
      <PromptsMenu 
        v-if="isPromptsMenuOpen" 
        style="pointer-events: auto;" 
        @close="togglePromptsMenu" 
        @select="handlePromptSelect" 
      />
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
