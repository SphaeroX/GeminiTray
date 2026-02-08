---
name: i18n-management
description: Internationalisierung mit vue-i18n für Gemini Tray - Keine hardcoded Texte, Englisch als Basis
license: MIT
compatibility: opencode
metadata:
  category: internationalization
  scope: frontend
---

## i18n Management in Gemini Tray

### Architektur

```
src/
├── i18n.ts              # i18n Konfiguration
├── locales/
│   ├── en.json         # Basis-Sprache (Englisch)
│   └── de.json         # Zusätzliche Sprachen
└── components/
    └── *.vue           # Verwendung via $t() oder t()
```

### i18n Konfiguration

```typescript
// src/i18n.ts
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

const i18n = createI18n({
    locale: 'en',           // Standard-Sprache
    fallbackLocale: 'en',   // Fallback wenn Key fehlt
    messages: {
        en
    }
})

export default i18n
```

### Struktur der Sprachdatei

```json
// src/locales/en.json
{
    "app": {
        "title": "Gemini Tray",
        "settings": "Settings",
        "close": "Close",
        "save": "Save",
        "cancel": "Cancel",
        "categories": {
            "general": "General",
            "shortcuts": "Shortcuts",
            "sound": "Sound",
            "prompts": "Prompts"
        },
        "troubleshooting": {
            "reset_session": "Reset Session",
            "reset_session_desc": "Clears all cookies and local data...",
            "reset_btn": "Reset & Restart"
        }
    }
}
```

### Verwendung in Vue-Komponenten

**Composition API**:
```vue
<template>
  <div>
    <h1>{{ t('app.title') }}</h1>
    <button>{{ t('app.save') }}</button>
    <p>{{ t('app.troubleshooting.reset_session_desc') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
```

**Options API**:
```vue
<template>
  <div>
    <h1>{{ $t('app.title') }}</h1>
  </div>
</template>
```

### Neue Texte hinzufügen

Wenn du ein neues UI-Element erstellst:

1. **Key in en.json hinzufügen**:
```json
{
    "app": {
        "new_feature": {
            "title": "New Feature",
            "description": "Description of the feature",
            "action_button": "Activate"
        }
    }
}
```

2. **In Komponente verwenden**:
```vue
<template>
  <div class="new-feature">
    <h2>{{ t('app.new_feature.title') }}</h2>
    <p>{{ t('app.new_feature.description') }}</p>
    <button>{{ t('app.new_feature.action_button') }}</button>
  </div>
</template>
```

3. **Regel: KEINE hardcoded Texte**:
```vue
<!-- ❌ FALSCH -->
<button>Save Settings</button>
<p>Adjust your preferences here</p>

<!-- ✅ RICHTIG -->
<button>{{ t('app.save') }}</button>
<p>{{ t('app.settings_description') }}</p>
```

### Dynamische Werte

```vue
<template>
  <!-- Mit Parametern -->
  <p>{{ t('app.items_count', { count: 5 }) }}</p>
  <!-- Output: "You have 5 items" -->
  
  <!-- Pluralisierung -->
  <p>{{ t('app.notifications', { count: unreadCount }) }}</p>
</template>
```

```json
{
    "app": {
        "items_count": "You have {count} items",
        "notifications": "You have {count} notification | You have {count} notifications"
    }
}
```

### Sprache zur Laufzeit wechseln

```typescript
// In Komponente
const { locale } = useI18n()

const switchLanguage = (lang: string) => {
    locale.value = lang
    // Sprache laden falls nicht vorhanden
    if (!i18n.global.availableLocales.includes(lang)) {
        import(`./locales/${lang}.json`).then(messages => {
            i18n.global.setLocaleMessage(lang, messages.default)
            locale.value = lang
        })
    }
}
```

### Neue Sprache hinzufügen

1. **Datei erstellen**: `src/locales/de.json`
2. **Alle Keys aus en.json kopieren** und übersetzen
3. **In i18n.ts registrieren**:
```typescript
import de from './locales/de.json'

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        de  // Neue Sprache
    }
})
```

### Best Practices

✅ **Immer**:
- Englisch als Basis-Sprache verwenden
- Logische Key-Struktur (Hierarchien mit Punkten)
- Deskriptive Keys (nicht `msg1`, sondern `save_button_label`)
- Alle UI-Texte externalisieren

❌ **Nie**:
- Hardcoded Strings im Code
- Direkte Text-Änderungen ohne i18n
- Keys ohne Namespace (immer `app.xxx` oder `component.xxx`)
- Übersetzungen vergessen wenn neues Feature kommt

### Wichtige Regeln aus GEMINI.md

> **AI-Sprache**: Die AI kommuniziert mit dem Benutzer immer auf Deutsch.
> **Code-Sprache**: Der Code (Variablennamen, Kommentare, Commits) ist immer auf Englisch.
> **Text-Management**: Es darf kein fest codierter Text im Code stehen. Alle UI-Texte werden über das i18n System verwaltet.
