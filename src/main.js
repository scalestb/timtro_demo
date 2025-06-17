import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import i18n from "./locales"
import { BootstrapVue3 } from "bootstrap-vue-3"
import analyticsPlugin from "./plugins/analytics"
import { initializeLanguage } from "./utils/language-utils"

// Import styles
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue-3/dist/bootstrap-vue-3.css"
import "@fortawesome/fontawesome-free/css/all.css"
import "./assets/base.css"


// Initialize language before mounting the app
initializeLanguage()

const app = createApp(App)

// Use plugins
app.use(router)
app.use(BootstrapVue3)
app.use(analyticsPlugin, { router })

// Set up i18n with Vietnamese as default
app.use(i18n)
document.documentElement.lang = "vi"

// Mount app
app.mount("#app")

