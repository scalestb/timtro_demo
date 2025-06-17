import i18n from "../locales"

/**
 * Initialize the application language based on:
 * 1. User's stored preference
 * 2. Browser language
 * 3. Default to Vietnamese if neither is available
 */
export function initializeLanguage() {
  // Check if there's a stored language preference
  const storedLang = localStorage.getItem("language")

  if (storedLang && ["en", "vi"].includes(storedLang)) {
    i18n.global.locale.value = storedLang
    document.documentElement.lang = storedLang
    return
  }

  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage
  const preferredLang = browserLang && browserLang.startsWith("en") ? "en" : "vi"

  i18n.global.locale.value = preferredLang
  document.documentElement.lang = preferredLang
  localStorage.setItem("language", preferredLang)
}

