import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

const i18n = createI18n({
    legacy: false, // Usage of Composition API
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
        en
    }
})

export default i18n
