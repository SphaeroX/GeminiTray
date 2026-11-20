import { createApp } from "vue";
import "../../lib/theme.css";
import { i18n } from "../../lib/i18n";
import App from "./App.vue";

createApp(App).use(i18n).mount("#app");
