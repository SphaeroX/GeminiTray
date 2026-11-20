import type { Component } from "vue";
import GeneralSection from "./GeneralSection.vue";
import ShortcutsSection from "./ShortcutsSection.vue";
import AccountSection from "./AccountSection.vue";

export interface Section {
  id: string;
  /** SVG path data for the 16×16 navigation icon. */
  icon: string;
  component: Component;
}

// Order = navigation order. Later tasks add Voice, Prompts, Window, Updates.
export const sections: Section[] = [
  {
    id: "general",
    icon: "M8 5.8a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4",
    component: GeneralSection,
  },
  {
    id: "shortcuts",
    icon: "M3 4h10a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 13 12H3a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 3 4ZM4 6.5h1M7 6.5h1M10 6.5h2M4.5 9.5h7",
    component: ShortcutsSection,
  },
  {
    id: "account",
    icon: "M8 2.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM2.5 14c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4",
    component: AccountSection,
  },
];
