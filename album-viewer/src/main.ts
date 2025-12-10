import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import en from './i18n/en'
import fr from './i18n/fr'
import de from './i18n/de'

const i18n = createI18n({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	messages: { en, fr, de }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
