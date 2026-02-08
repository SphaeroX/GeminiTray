---
name: create_vue_component
description: Create a new Vue 3 component following project standards (TypeScript, localized text, scoped CSS).
---

# Create Vue Component Skill

This skill guides you through creating a new Vue 3 component for the Gemini Tray project.

## Standards checklist

- [ ] Use `<script setup lang="ts">`
- [ ] Use `scoped` CSS (Vanilla CSS)
- [ ] NO hardcoded text in template (use `$t('key')`)
- [ ] Define precise props and emits using TypeScript interfaces/types
- [ ] Place component in `src/components/` (or subfolder if specific feature)

## Step-by-Step Instructions

### 1. Identify Component Requirements
Determine the following:
- **Name**: PascalCase (e.g., `MyNewComponent.vue`)
- **Props**: What data does it need?
- **Emits**: What events does it trigger?
- **Localization Keys**: What text will be displayed?

### 2. Create the Component File
Create a new file in `src/components/MyNewComponent.vue`.

**Template:**

```vue
<script setup lang="ts">
// Imports (if any)

// Props Definition
interface Props {
  title: string
  isActive?: boolean
}

// Emits Definition
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', value: string): void
}>()

// Default Props (if needed) with destructuring
const { title, isActive = false } = defineProps<Props>()

// Reactive State
// const count = ref(0)

// Methods
const handleClick = () => {
    emit('submit', 'some value')
}
</script>

<template>
  <div class="my-component" :class="{ active: isActive }">
    <h2>{{ title }}</h2>
    <p>{{ $t('myComponent.description') }}</p>
    
    <button @click="handleClick">
      {{ $t('common.submit') }}
    </button>
    
    <button class="close-btn" @click="emit('close')">
      {{ $t('common.close') }}
    </button>
  </div>
</template>

<style scoped>
/* Use Vanilla CSS variables if available, or static colors matching the theme */
.my-component {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 16px;
  color: white;
}

.my-component.active {
  border: 1px solid #4CAF50; /* Example accent color */
}

.close-btn {
  /* ... styles ... */
}
</style>
```

### 3. Add Localization Keys
Open `src/locales/en.json` (or `src/i18n.ts` if inline) and add the keys used in your template.

```json
{
  "myComponent": {
    "description": "This is a description text."
  },
  "common": {
    "submit": "Submit",
    "close": "Close"
  }
}
```

### 4. Verify Usage
Ensure the component is imported and used correctly in the parent component (e.g., `App.vue` or another view).
