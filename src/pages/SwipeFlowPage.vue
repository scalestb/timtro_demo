<template>
  <div class="swipe-flow-page">
    <div class="header-bar">
      <button class="back-btn" @click="navigateTo('Home')">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1 class="page-title">{{ t('swipeFlow.title') }}</h1>
    </div>
    
    <div class="property-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('swipeFlow.loading') }}</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="properties.length === 0" class="empty-state">
        <i class="fas fa-home"></i>
        <p>{{ t('swipeFlow.noProperties') }}</p>
        <button class="retry-btn" @click="fetchProperties">
          {{ t('swipeFlow.retry') }}
        </button>
      </div>
      
      <!-- Property Cards -->
      <div v-else class="property-cards">
        <div 
          v-for="(property, index) in properties" 
          :key="property.id"
          class="property-card"
          :class="{ 'active': currentIndex === index }"
          v-show="index === currentIndex"
        >
          <!-- Property Image -->
          <div class="property-image-container" @click="viewPropertyDetails(property.id)">
            <img 
              v-if="property.images && property.images.length > 0" 
              :src="property.images[0]" 
              alt="Property image" 
              class="property-image"
            />
            <div v-else class="no-image">
              <i class="fas fa-home"></i>
              <p>{{ t('swipeFlow.noImage') }}</p>
            </div>
            
            <!-- Property Price Badge -->
            <div class="price-badge">
              {{ formatPrice(property.fees.monthlyRent) }}
            </div>
          </div>
          
          <!-- Property Info -->
          <div class="property-info" @click="viewPropertyDetails(property.id)">
            <h2 class="property-title">{{ property.title }}</h2>
            
            <!-- Replace property-location with property details -->
            <div class="property-details">
              <div class="detail-item" v-if="property.price">
                <i class="fas fa-tag"></i>
                <span>{{ formatPrice(property.price) }}</span>
              </div>
              <div class="detail-item" v-if="property.type">
                <i class="fas fa-home"></i>
                <span>{{ t(`propertyTypes.${property.type}`) }}</span>
              </div>
              <div class="detail-item" v-if="property.area">
                <i class="fas fa-vector-square"></i>
                <span>{{ property.area }}m²</span>
              </div>
            </div>
            
            <!-- Advertisement Banner -->
            <div v-if="loadingAd" class="ad-banner-loading">
              <div class="spinner-sm"></div>
              <span>{{ t('common.loading') }}</span>
            </div>
            
            <div v-else-if="adError" class="ad-banner-error">
              <i class="fas fa-exclamation-circle"></i>
              <span>{{ t('swipeFlow.adError') }}</span>
            </div>
            
            <div v-else-if="!adData" class="ad-banner-empty">
              <!-- Empty state - no ad available -->
            </div>
            
            <div v-else class="ad-banner">
              <div class="ad-label">{{ t('swipeFlow.advertisement') }}</div>
              <div class="ad-content">
                <img :src="adData.image" :alt="adData.title" class="ad-image">
                <div class="ad-text">
                  <p>{{ adData.title }}</p>
                  <button class="ad-button" @click.stop="openAdLink(adData.url)">
                    {{ t('banner.learnMore') }}
                  </button>
                </div>
              </div>
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
            </div>
            
            <p class="property-description">
              {{ truncateDescription(property.description) }}
            </p>
          </div>
          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="action-btn view-btn" @click="viewPropertyDetails(property.id)">
              <i class="fas fa-info-circle"></i>
              {{ t('swipeFlow.viewDetails') }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modern Vertical Navigation Controls -->
      <div v-if="properties.length > 0" class="navigation-controls-vertical">
        <div class="nav-indicator">
          {{ currentIndex + 1 }} / {{ properties.length }}
        </div>
        <button 
          class="nav-btn prev-btn" 
          @click="previousProperty"
          :disabled="currentIndex === 0"
          aria-label="Previous property"
        >
          <i class="fas fa-chevron-up"></i>
        </button>
        <button 
          class="nav-btn next-btn" 
          @click="nextProperty"
          :disabled="currentIndex === properties.length - 1 && !hasMore"
          aria-label="Next property"
        >
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
    </div>
    
    <QuickNavigation :is-fixed="true" />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getProperties, fetchSwipeFlowAds } from '../services/api';
import QuickNavigation from '../components/QuickNavigation.vue';
import { useTranslation } from '../locales';

export default {
  name: 'SwipeFlowPage',
  components: {
    QuickNavigation
  },
  setup() {
    const { t } = useTranslation();
    const router = useRouter();
    const properties = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const currentIndex = ref(0);
    const page = ref(1);
    const hasMore = ref(true);
    
    // Advertisement state
    const adData = ref(null);
    const loadingAd = ref(true);
    const adError = ref(null);
    
    const fetchProperties = async (resetList = true) => {
      try {
        loading.value = true;
        error.value = null;
        
        if (resetList) {
          page.value = 1;
          properties.value = [];
          currentIndex.value = 0;
        }
        
        console.log('Fetching properties, page:', page.value);
        
        const result = await getProperties({
          page: page.value,
          pageSize: 10,
          sort: 'newest'
        });
        
        console.log('API response:', result);
        
        if (resetList) {
          properties.value = result.properties || [];
        } else {
          properties.value = [...properties.value, ...(result.properties || [])];
        }
        
        hasMore.value = result.hasMore || false;
      } catch (err) {
        console.error('Error fetching properties:', err);
        error.value = t('swipeFlow.errorLoading');
      } finally {
        loading.value = false;
      }
    };
    
    const fetchAdvertisement = async () => {
      try {
        loadingAd.value = true;
        adError.value = null;
        
        const result = await fetchSwipeFlowAds();
        adData.value = result.ad || null;
        
        console.log('Fetched advertisement:', adData.value);
      } catch (err) {
        console.error('Error fetching advertisement:', err);
        adError.value = t('swipeFlow.adError');
      } finally {
        loadingAd.value = false;
      }
    };
    
    const loadMoreProperties = async () => {
      if (!hasMore.value || loading.value) return;
      
      page.value++;
      await fetchProperties(false);
    };
    
    const nextProperty = () => {
      if (currentIndex.value < properties.value.length - 1) {
        currentIndex.value++;
      } else if (hasMore.value) {
        loadMoreProperties();
      }
    };
    
    const previousProperty = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      }
    };
    
    const viewPropertyDetails = (propertyId) => {
      router.push({
        name: 'PropertyDetails',
        params: { id: propertyId.toString() }
      });
    };
    
    const contactOwner = (propertyId) => {
      router.push({
        name: 'PropertyDetails',
        params: { id: propertyId.toString() },
        hash: '#contact'
      });
    };
    
    const navigateTo = (routeName) => {
      router.push({ name: routeName });
    };
    
    const formatPrice = (price) => {
      if (!price) return '';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price);
    };
    
    const truncateDescription = (description) => {
      if (!description) return '';
      return description.length > 300 
        ? description.substring(0, 300) + '...' 
        : description;
    };
    
    const openAdLink = (url) => {
      if (!url) return;
      
      // Add https:// if missing
      let fullUrl = url;
      if (url && !url.startsWith('http')) {
        fullUrl = `https://${url}`;
      }
      
      window.open(fullUrl, '_blank');
    };
    
    // Watch for changes in currentIndex to load more properties if needed
    watch(currentIndex, (newIndex) => {
      if (newIndex === properties.value.length - 1 && hasMore.value && !loading.value) {
        loadMoreProperties();
      }
    });
    
    onMounted(() => {
      console.log('SwipeFlowPage mounted');
      fetchProperties();
      fetchAdvertisement();
    });
    
    return {
      properties,
      loading,
      error,
      currentIndex,
      hasMore,
      adData,
      loadingAd,
      adError,
      fetchProperties,
      nextProperty,
      previousProperty,
      viewPropertyDetails,
      contactOwner,
      navigateTo,
      formatPrice,
      truncateDescription,
      openAdLink,
      t
    };
  }
};
</script>

<style scoped>
.swipe-flow-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.header-bar {
  height: 56px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 10px;
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
}

.property-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  padding-bottom: 60px; /* Space for QuickNavigation */
}

.loading-state,
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
  padding: 20px;
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

.spinner-sm {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top: 2px solid #ff4d4f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
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
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
}

.property-image-container {
  position: relative;
  height: 40%;
  overflow: hidden;
  cursor: pointer;
}

.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.price-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #ff4d4f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
}

.property-info {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  cursor: pointer;
}

.property-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #333;
}

.property-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.detail-item i {
  color: #ff4d4f;
}

/* Advertisement Banner */
.ad-banner {
  margin: 15px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  position: relative;
}

.ad-banner-loading,
.ad-banner-error,
.ad-banner-empty {
  margin: 15px 0;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  color: #666;
  font-size: 0.9rem;
}

.ad-banner-error i {
  color: #ff4d4f;
  margin-right: 8px;
}

.ad-label {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-bottom-left-radius: 4px;
  z-index: 1;
}

.ad-content {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.ad-image {
  width: 40%;
  height: 80px;
  object-fit: cover;
}

.ad-text {
  flex: 1;
  padding: 10px;
  text-align: center;
}

.ad-text p {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.ad-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.ad-button:hover {
  background-color: #ff7875;
}

.property-features {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

.property-description {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.action-buttons {
  display: flex;
  padding: 10px 15px;
  gap: 10px;
  border-top: 1px solid #eee;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

.view-btn {
  background-color: #f0f0f0;
  color: #333;
}

.contact-btn {
  background-color: #ff4d4f;
  color: white;
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
  
  .ad-content {
    flex-direction: column;
  }
  
  .ad-image {
    width: 100%;
    height: 60px;
  }
}
</style>

