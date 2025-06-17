<template>
  <div class="property-swipe-view">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-container">
        <div class="spinner"></div>
        <p>{{ t('swipeFlow.loading') }}</p>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="properties.length === 0" class="empty-state">
      <i class="fas fa-search-location"></i>
      <h3>{{ t('swipeFlow.noProperties') }}</h3>
      <p>{{ t('swipeFlow.tryAgain') }}</p>
      <button class="retry-btn" @click="$emit('reload')">
        <i class="fas fa-redo"></i>
        {{ t('swipeFlow.retry') }}
      </button>
    </div>
    
    <!-- Property Cards -->
    <div v-else class="property-cards">
      <div 
        v-for="(property, index) in properties" 
        :key="property.id"
        class="property-card"
        :class="{ 'active': currentPropertyIndex === index }"
        v-show="index === currentPropertyIndex"
      >
        <!-- Property Image Slideshow -->
        <div class="property-image-container">
          <img 
            v-if="getPropertyImages(property).length > 0" 
            :src="getPropertyImages(property)[currentImageIndices[property.id] || 0]" 
            alt="Property image" 
            class="property-image"
            @click="viewPropertyDetails(property.id)"
          />
          <div v-else class="no-image">
            <i class="fas fa-home"></i>
            <p>{{ t('swipeFlow.noImage') }}</p>
          </div>
          
          <!-- Image Indicators -->
          <div 
            v-if="getPropertyImages(property).length > 1" 
            class="image-indicators"
          >
            <span 
              v-for="(image, imgIndex) in getPropertyImages(property)" 
              :key="`indicator-${property.id}-${imgIndex}`"
              class="indicator"
              :class="{ 'active': currentImageIndices[property.id] === imgIndex }"
              @click.stop="setCurrentImage(property.id, imgIndex)"
            ></span>
          </div>
          
          <!-- Property Type Badge -->
          <div class="property-type-badge" v-if="property.type">
            {{ t(`propertyTypes.${property.type}`) }}
          </div>
          
          <!-- Property Price Badge -->
          <div class="price-badge">
            {{ formatPrice(property.price) }}
          </div>
        </div>
        
        <!-- Property Info -->
        <div class="property-info">
          <h2 class="property-title" @click="viewPropertyDetails(property.id)">{{ property.title }}</h2>
          
          <div class="property-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ property.location || t('swipeFlow.noLocation') }}</span>
          </div>
          
          <div class="property-features">
            <div class="feature" v-if="property.bedrooms">
              <i class="fas fa-bed"></i>
              <span>{{ property.bedrooms }}</span>
            </div>
            <div class="feature" v-if="property.bathrooms">
              <i class="fas fa-bath"></i>
              <span>{{ property.bathrooms }}</span>
            </div>
            <div class="feature" v-if="property.area">
              <i class="fas fa-vector-square"></i>
              <span>{{ property.area }}m²</span>
            </div>
            <div class="feature" v-if="property.furnished">
              <i class="fas fa-couch"></i>
            </div>
          </div>
          
          <div class="property-description">
            {{ truncateDescription(property.description) }}
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="card-actions">
          <button 
            class="action-btn like-btn"
            @click.stop="toggleLike(property.id)"
            :class="{ 'active': likedProperties.includes(property.id) }"
            aria-label="Like property"
          >
            <i class="fas" :class="likedProperties.includes(property.id) ? 'fa-heart' : 'fa-heart'"></i>
          </button>
          <button 
            class="action-btn view-btn" 
            @click.stop="viewPropertyDetails(property.id)"
            aria-label="View details"
          >
            <i class="fas fa-info-circle"></i>
            {{ t('swipeFlow.viewDetails') }}
          </button>
          <button 
            class="action-btn contact-btn" 
            @click.stop="contactOwner(property.id)"
            aria-label="Contact owner"
          >
            <i class="fas fa-phone-alt"></i>
            {{ t('swipeFlow.contactOwner') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modern Vertical Navigation Controls -->
    <div v-if="properties.length > 0" class="navigation-controls-vertical">
      <div class="nav-indicator">
        {{ currentPropertyIndex + 1 }} / {{ properties.length }}
      </div>
      <button 
        class="nav-btn prev-btn" 
        @click="previousProperty"
        :disabled="currentPropertyIndex === 0"
        aria-label="Previous property"
      >
        <i class="fas fa-chevron-up"></i>
      </button>
      <button 
        class="nav-btn next-btn" 
        @click="nextProperty"
        :disabled="currentPropertyIndex === properties.length - 1"
        aria-label="Next property"
      >
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
    
    <!-- Swipe Instructions -->
    <div class="swipe-instructions" v-if="properties.length > 0 && !instructionsDismissedState">
      <div class="instruction-content">
        <h3>{{ t('swipeFlow.title') }}</h3>
        <div class="instruction-actions">
          <div class="instruction-item">
            <i class="fas fa-chevron-up"></i>
            <span>{{ t('swipeFlow.swipeUpInstruction') }}</span>
          </div>
          <div class="instruction-item">
            <i class="fas fa-chevron-down"></i>
            <span>{{ t('swipeFlow.swipeDownInstruction') }}</span>
          </div>
        </div>
        <button class="dismiss-btn" @click="dismissInstructions">
          {{ t('swipeFlow.gotIt') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useTranslation } from '../locales';

export default {
  name: 'PropertySwipeView',
  props: {
    properties: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['load-more', 'reload'],
  setup(props, { emit }) {
    const { t } = useTranslation();
    const router = useRouter();
    
    // State
    const currentPropertyIndex = ref(0);
    const currentImageIndices = reactive({});
    const slideIntervals = reactive({});
    const touchStartY = ref(0);
    const touchEndY = ref(0);
    const swipeThreshold = 50;
    const likedProperties = ref([]);
    const instructionsDismissedStorage = ref(localStorage.getItem('swipeInstructionsDismissed') === 'true');
    const instructionsDismissedState = ref(instructionsDismissedStorage.value);
    
    // Get property images with fallback
    const getPropertyImages = (property) => {
      if (!property || !property.images) return [];
      return Array.isArray(property.images) ? property.images : [];
    };
    
    // Format price with currency
    const formatPrice = (price) => {
      if (!price) return '';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price);
    };
    
    // Truncate description
    const truncateDescription = (description) => {
      if (!description) return '';
      return description.length > 100 
        ? description.substring(0, 100) + '...' 
        : description;
    };
    
    // Set current image for a property
    const setCurrentImage = (propertyId, imageIndex) => {
      currentImageIndices[propertyId] = imageIndex;
      // Reset slideshow timer
      if (slideIntervals[propertyId]) {
        clearInterval(slideIntervals[propertyId]);
        startSlideshow(propertyId);
      }
    };
    
    // Start slideshow for a property
    const startSlideshow = (propertyId) => {
      stopSlideshow(propertyId);
      
      const property = props.properties.find(p => p.id === propertyId);
      if (!property) return;
      
      const images = getPropertyImages(property);
      if (images.length <= 1) return;
      
      if (currentImageIndices[propertyId] === undefined) {
        currentImageIndices[propertyId] = 0;
      }
      
      slideIntervals[propertyId] = setInterval(() => {
        currentImageIndices[propertyId] = (currentImageIndices[propertyId] + 1) % images.length;
      }, 2000); // 2 seconds per image
    };
    
    // Stop slideshow for a property
    const stopSlideshow = (propertyId) => {
      if (slideIntervals[propertyId]) {
        clearInterval(slideIntervals[propertyId]);
        delete slideIntervals[propertyId];
      }
    };
    
    // Go to next property
    const nextProperty = () => {
      if (currentPropertyIndex.value < props.properties.length - 1) {
        currentPropertyIndex.value++;
        
        // Start slideshow for the new current property
        const propertyId = props.properties[currentPropertyIndex.value]?.id;
        if (propertyId) {
          startSlideshow(propertyId);
        }
      } else {
        // We're at the last property, load more
        emit('load-more');
      }
    };
    
    // Go to previous property
    const previousProperty = () => {
      if (currentPropertyIndex.value > 0) {
        currentPropertyIndex.value--;
        
        // Start slideshow for the new current property
        const propertyId = props.properties[currentPropertyIndex.value]?.id;
        if (propertyId) {
          startSlideshow(propertyId);
        }
      }
    };
    
    // Touch event handlers for swipe functionality
    const handleTouchStart = (e) => {
      touchStartY.value = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      touchEndY.value = e.touches[0].clientY;
    };
    
    const handleTouchEnd = () => {
      const swipeDistance = touchEndY.value - touchStartY.value;
      
      if (Math.abs(swipeDistance) >= swipeThreshold) {
        if (swipeDistance > 0) {
          // Swipe down - next property
          nextProperty();
        } else {
          // Swipe up - previous property
          previousProperty();
        }
      }
      
      // Reset touch values
      touchStartY.value = 0;
      touchEndY.value = 0;
    };
    
    // Action handlers
    const viewPropertyDetails = (propertyId) => {
      router.push({
        name: 'PropertyDetails',
        params: { id: propertyId.toString() }
      });
    };
    
    const toggleLike = (propertyId) => {
      const index = likedProperties.value.indexOf(propertyId);
      if (index === -1) {
        likedProperties.value.push(propertyId);
      } else {
        likedProperties.value.splice(index, 1);
      }
      
      // Save to localStorage
      localStorage.setItem('likedProperties', JSON.stringify(likedProperties.value));
    };
    
    const contactOwner = (propertyId) => {
      router.push({
        name: 'PropertyDetails',
        params: { id: propertyId.toString() },
        hash: '#contact'
      });
    };
    
    const dismissInstructions = () => {
      instructionsDismissedState.value = true;
      localStorage.setItem('swipeInstructionsDismissed', 'true');
    };
    
    // Initialize liked properties from localStorage
    onMounted(() => {
      try {
        const savedLikes = localStorage.getItem('likedProperties');
        if (savedLikes) {
          likedProperties.value = JSON.parse(savedLikes);
        }
      } catch (e) {
        console.error('Error loading liked properties:', e);
      }
      
      // Add touch event listeners
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      // Start slideshow for initial property
      if (props.properties.length > 0) {
        const propertyId = props.properties[0]?.id;
        if (propertyId) {
          startSlideshow(propertyId);
        }
      }
    });
    
    // Clean up intervals on unmount
    onBeforeUnmount(() => {
      // Remove touch event listeners
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // Clear all slideshows
      Object.keys(slideIntervals).forEach(propertyId => {
        stopSlideshow(Number(propertyId));
      });
    });
    
    return {
      currentPropertyIndex,
      currentImageIndices,
      likedProperties,
      instructionsDismissedState,
      getPropertyImages,
      formatPrice,
      truncateDescription,
      setCurrentImage,
      nextProperty,
      previousProperty,
      viewPropertyDetails,
      toggleLike,
      contactOwner,
      dismissInstructions,
      t
    };
  }
};
</script>

<style scoped>
.property-swipe-view {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
}

.property-cards {
  height: 100%;
  position: relative;
}

.property-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 10px;
  transition: transform 0.3s ease;
}

.property-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-image:hover {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #999;
}

.no-image i {
  font-size: 2rem;
  margin-bottom: 10px;
}

.image-indicators {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  z-index: 2;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator.active {
  background-color: white;
  transform: scale(1.2);
}

.property-type-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 2;
}

.price-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #ff4d4f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.95rem;
  z-index: 2;
}

.property-info {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.property-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
  cursor: pointer;
}

.property-title:hover {
  color: #ff4d4f;
}

.property-location {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
  color: #666;
  font-size: 0.9rem;
}

.property-location i {
  color: #ff4d4f;
}

.property-features {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 0.9rem;
}

.property-description {
  color: #666;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
}

.card-actions {
  display: flex;
  padding: 12px 16px;
  gap: 10px;
  border-top: 1px solid #eee;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.like-btn {
  flex: 0 0 48px;
  background-color: transparent;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
}

.like-btn.active {
  background-color: rgba(255, 77, 79, 0.1);
}

.view-btn {
  background-color: #f0f0f0;
  color: #333;
}

.view-btn:hover {
  background-color: #e0e0e0;
}

.contact-btn {
  background-color: #ff4d4f;
  color: white;
}

.contact-btn:hover {
  background-color: #ff6b6b;
}

/* Modern Vertical Navigation Controls */
.navigation-controls-vertical {
  position: fixed;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

.nav-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.nav-btn:hover {
  transform: scale(1.1);
  background-color: white;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.nav-indicator {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  margin-bottom: 5px;
}

/* Loading and Empty States */
.loading-overlay,
.empty-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f5f5f5;
  z-index: 20;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #ff4d4f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.empty-state i {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 15px;
}

.retry-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Swipe Instructions */
.swipe-instructions {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30;
}

.instruction-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 300px;
  text-align: center;
}

.instruction-content h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.instruction-actions {
  margin: 20px 0;
}

.instruction-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0;
}

.instruction-item i {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #ff4d4f;
}

.dismiss-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (min-width: 768px) {
  .property-card {
    max-width: 600px;
    margin: 10px auto;
    height: calc(100% - 20px);
  }
  
  .navigation-controls-vertical {
    right: 25px;
  }
}

@media (max-width: 480px) {
  .navigation-controls-vertical {
    right: 10px;
  }
  
  .nav-btn {
    width: 42px;
    height: 42px;
  }
}
</style>

