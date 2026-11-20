import { ref } from "vue";
import { onEvent } from "../../lib/events";
import { api, type SaveError, type Settings, type SettingsView } from "../../lib/api";
import { setLanguage } from "../../lib/i18n";

export const view = ref<SettingsView | null>(null);

function apply(v: SettingsView) {
  view.value = v;
  setLanguage(v.language);
}

export async function load() {
  apply(await api.getSettings());
  await onEvent<SettingsView>("settings-changed", apply);
}

/** Apply a change and save it. Returns the error (and leaves the settings unchanged) on failure. */
export async function save(mutate: (s: Settings) => void): Promise<SaveError | null> {
  if (!view.value) return null;
  const draft: Settings = JSON.parse(JSON.stringify(view.value.settings));
  mutate(draft);
  try {
    apply(await api.updateSettings(draft));
    return null;
  } catch (e) {
    return e as SaveError;
  }
}
