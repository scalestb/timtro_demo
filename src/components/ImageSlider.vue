<template>
  <div class="image-slider">
    <!-- Main Image -->
    <div class="main-image-container">
      <div class="image-wrapper">
        <img 
          :src="images[currentIndex]" 
          :alt="`Property image ${currentIndex + 1}`"
          class="main-image"
          @click="toggleFullscreen"
        />
        
        <!-- Navigation Arrows -->
        <button 
          class="nav-button prev"
          @click.stop="prevSlide"
          :disabled="images.length <= 1"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          class="nav-button next"
          @click.stop="nextSlide"
          :disabled="images.length <= 1"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
  
        <!-- Image Counter -->
        <div class="image-counter">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
  
        <!-- Fullscreen Button -->
        <button class="fullscreen-button" @click.stop="toggleFullscreen">
          <i class="fas" :class="isFullscreen ? 'fa-compress' : 'fa-expand'"></i>
        </button>
      </div>
    </div>
  
    <!-- Thumbnails -->
    <div class="thumbnails-container">
      <div class="thumbnails-wrapper">
        <button 
          v-for="(image, index) in images" 
          :key="index"
          class="thumbnail-button"
          :class="{ active: index === currentIndex }"
          @click="setCurrentIndex(index)"
        >
          <img 
            :src="image" 
            :alt="`Thumbnail ${index + 1}`"
            class="thumbnail-image"
          />
        </button>
      </div>
    </div>
  
    <!-- Fullscreen Modal -->
    <div v-if="isFullscreen" class="fullscreen-modal" @click="closeFullscreen">
      <div class="fullscreen-content" @click.stop>
        <img 
          :src="images[currentIndex]" 
          :alt="`Property image ${currentIndex + 1}`"
          class="fullscreen-image"
        />
        
        <button 
          class="nav-button prev"
          @click.stop="prevSlide"
          :disabled="images.length <= 1"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          class="nav-button next"
          @click.stop="nextSlide"
          :disabled="images.length <= 1"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
  
        <button class="close-button" @click="closeFullscreen">
          <i class="fas fa-times"></i>
        </button>
  
        <div class="fullscreen-counter">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
  
        <!-- Thumbnails in fullscreen -->
        <div class="fullscreen-thumbnails">
          <div class="thumbnails-wrapper">
            <button 
              v-for="(image, index) in images" 
              :key="index"
              class="thumbnail-button"
              :class="{ active: index === currentIndex }"
              @click="setCurrentIndex(index)"
            >
              <img 
                :src="image" 
                :alt="`Thumbnail ${index + 1}`"
                class="thumbnail-image"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  export default {
  name: 'ImageSlider',
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const currentIndex = ref(0);
    const isFullscreen = ref(false);
    let autoplayInterval = null;
  
    const nextSlide = () => {
      currentIndex.value = (currentIndex.value + 1) % props.images.length;
    };
  
    const prevSlide = () => {
      currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
    };
  
    const setCurrentIndex = (index) => {
      currentIndex.value = index;
    };
  
    const toggleFullscreen = () => {
      isFullscreen.value = !isFullscreen.value;
      if (isFullscreen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
  
    const closeFullscreen = () => {
      isFullscreen.value = false;
      document.body.style.overflow = '';
    };
  
    const handleKeydown = (e) => {
      if (!isFullscreen.value) return;
      
      if (e.key === 'Escape') {
        closeFullscreen();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
  
    onMounted(() => {
      document.addEventListener('keydown', handleKeydown);
    });
  
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown);
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    });
  
    return {
      currentIndex,
      isFullscreen,
      nextSlide,
      prevSlide,
      setCurrentIndex,
      toggleFullscreen,
      closeFullscreen
    };
  }
  };
  </script>
  
  <style scoped>
  .image-slider {
    width: 100%;
    background: #f8f9fa;
    border-radius: 16px;
    overflow: hidden;
  }
  
  .main-image-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 aspect ratio */
    background: #000;
  }
  
  .image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .main-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
  }
  
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  
  .nav-button:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }
  
  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .nav-button.prev {
    left: 16px;
  }
  
  .nav-button.next {
    right: 16px;
  }
  
  .image-counter {
    position: absolute;
    bottom: 16px;
    left: 16px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  
  .fullscreen-button {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .fullscreen-button:hover {
    background: white;
    transform: scale(1.1);
  }
  
  .thumbnails-container {
    padding: 16px;
    background: white;
  }
  
  .thumbnails-wrapper {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #99CCFF #f1f1f1;
    padding-bottom: 8px;
  }
  
  .thumbnails-wrapper::-webkit-scrollbar {
    height: 6px;
  }
  
  .thumbnails-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .thumbnails-wrapper::-webkit-scrollbar-thumb {
    background: #99CCFF;
    border-radius: 3px;
  }
  
  .thumbnail-button {
    flex: 0 0 100px;
    height: 60px;
    border: 2px solid transparent;
    border-radius: 8px;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .thumbnail-button.active {
    border-color: #99CCFF;
    transform: scale(1.05);
  }
  
  .thumbnail-button:hover {
    transform: scale(1.05);
  }
  
  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .fullscreen-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .fullscreen-content {
    position: relative;
    width: 90%;
    height: 90%;
    display: flex;
    flex-direction: column;
  }
  
  .fullscreen-image {
    flex: 1;
    width: 100%;
    height: calc(100% - 100px);
    object-fit: contain;
  }
  
  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-button:hover {
    background: white;
    transform: scale(1.1);
  }
  
  .fullscreen-counter {
    position: absolute;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 20px;
    font-size: 1rem;
  }
  
  .fullscreen-thumbnails {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    padding: 16px;
  }
  
  .fullscreen-thumbnails .thumbnails-wrapper {
    justify-content: center;
  }
  
  .fullscreen-thumbnails .thumbnail-button {
    flex: 0 0 80px;
    height: 48px;
  }
  
  @media (max-width: 768px) {
    .nav-button {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }
  
    .thumbnail-button {
      flex: 0 0 80px;
      height: 48px;
    }
  
    .fullscreen-thumbnails .thumbnail-button {
      flex: 0 0 60px;
      height: 36px;
    }
  }
  </style>
  
  