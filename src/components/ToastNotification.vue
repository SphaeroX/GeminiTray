<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const toasts = ref<Array<{ id: number; message: string; type: 'info' | 'success' | 'error' }>>([]);
let toastId = 0;

const addToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
  const id = toastId++;
  toasts.value.push({ id, message, type });
  
  setTimeout(() => {
    removeToast(id);
  }, 4000);
};

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

onMounted(() => {
  window.ipcRenderer.onScreenshotTaken(() => {
    addToast(t('app.screenshot_copied'), 'success');
  });
  
  window.ipcRenderer.onUpdateAvailable(() => {
    addToast(t('app.updates.available'), 'info');
  });
});

defineExpose({ addToast });
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id" 
          class="toast"
          :class="toast.type"
        >
          <span class="toast-icon">
            <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else-if="toast.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click="removeToast(toast.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  min-width: 250px;
  max-width: 350px;
}

.toast.success {
  border-left: 3px solid #4ade80;
}

.toast.info {
  border-left: 3px solid #60a5fa;
}

.toast.error {
  border-left: 3px solid #f87171;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast.success .toast-icon {
  color: #4ade80;
}

.toast.info .toast-icon {
  color: #60a5fa;
}

.toast.error .toast-icon {
  color: #f87171;
}

.toast-message {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
