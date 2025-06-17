<template>
  <div class="banner-slider">
    <div class="banner-container">
      <div 
        v-for="(banner, index) in banners" 
        :key="index"
        class="banner-slide"
        :class="{ active: currentIndex === index }"
      >
        <img 
          :src="banner.image" 
          :alt="banner.title" 
          class="banner-image"
          @click="handleBannerClick(banner)"
        />
        <div class="banner-content">
          <h3 class="banner-title">{{ banner.title }}</h3>
          <p class="banner-description">{{ banner.description }}</p>
          <button 
            v-if="banner.url" 
            class="banner-button"
            @click="handleBannerClick(banner)"
          >
            {{ t('banner.learnMore') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Navigation Dots -->
    <div v-if="banners.length > 1" class="banner-dots">
      <span 
        v-for="(banner, index) in banners" 
        :key="`dot-${index}`"
        class="banner-dot"
        :class="{ active: currentIndex === index }"
        @click="setCurrentSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTranslation } from '../locales';

export default {
  name: 'BannerSlider',
  props: {
    banners: {
      type: Array,
      default: () => []
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 5000
    }
  },
  setup(props) {
    const { t } = useTranslation();
    const router = useRouter();
    const currentIndex = ref(0);
    const autoplayInterval = ref(null);

    const setCurrentSlide = (index) => {
      currentIndex.value = index;
      resetAutoplay();
    };

    const nextSlide = () => {
      currentIndex.value = (currentIndex.value + 1) % props.banners.length;
    };

    const prevSlide = () => {
      currentIndex.value = (currentIndex.value - 1 + props.banners.length) % props.banners.length;
    };

    const startAutoplay = () => {
      if (props.autoplay && props.banners.length > 1) {
        autoplayInterval.value = setInterval(() => {
          nextSlide();
        }, props.interval);
      }
    };

    const stopAutoplay = () => {
      if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
        autoplayInterval.value = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    const handleBannerClick = (banner) => {
      if (!banner || !banner.url) return;
      
      if (banner.url.startsWith('http')) {
        // External URL
        window.open(banner.url, '_blank');
      } else {
        // Internal route
        router.push(banner.url);
      }
    };

    // Watch for changes in banners prop
    watch(() => props.banners, (newBanners) => {
      if (newBanners.length > 0) {
        currentIndex.value = 0;
        resetAutoplay();
      }
    }, { deep: true });

    onMounted(() => {
      startAutoplay();
    });

    onBeforeUnmount(() => {
      stopAutoplay();
    });

    return {
      currentIndex,
      setCurrentSlide,
      nextSlide,
      prevSlide,
      handleBannerClick,
      t
    };
  }
};
</script>

<style scoped>
.banner-slider {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
}

.banner-container {
  position: relative;
  width: 100%;
  height: 200px;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  flex-direction: column;
}

.banner-slide.active {
  opacity: 1;
  z-index: 1;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  color: white;
}

.banner-title {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.banner-description {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.banner-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.banner-button:hover {
  background-color: #ff7875;
}

.banner-dots {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  z-index: 2;
}

.banner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.banner-dot.active {
  background-color: white;
  transform: scale(1.2);
}

@media (min-width: 768px) {
  .banner-container {
    height: 250px;
  }
  
  .banner-title {
    font-size: 1.4rem;
  }
  
  .banner-description {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .banner-container {
    height: 180px;
  }
  
  .banner-content {
    padding: 10px;
  }
  
  .banner-title {
    font-size: 1.1rem;
  }
  
  .banner-description {
    font-size: 0.8rem;
    -webkit-line-clamp: 1;
  }
  
  .banner-button {
    padding: 4px 10px;
    font-size: 0.8rem;
  }
}
</style>

