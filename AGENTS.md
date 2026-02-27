# Agent Instructions for Gemini Tray

## Build Commands

```bash
# Development
npm run dev              # Start Vite dev server with Electron
npm run dev:console      # Start with DevTools open (OPEN_DEVTOOLS=true)

# Building
npm run build            # Build for current platform
npm run build:win        # Build Windows installer
npm run build:linux      # Build Linux AppImage
npm run build:ci         # Build without publishing (-p never)

# Preview
npm run preview          # Preview production build
```

## Testing

This project currently has no test framework configured. If adding tests, prefer Vitest for Vue/TypeScript code and place tests in `__tests__/` directories or `*.test.ts` files.

## Code Style Guidelines

### TypeScript
- **Target**: ES2020, strict mode enabled
- **Modules**: ESNext with bundler resolution
- **No semicolons** (except when needed for ASI)
- **Single quotes** for strings
- **2-space indentation**
- Use `node:` prefix for Node.js imports (`import path from 'node:path'`)

### Naming Conventions
- **Components**: PascalCase (`SettingsView.vue`, `TitleBar.vue`)
- **Classes**: PascalCase (`WindowManager`, `TrayManager`)
- **Variables/Functions**: camelCase (`toggleSettings`, `isVisible`)
- **Interfaces**: PascalCase with descriptive names (`AppSettings`, `Prompt`)
- **Event handlers**: Prefix with `handle` (`handleShortcutKeydown`, `handlePromptSelect`)
- **Private members**: No underscore prefix (use native private fields `#field` if needed)

### Vue Components
- Use **Composition API** with `<script setup lang="ts">`
- Define interfaces for complex props/data structures
- Type all refs: `const count = ref<number>(0)`
- Use typed emits: `defineEmits<{ (e: 'close'): void }>()`
- CSS must be **scoped**: `<style scoped>`
- Use CSS custom properties for theming
- Dark theme is default (rgba backgrounds, white text)

### Import Organization
1. Node.js built-ins (`node:path`, `node:fs`)
2. Third-party packages (`electron`, `vue`)
3. Internal modules (absolute paths from project root)
4. Relative imports

### Error Handling
- Use `try/catch` for async operations
- Log errors to console: `console.error('[Context] Message:', error)`
- Never silently fail user-facing operations

### Electron Specifics
- Use `contextBridge` to expose APIs to renderer (see `preload.ts`)
- Store user preferences via `electron-store`
- Use `BrowserView` for web content isolation
- Partition persistent sessions: `partition: 'persist:gemini'`

### CSS Conventions
- Use **kebab-case** for class names
- Prefer **flexbox** for layouts
- Use `rgba()` for transparency effects
- Standard scrollbar styling pattern exists in `style.css`
- Support both light/dark via `color-scheme: light dark`

## Project Structure

```
electron/              # Main process code
  managers/           # Window, Tray, IPC, Shortcuts, ScriptInjector
  services/           # Screenshot, Debug
  utils/              # Store, constants, logger
  main.ts             # Entry point
  preload.ts          # Context bridge
src/                   # Renderer process (Vue)
  components/         # Vue SFC components
  locales/            # i18n translations
  App.vue             # Root component
  main.ts             # Renderer entry
  style.css           # Global styles
```

## i18n

Use `vue-i18n` for all user-facing strings:
- Define keys in `src/locales/en.json`
- Access via `const { t } = useI18n()`
- Use namespaced keys: `t('app.settings')`, `t('app.categories.general')`

## Critical Implementation Notes

- App uses `BrowserView` for Gemini web content, not `loadURL`
- Window hides on close (tray mode), use `app.quit()` for real exit
- Screenshot feature requires `desktopCapturer` permissions
- Auto-updater checks GitHub releases (configured in `electron-builder.json5`)
