<template>
  <div class="not-found-page">
    <b-container class="py-5 text-center">
      <h1 class="display-1 mb-4">404</h1>
      <h2 class="mb-4">Oops! Looks like our hacker went off track!</h2>
      <div class="hacker-animation mb-4">
        <pre class="text-left">
          <code>
  ┌─────────────────────────┐
  │   ACCESS DENIED         │
  │   ---------------       │
  │   Hacker.exe crashed    │
  │   Error: 404 Not Found  │
  │                         │
  │   > Reboot system?      │
  │   > [Y] / N             │
  └───��─────────────────────┘
          </code>
        </pre>
      </div>
      <p class="lead mb-4">Don't worry, even the best hackers sometimes end up in the wrong directory!</p>
      <b-button variant="primary" @click="goHome">
        <i class="fas fa-home mr-2"></i> Return to Home Base
      </b-button>
    </b-container>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'NotFoundPage',
  setup() {
    const router = useRouter();

    const goHome = () => {
      router.push({ name: 'Home' });
    };

    return {
      goHome
    };
  }
};
</script>

<style scoped>
.not-found-page {
  background-color: #1a1a1a;
  color: #33ff33;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hacker-animation {
  background-color: #000;
  border-radius: 10px;
  padding: 20px;
  font-family: 'Courier New', Courier, monospace;
  animation: glitch 1s infinite;
}

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-5px, 5px);
  }
  40% {
    transform: translate(-5px, -5px);
  }
  60% {
    transform: translate(5px, 5px);
  }
  80% {
    transform: translate(5px, -5px);
  }
  100% {
    transform: translate(0);
  }
}

.btn-primary {
  background-color: #33ff33;
  border-color: #33ff33;
  color: #000;
}

.btn-primary:hover {
  background-color: #2bdb2b;
  border-color: #2bdb2b;
}
</style>

