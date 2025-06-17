<template>
  <transition name="popup">
    <div v-if="show" class="popup-overlay" @click="handleClose">
      <div class="popup-content" @click.stop>
        <button class="popup-close" @click="handleClose" aria-label="Close popup">
          <i class="fas fa-times"></i>
        </button>
        
        <a 
          :href="ctaLink" 
          target="_blank" 
          rel="noopener noreferrer"
          class="popup-image-container"
        >
          <img 
            :src="imageUrl" 
            :alt="alt"
            class="popup-image"
            @error="handleImageError"
          />
        </a>
  
        <div v-if="timeLeft > 0" class="popup-timer">
          Popup will show again in {{ formatTime(timeLeft) }}
        </div>
      </div>
    </div>
  </transition>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  export default {
  name: 'Popup',
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    ctaLink: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      default: 5000
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const show = ref(true);
    const timeLeft = ref(0);
    let countdownTimer = null;
  
    const handleClose = () => {
      show.value = false;
      emit('close');
      startCountdown();
    };
  
    const startCountdown = () => {
      const nextShowTime = Date.now() + props.timeout;
      localStorage.setItem('popupNextShow', nextShowTime.toString());
      
      updateTimeLeft();
      countdownTimer = setInterval(updateTimeLeft, 1000);
    };
  
    const updateTimeLeft = () => {
      const nextShowTime = parseInt(localStorage.getItem('popupNextShow') || '0');
      timeLeft.value = Math.max(0, Math.ceil((nextShowTime - Date.now()) / 1000));
  
      if (timeLeft.value === 0 && countdownTimer) {
        clearInterval(countdownTimer);
        show.value = true;
      }
    };
  
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
  
    const handleImageError = (event) => {
      console.error('Failed to load popup image:', event.target.src);
      event.target.src = '/placeholder.svg?height=400&width=600';
    };
  
    onMounted(() => {
      const nextShowTime = localStorage.getItem('popupNextShow');
      if (nextShowTime) {
        const now = Date.now();
        if (now < parseInt(nextShowTime)) {
          show.value = false;
          startCountdown();
        }
      }
  
      const handleEscape = (e) => {
        if (e.key === 'Escape' && show.value) {
          handleClose();
        }
      };
  
      document.addEventListener('keydown', handleEscape);
  
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    });
  
    onUnmounted(() => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    });
  
    return {
      show,
      timeLeft,
      handleClose,
      handleImageError,
      formatTime
    };
  }
  };
  </script>
  
  <style scoped>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 2000; /* Ensure above other fixed elements */
    backdrop-filter: blur(4px);
  }
  
  .popup-content {
    position: relative;
    width: 100%;
    max-width: 500px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    margin: 0 auto;
    animation: popup-in 0.3s ease-out;
  }
  
  .popup-image-container {
    display: block;
    width: 100%;
    height: 0;
    padding-bottom: 75%;
    position: relative;
    cursor: pointer;
    background: #f8fafc;
  }
  
  @media (max-width: 768px) {
    .popup-overlay {
      padding: 1rem;
      align-items: center; /* Center vertically on mobile */
    }
  
    .popup-content {
      width: calc(100% - 2rem);
      max-height: calc(100vh - 2rem);
      border-radius: 12px;
    }
  
    .popup-image-container {
      padding-bottom: 100%; /* Square aspect ratio on mobile */
    }
  
    .popup-close {
      width: 36px; /* Larger touch target */
      height: 36px;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(4px);
    }
  }
  
  .popup-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: white;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Add mobile-specific styles */
  
  
  .popup-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .popup-timer {
    padding: 0.75rem;
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }
  
  /* Animations */
  .popup-enter-active,
  .popup-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .popup-enter-from,
  .popup-leave-to {
    opacity: 0;
  }
  
  .popup-enter-active .popup-content {
    animation: popup-in 0.3s ease-out;
  }
  
  .popup-leave-active .popup-content {
    animation: popup-in 0.3s ease-out reverse;
  }
  
  @keyframes popup-in {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  </style>
  
  