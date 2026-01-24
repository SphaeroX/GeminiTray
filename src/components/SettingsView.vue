<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface AppSettings {
  opacity: number;
  globalShortcut: string;
  screenshotShortcut: string;
  openAtLogin: boolean;
  openAsHidden: boolean;
  alwaysOnTop: boolean;
  newChatShortcut: string;
}

const { t } = useI18n();
const emit = defineEmits<{
  (e: 'close'): void
}>();

const searchQuery = ref('');
const activeCategory = ref<string | null>('general'); // Default to general
const opacity = ref(0.95);
const globalShortcut = ref('');
const screenshotShortcut = ref('');
const openAtLogin = ref(false);
const openAsHidden = ref(true);
const alwaysOnTop = ref(false);
const isRecordingGlobal = ref(false);
const isRecordingScreenshot = ref(false);
const isRecordingNewChat = ref(false);
const newChatShortcut = ref('');


onMounted(async () => {
  const settings = await window.ipcRenderer.invoke('get-settings') as AppSettings | null;
  if (settings) {
    opacity.value = settings.opacity ?? 0.95;
    globalShortcut.value = settings.globalShortcut ?? '';
    screenshotShortcut.value = settings.screenshotShortcut ?? '';
    openAtLogin.value = settings.openAtLogin ?? false;
    openAsHidden.value = settings.openAsHidden ?? true;
    alwaysOnTop.value = settings.alwaysOnTop ?? false;
    newChatShortcut.value = settings.newChatShortcut ?? '';
  }
  
  // Listen for Alt+Space from main process (when blocked by globalShortcut)
  window.ipcRenderer.on('shortcut-recorded', (_event: unknown, ...args: unknown[]) => {
    const shortcut = args[0] as string;
    if (isRecordingGlobal.value) {
      globalShortcut.value = shortcut;
      saveShortcut();
    } else if (isRecordingScreenshot.value) {
      screenshotShortcut.value = shortcut;
      saveScreenshotShortcut();
    } else if (isRecordingNewChat.value) {
      newChatShortcut.value = shortcut;
      saveNewChatShortcut();
    }
  });
});

onUnmounted(() => {
  // Clean up listener and stop recording
  stopRecording();
});

const startRecording = () => {
  window.ipcRenderer.send('start-shortcut-recording');
};

const stopRecording = () => {
  window.ipcRenderer.send('stop-shortcut-recording');
  isRecordingGlobal.value = false;
  isRecordingScreenshot.value = false;
  isRecordingNewChat.value = false;
};

watch([openAtLogin, openAsHidden], ([newOpenAtLogin, newOpenAsHidden]) => {
  window.ipcRenderer.send('set-autostart', {
    openAtLogin: newOpenAtLogin,
    openAsHidden: newOpenAsHidden
  });
});

watch(opacity, (newVal) => {
  window.ipcRenderer.send('set-opacity', newVal);
});

watch(alwaysOnTop, (newVal) => {
  window.ipcRenderer.send('set-always-on-top', newVal);
});

const saveShortcut = async () => {
  if (globalShortcut.value) {
    const success = await window.ipcRenderer.invoke('set-global-shortcut', globalShortcut.value);
    if (!success) {
      console.error('Failed to set global shortcut');
    }
  }
};

const saveScreenshotShortcut = async () => {
  if (screenshotShortcut.value) {
    const success = await window.ipcRenderer.invoke('set-screenshot-shortcut', screenshotShortcut.value);
    if (!success) {
      console.error('Failed to set screenshot shortcut');
    }
  }
};

const saveNewChatShortcut = async () => {
  if (newChatShortcut.value) {
    const success = await window.ipcRenderer.invoke('set-new-chat-shortcut', newChatShortcut.value);
    if (!success) {
      console.error('Failed to set new chat shortcut');
    }
  }
};

const buildShortcutString = (e: KeyboardEvent): string | null => {
  // Ignore standalone modifier presses
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return null;

  const modifiers: string[] = [];
  if (e.ctrlKey) modifiers.push('Ctrl');
  if (e.metaKey) modifiers.push('Meta');
  if (e.altKey) modifiers.push('Alt');
  if (e.shiftKey) modifiers.push('Shift');

  let key = e.key;
  if (key === ' ') key = 'Space';
  if (key.length === 1) key = key.toUpperCase();
  if (key === 'ArrowUp') key = 'Up';
  if (key === 'ArrowDown') key = 'Down';
  if (key === 'ArrowLeft') key = 'Left';
  if (key === 'ArrowRight') key = 'Right';

  return [...modifiers, key].join('+');
};

const handleShortcutKeydown = (e: KeyboardEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  const shortcut = buildShortcutString(e);
  if (shortcut) {
    globalShortcut.value = shortcut;
    saveShortcut();
  }
  return false;
};

const handleGlobalShortcutFocus = () => {
  isRecordingGlobal.value = true;
  isRecordingScreenshot.value = false;
  isRecordingNewChat.value = false;
  startRecording();
};

const handleGlobalShortcutBlur = () => {
  isRecordingGlobal.value = false;
  if (!isRecordingScreenshot.value && !isRecordingNewChat.value) {
    stopRecording();
  }
};

const handleScreenshotShortcutKeydown = (e: KeyboardEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  const shortcut = buildShortcutString(e);
  if (shortcut) {
    screenshotShortcut.value = shortcut;
    saveScreenshotShortcut();
  }
  return false;
};

const handleScreenshotShortcutFocus = () => {
  isRecordingScreenshot.value = true;
  isRecordingGlobal.value = false;
  isRecordingNewChat.value = false;
  startRecording();
};

const handleScreenshotShortcutBlur = () => {
  isRecordingScreenshot.value = false;
  if (!isRecordingGlobal.value && !isRecordingNewChat.value) {
    stopRecording();
  }
};

const handleNewChatShortcutKeydown = (e: KeyboardEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  const shortcut = buildShortcutString(e);
  if (shortcut) {
    newChatShortcut.value = shortcut;
    saveNewChatShortcut();
  }
  return false;
};

const handleNewChatShortcutFocus = () => {
  isRecordingNewChat.value = true;
  isRecordingGlobal.value = false;
  isRecordingScreenshot.value = false;
  startRecording();
};

const handleNewChatShortcutBlur = () => {
  isRecordingNewChat.value = false;
  if (!isRecordingGlobal.value && !isRecordingScreenshot.value) {
    stopRecording();
  }
};

const categories = [
  { id: 'general', icon: '⚙️' },
  { id: 'shortcuts', icon: '⌨️' },
  { id: 'sound', icon: '🔊' },
  { id: 'feedback', icon: '💬' },
  { id: 'prompts', icon: '📝' },
  { id: 'screenshots', icon: '📸' }
];

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories;
  const query = searchQuery.value.toLowerCase();
  return categories.filter(cat => 
    t(`app.categories.${cat.id}`).toLowerCase().includes(query)
  );
});

const toggleCategory = (id: string) => {
  activeCategory.value = activeCategory.value === id ? null : id;
};
</script>

<template>
  <div class="settings-view">
    <div class="settings-header">
      <div class="header-top">
        <h2 class="settings-title">{{ t('app.settings') }}</h2>
        <button class="close-btn" @click="emit('close')" :title="t('app.close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="search-container">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="t('app.search_placeholder')" 
          class="search-input"
        />
      </div>
    </div>

    <div class="settings-content">
      <div 
        v-for="category in filteredCategories" 
        :key="category.id" 
        class="accordion-item"
        :class="{ 'is-active': activeCategory === category.id }"
      >
        <button class="accordion-header" @click="toggleCategory(category.id)">
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-title">{{ t(`app.categories.${category.id}`) }}</span>
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="accordion-content" v-show="activeCategory === category.id">
          <div class="content-padding">
            <div v-if="category.id === 'general'" class="setting-group">
              <div class="setting-item">
                <div class="setting-label">
                  <span>{{ t('app.transparency') }}</span>
                  <span class="setting-value">{{ Math.round((1 - opacity) * 100) }}%</span>
                </div>
                <input 
                  type="range" 
                  v-model.number="opacity" 
                  min="0.2" 
                  max="1" 
                  step="0.01"
                  class="slider"
                >
              </div>

              <div class="setting-item">
                 <label class="checkbox-container">
                    <input type="checkbox" v-model="openAtLogin">
                    <span class="checkmark"></span>
                    <span class="checkbox-label">{{ t('app.autostart') }}</span>
                 </label>
              </div>

              <div class="setting-item">
                 <label class="checkbox-container" :class="{ 'disabled': !openAtLogin }">
                    <input type="checkbox" v-model="openAsHidden" :disabled="!openAtLogin">
                    <span class="checkmark"></span>
                    <span class="checkbox-label">{{ t('app.start_minimized') }}</span>
                 </label>
              </div>

              <div class="setting-item">
                 <label class="checkbox-container">
                    <input type="checkbox" v-model="alwaysOnTop">
                    <span class="checkmark"></span>
                    <span class="checkbox-label">{{ t('app.always_on_top') }}</span>
                 </label>
                 <p class="setting-description">{{ t('app.always_on_top_desc') }}</p>
              </div>
            </div>

            <div v-else-if="category.id === 'shortcuts'" class="setting-group">
              <div class="setting-item">
                <div class="setting-label">
                  <span>{{ t('app.toggle_visibility') }}</span>
                </div>
                <input 
                  type="text" 
                  :value="globalShortcut"
                  @keydown.prevent="handleShortcutKeydown"
                  @focus="handleGlobalShortcutFocus"
                  @blur="handleGlobalShortcutBlur"
                  :placeholder="t('app.shortcut_placeholder')"
                  class="shortcut-input"
                  readonly
                >
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>{{ t('app.screenshot_shortcut') }}</span>
                </div>
                <p class="setting-description">{{ t('app.screenshot_shortcut_desc') }}</p>
                <input 
                  type="text" 
                  :value="screenshotShortcut"
                  @keydown.prevent="handleScreenshotShortcutKeydown"
                  @focus="handleScreenshotShortcutFocus"
                  @blur="handleScreenshotShortcutBlur"
                  :placeholder="t('app.shortcut_placeholder')"
                  class="shortcut-input"
                  readonly
                >
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>{{ t('app.new_chat_shortcut') }}</span>
                </div>
                <p class="setting-description">{{ t('app.new_chat_shortcut_desc') }}</p>
                <input 
                  type="text" 
                  :value="newChatShortcut"
                  @keydown.prevent="handleNewChatShortcutKeydown"
                  @focus="handleNewChatShortcutFocus"
                  @blur="handleNewChatShortcutBlur"
                  :placeholder="t('app.shortcut_placeholder')"
                  class="shortcut-input"
                  readonly
                >
              </div>
            </div>

            <div v-else-if="category.id === 'screenshots'" class="setting-group">
              <p class="setting-description">{{ t('app.screenshot_shortcut_desc') }}</p>
              <div class="setting-item">
                <div class="setting-label">
                  <span>{{ t('app.screenshot_shortcut') }}</span>
                </div>
                <input 
                  type="text" 
                  :value="screenshotShortcut"
                  @keydown.prevent="handleScreenshotShortcutKeydown"
                  @focus="handleScreenshotShortcutFocus"
                  @blur="handleScreenshotShortcutBlur"
                  :placeholder="t('app.shortcut_placeholder')"
                  class="shortcut-input"
                  readonly
                >
              </div>
            </div>
            
            <p v-else class="placeholder-text">{{ t('app.no_settings_yet') }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="filteredCategories.length === 0" class="no-results">
        No settings found via "{{ searchQuery }}"
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(30, 30, 30, 0.95); /* High opacity dark background */
  backdrop-filter: blur(20px);
  color: #fff;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.settings-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.search-input {
  width: 100%;
  max-width: 300px; /* Limit the width */
  padding: 8px 10px 8px 36px; /* Slightly reduced padding */
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.4);
}

.settings-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.accordion-item {
  margin-bottom: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  transition: all 0.2s ease;
}

.accordion-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  text-align: left;
}

.category-icon {
  margin-right: 12px;
  font-size: 18px;
}

.category-title {
  flex-grow: 1;
  font-weight: 500;
  font-size: 15px;
}

.chevron {
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease;
}

.accordion-item.is-active .chevron {
  transform: rotate(180deg);
}

.accordion-content {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}

.content-padding {
  padding: 16px;
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  margin: 0;
  font-style: italic;
}

.no-results {
  padding: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

/* Custom Scrollbar */
.settings-content::-webkit-scrollbar {
  width: 6px;
}

.settings-content::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.settings-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Slider Styles */
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.setting-value {
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  transition: background 0.2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}
.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

/* Checkbox Styles */
.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  color: rgba(255, 255, 255, 0.9);
}

.checkbox-container.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  transition: all 0.2s;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: rgba(255, 255, 255, 0.2);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #fff;
  border-color: #fff;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #000;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

/* Shortcut Input Styles */
.shortcut-input {
  width: 100%;
  max-width: 200px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-family: monospace;
  text-align: center;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
}

.shortcut-input:focus {
  border-color: rgba(138, 180, 248, 0.6);
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0 2px rgba(138, 180, 248, 0.2);
}

.shortcut-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-family: inherit;
}

/* Setting Description */
.setting-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 4px 0 8px 0;
  line-height: 1.4;
}
</style>
