<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', prompt: any): void;
}>();

const prompts = ref<Array<{ id: string; name: string; content: string }>>([]);
const selectedIndex = ref(0);
const search = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

const filteredPrompts = computed(() => {
  if (!search.value) return prompts.value;
  const lower = search.value.toLowerCase();
  return prompts.value.filter(p => 
    p.name.toLowerCase().includes(lower) || 
    p.content.toLowerCase().includes(lower)
  );
});

onMounted(async () => {
  const settings = await window.ipcRenderer.invoke('get-settings') as any;
  if (settings && settings.prompts) {
    prompts.value = settings.prompts;
  }
  
  nextTick(() => {
    if (searchInput.value) searchInput.value.focus();
  });

  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const handleKeydown = (e: KeyboardEvent) => {
  console.log('[PromptsMenu] Keydown:', e.key);
  if (e.key === 'Escape') {
    emit('close');
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % filteredPrompts.value.length;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value - 1 + filteredPrompts.value.length) % filteredPrompts.value.length;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    selectPrompt(filteredPrompts.value[selectedIndex.value]);
  }
};

const selectPrompt = (prompt: any) => {
  if (prompt) {
    // Unwrapping the proxy to ensure a plain object is emitted
    const plainPrompt = JSON.parse(JSON.stringify(prompt));
    emit('select', plainPrompt);
    // emit('close'); // Removed to avoid double-toggling in parent
  }
};

const truncateText = (text: string, maxLength: number = 60) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

</script>

<template>
  <div class="prompts-menu-overlay" @click.self="emit('close')">
    <div class="prompts-menu">
      <div class="menu-header">
        <div class="header-row">
          <h3 class="menu-title"></h3>
          <button class="close-btn" @click="emit('close')">✕</button>
        </div>
        <input 
          ref="searchInput"
          v-model="search" 
          type="text" 
          class="menu-search" 
          :placeholder="t('app.search_prompts')"
        >
      </div>
      
      <div class="prompts-list" v-if="filteredPrompts.length > 0">
        <div 
          v-for="(prompt, index) in filteredPrompts" 
          :key="prompt.id"
          class="prompt-item"
          :class="{ 'is-selected': index === selectedIndex }"
          @mousedown="selectPrompt(prompt)"
          @mouseenter="selectedIndex = index"
        >
          <div class="prompt-icon">📝</div>
          <div class="prompt-info">
            <div class="prompt-name">{{ prompt.name }}</div>
            <div class="prompt-preview" :title="prompt.content">{{ truncateText(prompt.content) }}</div>
          </div>
          <div class="prompt-shortcut" v-if="index < 9">Alt+{{ index + 1 }}</div>
        </div>
      </div>
      
      <div class="no-prompts" v-else>
        {{ t('app.no_prompts_found') }}
        <div class="hint">{{ t('app.add_prompts_hint') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prompts-menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
  z-index: 1000;
}

.prompts-menu {
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  background: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}
.close-btn:hover {
  color: #fff;
}

.menu-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.menu-search {
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box; /* Fix for width overflow */
}

.menu-search:focus {
  border-color: rgba(255, 255, 255, 0.3);
}

.prompts-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 8px;
}

.prompt-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s;
}

.prompt-item:hover, .prompt-item.is-selected {
  background: rgba(255, 255, 255, 0.1);
}
.prompt-item.is-selected {
  background: rgba(255, 255, 255, 0.15);
}

.prompt-icon {
  margin-right: 12px;
  font-size: 20px;
}

.prompt-info {
  flex-grow: 1;
  overflow: hidden;
}

.prompt-name {
  font-weight: 500;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 2px;
}

.prompt-preview {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.3;
}

.prompt-shortcut {
  margin-left: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
}

.no-prompts {
  padding: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

.hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 8px;
}

/* Scrollbar */
.prompts-list::-webkit-scrollbar {
  width: 6px;
}

.prompts-list::-webkit-scrollbar-track {
  background: transparent;
}

.prompts-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
