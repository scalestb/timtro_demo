<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      
      <!-- Back Button -->
      <button class="btn btn-outline-secondary" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>

      <!-- Logo -->
      <router-link class="navbar-brand ms-auto" to="/">
        <img src="@/assets/logo.png" alt="Logo" height="32">
      </router-link>
      
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.back()
    }

    return { goBack }
  }
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,.08);
  height: 56px;
}

.navbar-brand img {
  height: 32px;
  width: auto;
}

@media (min-width: 768px) {
  .navbar {
    height: 72px;
  }

  .navbar-brand img {
    height: 40px;
  }
}
</style>
