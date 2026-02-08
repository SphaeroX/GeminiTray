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
  promptMenuShortcut: string;
  prompts: Prompt[];
  defaultModel: 'fast' | 'thinking' | 'pro';
}

interface Prompt {
  id: string;
  name: string;
  content: string;
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
const prompts = ref<Prompt[]>([]);
const newPromptName = ref('');
const newPromptContent = ref('');
const isEditing = ref(false);
const editingId = ref<string | null>(null);


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
    promptMenuShortcut.value = settings.promptMenuShortcut ?? '';
    prompts.value = settings.prompts ?? [];
    defaultModel.value = settings.defaultModel ?? 'fast';
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
    } else if (isRecordingPromptMenu.value) {
      promptMenuShortcut.value = shortcut;
      savePromptMenuShortcut();
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
  isRecordingPromptMenu.value = false;
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
  isRecordingPromptMenu.value = false;
  startRecording();
};

const handleGlobalShortcutBlur = () => {
  isRecordingGlobal.value = false;
  if (!isRecordingScreenshot.value && !isRecordingNewChat.value && !isRecordingPromptMenu.value) {
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
  isRecordingPromptMenu.value = false;
  startRecording();
};

const handleScreenshotShortcutBlur = () => {
  isRecordingScreenshot.value = false;
  if (!isRecordingGlobal.value && !isRecordingNewChat.value && !isRecordingPromptMenu.value) {
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
  if (!isRecordingGlobal.value && !isRecordingScreenshot.value && !isRecordingPromptMenu.value) {
    stopRecording();
  }
};

const isRecordingPromptMenu = ref(false);
const promptMenuShortcut = ref('');
const defaultModel = ref<'fast' | 'thinking' | 'pro'>('fast');

const savePromptMenuShortcut = async () => {
  if (promptMenuShortcut.value) {
    const success = await window.ipcRenderer.invoke('set-prompt-menu-shortcut', promptMenuShortcut.value);
    if (!success) {
      console.error('Failed to set prompt menu shortcut');
    }
  }
};

const handlePromptMenuShortcutKeydown = (e: KeyboardEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  const shortcut = buildShortcutString(e);
  if (shortcut) {
    promptMenuShortcut.value = shortcut;
    savePromptMenuShortcut();
  }
  return false;
};

const handlePromptMenuShortcutFocus = () => {
  isRecordingPromptMenu.value = true;
  isRecordingGlobal.value = false;
  isRecordingScreenshot.value = false;
  isRecordingNewChat.value = false;
  startRecording();
};

const handlePromptMenuShortcutBlur = () => {
  isRecordingPromptMenu.value = false;
  if (!isRecordingGlobal.value && !isRecordingScreenshot.value && !isRecordingNewChat.value) {
    stopRecording();
  }
};

const categories = [
  { id: 'general', icon: '⚙️' },
  { id: 'shortcuts', icon: '⌨️' },
  { id: 'sound', icon: '🔊' },
  { id: 'feedback', icon: '💬' },
  { id: 'prompts', icon: '📝' },
  { id: 'screenshots', icon: '📸' },
  { id: 'troubleshooting', icon: '🔧' }
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

const savePrompts = () => {
  window.ipcRenderer.send('save-prompts', JSON.parse(JSON.stringify(prompts.value)));
};

const addPrompt = () => {
  if (!newPromptName.value.trim() || !newPromptContent.value.trim()) return;
  
  prompts.value.push({
    id: Date.now().toString(),
    name: newPromptName.value.trim(),
    content: newPromptContent.value.trim()
  });
  
  newPromptName.value = '';
  newPromptContent.value = '';
  savePrompts();
};

const deletePrompt = (id: string) => {
  prompts.value = prompts.value.filter(p => p.id !== id);
  savePrompts();
};

const startEditing = (prompt: Prompt) => {
  newPromptName.value = prompt.name;
  newPromptContent.value = prompt.content;
  isEditing.value = true;
  editingId.value = prompt.id;
  // Switch to input view if not already there, effectively we reuse the 'add' section for editing
};

const updatePrompt = () => {
  if (!editingId.value || !newPromptName.value.trim() || !newPromptContent.value.trim()) return;

  const index = prompts.value.findIndex(p => p.id === editingId.value);
  if (index !== -1) {
    prompts.value[index] = {
      ...prompts.value[index],
      name: newPromptName.value.trim(),
      content: newPromptContent.value.trim()
    };
    savePrompts();
  }
  cancelEdit();
};

const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  newPromptName.value = '';
  newPromptContent.value = '';
};

const resetSession = async () => {
    if (confirm('Are you sure you want to reset the session? This will clear all cookies and restart the app interface.')) {
        await window.ipcRenderer.invoke('reset-session');
    }
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

               <div class="setting-item">
                 <div class="setting-label">
                   <span>{{ t('app.default_model') }}</span>
                 </div>
                 <p class="setting-description">{{ t('app.default_model_desc') }}</p>
                 <select v-model="defaultModel" @change="updateDefaultModel" class="model-select">
                   <option value="fast">{{ t('app.models.fast') }}</option>
                   <option value="thinking">{{ t('app.models.thinking') }}</option>
                   <option value="pro">{{ t('app.models.pro') }}</option>
                 </select>
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
              <div class="setting-item">
                <div class="setting-label">
                  <span>{{ t('app.prompts_menu_shortcut') || 'Prompt Menu Shortcut' }}</span>
                </div>
                <p class="setting-description">{{ t('app.prompts_menu_shortcut_desc') || 'Shortcut to open the prompts menu' }}</p>
                <input 
                  type="text" 
                  :value="promptMenuShortcut"
                  @keydown.prevent="handlePromptMenuShortcutKeydown"
                  @focus="handlePromptMenuShortcutFocus"
                  @blur="handlePromptMenuShortcutBlur"
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
            
            <div v-else-if="category.id === 'prompts'" class="setting-group">
                <div v-if="prompts.length > 0" class="prompts-list">
                <div v-for="prompt in prompts" :key="prompt.id" class="prompt-item">
                    <div class="prompt-header">
                    <span class="prompt-name">{{ prompt.name }}</span>
                    <div class="prompt-actions">
                        <button @click="startEditing(prompt)" class="icon-btn edit-btn" :title="t('app.edit') || 'Edit'">
                        ✏️
                        </button>
                        <button @click="deletePrompt(prompt.id)" class="icon-btn delete-btn" :title="t('app.delete') || 'Delete'">
                        🗑️
                        </button>
                    </div>
                    </div>
                    <div class="prompt-preview">{{ prompt.content }}</div>
                </div>
                </div>
                <p v-else class="placeholder-text">{{ t('app.no_prompts_yet') || 'No prompts saved yet.' }}</p>

                <div class="add-prompt-form">
                <h3 class="form-title">{{ isEditing ? (t('app.edit_prompt') || 'Edit Prompt') : (t('app.add_new_prompt') || 'Add New Prompt') }}</h3>
                <input 
                    v-model="newPromptName" 
                    class="text-input" 
                    :placeholder="t('app.prompt_name_placeholder') || 'Prompt Name'"
                >
                <textarea 
                    v-model="newPromptContent" 
                    class="text-area" 
                    :placeholder="t('app.prompt_content_placeholder') || 'Prompt Content'"
                    rows="3"
                ></textarea>
                <div class="form-actions">
                    <button v-if="isEditing" @click="cancelEdit" class="secondary-btn">
                    {{ t('app.cancel') || 'Cancel' }}
                    </button>
                    <button 
                    @click="isEditing ? updatePrompt() : addPrompt()" 
                    class="primary-btn"
                    :disabled="!newPromptName.trim() || !newPromptContent.trim()"
                    >
                    {{ isEditing ? (t('app.save') || 'Save') : (t('app.add') || 'Add') }}
                    </button>
                </div>
                </div>
            </div>
            
            <div v-else-if="category.id === 'troubleshooting'" class="setting-group">
               <div class="setting-item">
                 <div class="setting-label">
                   <span>{{ t('app.troubleshooting.reset_session') }}</span>
                 </div>
                 <p class="setting-description">{{ t('app.troubleshooting.reset_session_desc') }}</p>
                 <button @click="resetSession" class="danger-btn">
                   {{ t('app.troubleshooting.reset_btn') }}
                 </button>
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
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(30, 30, 30, 0.95); /* High opacity dark background */
  backdrop-filter: blur(20px);
  color: #fff;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
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
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  min-height: 0;
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

.danger-btn {
  background: rgba(255, 59, 48, 0.2);
  color: #ff453a;
  border: 1px solid rgba(255, 59, 48, 0.3);
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  margin-top: 8px;
}

.danger-btn:hover {
  background: rgba(255, 59, 48, 0.3);
  border-color: rgba(255, 59, 48, 0.5);
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

/* Prompts Styles */
.prompts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.prompt-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s;
}

.prompt-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.prompt-name {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.prompt-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.7;
  transition: all 0.2s;
  font-size: 14px;
}

.icon-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.delete-btn:hover {
  background: rgba(255, 80, 80, 0.2);
}

.prompt-preview {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.add-prompt-form {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.form-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #fff;
}

.text-input, .text-area {
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  margin-bottom: 12px;
}

.text-input:focus, .text-area:focus {
  border-color: rgba(138, 180, 248, 0.6);
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0 2px rgba(138, 180, 248, 0.2);
}

.text-area {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.primary-btn, .secondary-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
}

.primary-btn {
  background: #fff;
  color: #000;
}

.primary-btn:hover:not(:disabled) {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.add-prompt-form {
  margin-top: 16px;
}
</style>
