import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './i18n'

createApp(App).use(i18n).mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
