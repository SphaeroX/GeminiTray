<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import TitleBar from './components/TitleBar.vue'
import SettingsView from './components/SettingsView.vue'
import PromptsMenu from './components/PromptsMenu.vue'
import ToastNotification from './components/ToastNotification.vue'

const isSettingsOpen = ref(false)
const isPromptsMenuOpen = ref(false)
const prompts = ref<Array<{ id: string; name: string; content: string }>>([])

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

// Handle prompt selection by index (Alt+1 to Alt+9)
const handlePromptSelectByIndex = (index: number) => {
  if (prompts.value.length >= index) {
    const prompt = prompts.value[index - 1];
    handlePromptSelect(prompt);
  }
}

// Check if any overlay is open
const isOverlayOpen = computed(() => isSettingsOpen.value || isPromptsMenuOpen.value)

watch(isOverlayOpen, (isOpen) => {
  window.ipcRenderer.send('toggle-settings', isOpen)
})

const handleTogglePromptMenu = () => {
  togglePromptsMenu()
};

const handleSelectPromptByIndex = (_event: unknown, ...args: unknown[]) => {
  const index = args[0] as number;
  handlePromptSelectByIndex(index);
};

onMounted(async () => {
  // Load prompts
  const settings = await window.ipcRenderer.invoke('get-settings') as any;
  if (settings && settings.prompts) {
    prompts.value = settings.prompts;
  }

  window.ipcRenderer.on('toggle-prompt-menu', handleTogglePromptMenu);

  // Listen for prompt shortcut events (Alt+1 to Alt+9)
  window.ipcRenderer.on('select-prompt-by-index', handleSelectPromptByIndex);
})

onUnmounted(() => {
  window.ipcRenderer.off('toggle-prompt-menu', handleTogglePromptMenu);
  window.ipcRenderer.off('select-prompt-by-index', handleSelectPromptByIndex);
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
  background: #000000; /* Solid black */
  color: #ffffff;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #000000; /* Solid black */
}

.content-overlay {
  flex: 1;
  pointer-events: none; /* Let clicks pass through to BrowserView below where there is no UI */
  min-height: 0;
  overflow: hidden;
  position: relative;
  z-index: 10;
}
</style>
