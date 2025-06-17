<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useTranslation } from './locales';
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  },
  setup() {
    const { locale, setLanguage } = useTranslation();

    const currentLanguage = computed(() => {
      return locale.value === 'vi' ? 'Tiếng Việt' : 'English';
    });

    const changeLanguage = (lang) => {
      setLanguage(lang);
    };

    return {
      currentLanguage,
      changeLanguage,
    };
  },
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

body {
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
}

.main-content {
  min-height: calc(100vh - 56px);
  padding-top: 56px;
  padding-bottom: 40px; /* Space for QuickNavigation */
}

/* Custom Bootstrap Primary Color Override */
:root {
  --bs-primary: #99CCFF;
  --bs-primary-rgb: 153, 204, 255;
}

.btn-primary {
  --bs-btn-bg: #99CCFF;
  --bs-btn-border-color: #99CCFF;
  --bs-btn-hover-bg: #7ab8ff;
  --bs-btn-hover-border-color: #7ab8ff;
  --bs-btn-active-bg: #5ba4ff;
  --bs-btn-active-border-color: #5ba4ff;
}

.btn-outline-primary {
  --bs-btn-color: #99CCFF;
  --bs-btn-border-color: #99CCFF;
  --bs-btn-hover-bg: #99CCFF;
  --bs-btn-hover-border-color: #99CCFF;
  --bs-btn-active-bg: #7ab8ff;
  --bs-btn-active-border-color: #7ab8ff;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .main-content {
    padding-top: 72px;
  }
}

.container {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

@media (min-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>

