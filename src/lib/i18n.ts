import { createI18n } from "vue-i18n";
import de from "../locales/de.json";
import en from "../locales/en.json";

export type Lang = "de" | "en";

/** Resolve the language setting against the browser/system language. */
export function resolveLanguage(setting: string | undefined, systemLanguage: string): Lang {
  if (setting === "de" || setting === "en") return setting;
  return systemLanguage.toLowerCase().startsWith("de") ? "de" : "en";
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveLanguage(undefined, navigator.language),
  fallbackLocale: "en",
  messages: { de, en },
});

export function setLanguage(lang: Lang) {
  i18n.global.locale.value = lang;
  document.documentElement.lang = lang;
}
