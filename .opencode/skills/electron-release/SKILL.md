---
name: electron-release
description: Release Management mit electron-builder und GitHub Actions für Gemini Tray
license: MIT
compatibility: opencode
metadata:
  category: deployment
  scope: ci-cd
---

## Electron Release Management

### electron-builder Konfiguration

```json
// electron-builder.json5
{
    "appId": "com.sphaerox.geminitray",
    "productName": "Gemini Tray",
    "directories": {
        "output": "release/${version}"
    },
    "files": [
        "dist",
        "dist-electron"
    ],
    "win": {
        "target": [
            {
                "target": "nsis",
                "arch": ["x64"]
            }
        ],
        "icon": "public/icon.ico"
    },
    "linux": {
        "target": [
            {
                "target": "AppImage",
                "arch": ["x64"]
            }
        ],
        "icon": "public/icon.png",
        "category": "Utility"
    },
    "nsis": {
        "oneClick": false,
        "allowToChangeInstallationDirectory": true,
        "createDesktopShortcut": true,
        "createStartMenuShortcut": true
    },
    "publish": {
        "provider": "github",
        "owner": "SphaeroX",
        "repo": "GeminiTray",
        "releaseType": "release"
    }
}
```

### Package.json Scripts

```json
{
    "scripts": {
        "dev": "vite",
        "dev:console": "cross-env OPEN_DEVTOOLS=true vite",
        "build": "vue-tsc && vite build && electron-builder",
        "build:win": "vue-tsc && vite build && electron-builder --win",
        "build:linux": "vue-tsc && vite build && electron-builder --linux",
        "build:ci": "vue-tsc && vite build && electron-builder -p never",
        "preview": "vite preview"
    }
}
```

### Auto-Updater Integration

```typescript
// electron/main.ts
import { autoUpdater } from 'electron-updater'

function setupAutoUpdater() {
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true

    autoUpdater.on('update-available', (info) => {
        windowManager.win?.webContents.send('update-available', info)
    })

    autoUpdater.on('update-downloaded', (info) => {
        windowManager.win?.webContents.send('update-downloaded', info)
    })

    // Nur im Production Modus prüfen
    if (!VITE_DEV_SERVER_URL) {
        autoUpdater.checkForUpdates().catch(console.error)
    }
}
```

### Frontend Update UI

```vue
<!-- UpdateNotification.vue -->
<template>
  <div v-if="updateAvailable" class="update-banner">
    <p>{{ t('app.updates.available') }}</p>
    <button @click="downloadUpdate">{{ t('app.updates.download') }}</button>
    <button @click="dismiss">{{ t('app.close') }}</button>
  </div>
  
  <div v-if="updateReady" class="update-banner ready">
    <p>{{ t('app.updates.ready') }}</p>
    <button @click="installUpdate">{{ t('app.updates.install') }}</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const updateAvailable = ref(false)
const updateReady = ref(false)

onMounted(() => {
    window.electronAPI.onUpdateAvailable(() => {
        updateAvailable.value = true
    })
    
    window.electronAPI.onUpdateDownloaded(() => {
        updateAvailable.value = false
        updateReady.value = true
    })
})

const downloadUpdate = () => {
    // Implementation zum Download starten
}

const installUpdate = () => {
    window.electronAPI.quitAndInstall()
}
</script>
```

### GitHub Actions Workflow

```yaml
# .github/workflows/release.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build:win
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: windows-build
          path: release/**

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build:linux
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: linux-build
          path: release/**

  create-release:
    needs: [build-windows, build-linux]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download all artifacts
        uses: actions/download-artifact@v3
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            windows-build/**/*.exe
            linux-build/**/*.AppImage
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Versionierung

**Semantic Versioning**:
```
1.0.7  # MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking Changes
- **MINOR**: Neue Features, rückwärtskompatibel
- **PATCH**: Bugfixes

**Version Bump Prozess**:
```bash
# 1. Version in package.json erhöhen
# 2. Git tag erstellen
git tag -a v1.0.8 -m "Release version 1.0.8"

# 3. Push mit Tags
git push origin main --tags

# 4. GitHub Actions baut automatisch
```

### Release Checkliste

Vor jedem Release:

- [ ] Version in `package.json` aktualisiert
- [ ] Changelog aktualisiert
- [ ] Alle Tests bestanden
- [ ] Build lokal getestet
- [ ] Auto-Update getestet
- [ ] Git tag erstellt
- [ ] Release Notes geschrieben

### Manuelles Release

```bash
# Nur bauen, nicht veröffentlichen
npm run build:ci

# Windows nur
npm run build:win

# Linux nur
npm run build:linux
```

### Troubleshooting

**Code Signing** (Windows):
- Für produktive Releases: Code Signing Zertifikat erforderlich
- Ohne: "Unknown Publisher" Warnung

**Notarization** (macOS):
```json
{
    "mac": {
        "hardenedRuntime": true,
        "gatekeeperAssess": false,
        "entitlements": "build/entitlements.mac.plist",
        "entitlementsInherit": "build/entitlements.mac.plist"
    }
}
```

**GH_TOKEN**:
- Personal Access Token mit `repo` Scope
- Als Repository Secret `GITHUB_TOKEN` hinzufügen
