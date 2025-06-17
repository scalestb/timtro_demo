<template>
  <div class="property-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="goBack" class="btn-back">
        <i class="fas fa-arrow-left"></i>
        Quay lại
      </button>
    </div>

    <template v-if="!loading && !error">
      <!-- Header -->
      <header class="sticky-header">
        <div class="header-content">
          <button class="back-button" @click="goBack">
            <i class="fas fa-arrow-left"></i>
          </button>
          <button 
            class="share-button"
            @click="copyToClipboard"
            :class="{ 'copied': copied }"
          >
            <i class="fas" :class="copied ? 'fa-check' : 'fa-share-alt'"></i>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Images -->
        <section class="image-section">
          <ImageSlider :images="property.images" />
        </section>

        <!-- Basic Info -->
        <section class="info-section">
          <div class="status-row">
            <span :class="['status-tag', property.status]" >{{ formatStatus(property.status) }}</span>
            <span class="post-date">Đăng {{ formatTimeAgo(property.createdAt) }}</span>
          </div>
          <div class="status-row">
            <span :class="['status-tag', property.rankFPT]" >{{ formatStatus(property.rankFPT) }}</span>
          </div>

          <h1 class="property-title">{{ property.title }}</h1>
          
          <div class="price-row">
            <div class="main-price">
              <span class="amount">{{ formatPrice(property.fees.monthlyRent) }}</span>
              <span class="period">/tháng</span>
            </div>
            <div class="deposit">
              Đặt cọc: {{ formatPrice(property.fees.deposit) }}
            </div>
          </div>

          <div class="address-row">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ property.address }}</span>
          </div>
        </section>


        <section class="stats-section">
          <h2 class="section-title">Chứng nhận Golden Home</h2>
          <div class="stat-grid">
            <div class="stat-item">
              <i class="fas fa-check-circle"></i>
              <div class="stat-content">
                <span class="stat-label">Internet FPT</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-check-circle"></i>
              <div class="stat-content">
                <span class="stat-label">Camera An toàn</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-times-circle"></i>
              <div class="stat-content">
                <span class="stat-label">Quản lý phòng online</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-times-circle"></i>
              <div class="stat-content">
                <span class="stat-label">Smart Home</span>
              </div>
            </div>
          </div>
        </section>


        <!-- Quick Stats -->
        <section class="stats-section">
          <div class="stat-grid">
            <div class="stat-item">
              <i class="fas fa-ruler-combined"></i>
              <div class="stat-content">
                <span class="stat-value">{{ property.basicInfo.area }}m²</span>
                <span class="stat-label">Diện tích</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-bed"></i>
              <div class="stat-content">
                <span class="stat-value">{{ property.basicInfo.bedrooms || '-' }}</span>
                <span class="stat-label">Phòng ngủ</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-bath"></i>
              <div class="stat-content">
                <span class="stat-value">{{ property.basicInfo.bathrooms || '-' }}</span>
                <span class="stat-label">Phòng tắm</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-building"></i>
              <div class="stat-content">
                <span class="stat-value">{{ property.basicInfo.floorLevel || '-' }}</span>
                <span class="stat-label">Tầng</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Utilities & Fees -->
        <section class="fees-section">
          <h2 class="section-title">Chi phí & Tiện ích</h2>
          <div class="fees-grid">
            <div class="fee-item">
              <i class="fas fa-bolt"></i>
              <div class="fee-content">
                <span class="fee-label">Điện</span>
                <span class="fee-value">{{ formatPrice(property.fees.electricityPrice) }}/kWh</span>
              </div>
            </div>
            <div class="fee-item">
              <i class="fas fa-water"></i>
              <div class="fee-content">
                <span class="fee-label">Nước</span>
                <span class="fee-value">{{ formatPrice(property.fees.waterPrice) }}/tháng</span>
              </div>
            </div>
            <div class="fee-item">
              <i class="fas fa-wifi"></i>
              <div class="fee-content">
                <span class="fee-label">Internet</span>
                <span class="fee-value">{{ formatPrice(property.fees.internetFee) }}/tháng</span>
              </div>
            </div>
            <div class="fee-item">
              <i class="fas fa-broom"></i>
              <div class="fee-content">
                <span class="fee-label">Dọn dẹp</span>
                <span class="fee-value">{{ formatPrice(property.fees.cleaningFee) }}/tháng</span>
              </div>
            </div>
            <div class="fee-item">
              <i class="fas fa-motorcycle"></i>
              <div class="fee-content">
                <span class="fee-label">Giữ xe máy</span>
                <span class="fee-value">{{ formatPrice(property.fees.motorbikeParkingFee) }}/tháng</span>
              </div>
            </div>
            <div class="fee-item">
              <i class="fas fa-car"></i>
              <div class="fee-content">
                <span class="fee-label">Giữ ô tô</span>
                <span class="fee-value">{{ formatPrice(property.fees.carParking) }}/tháng</span>
              </div>
            </div>
            <div class="fee-item">
              <i class="fas fa-tasks"></i>
              <div class="fee-content">
                <span class="fee-label">Quản lý</span>
                <span class="fee-value">{{ formatPrice(property.fees.managementFee) }}/tháng</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Features & Amenities -->
        <section class="features-section">
          <h2 class="section-title">Tiện nghi có sẵn</h2>
          <div class="features-grid">
            <div 
              v-for="(amenities, category) in groupedAmenities" 
              :key="category" 
              class="feature-group"
            >
              <h3 class="feature-category">{{ category }}</h3>
              <div class="feature-items">
                <div 
                  v-for="amenity in amenities" 
                  :key="amenity.id"
                  class="feature-item"
                  :class="{ 'available': isAmenityAvailable(amenity) }"
                >
                  <i :class="amenity.icon"></i>
                  <span>{{ amenity.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Description -->
        <section class="description-section">
          <h2 class="section-title">Mô tả chi tiết</h2>
          <div class="description-content">
            {{ property.description }}
          </div>
        </section>

        <!-- Location -->
        <section class="location-section">
          <h2 class="section-title">Vị trí</h2>
          <div class="map-container">
            <GoogleMap 
              :lat="property.coordinates.lat" 
              :lng="property.coordinates.lng"
            />
          </div>
        </section>

        <!-- Similar Properties -->
        <section class="similar-section">
          <h2 class="section-title">Phòng tương tự</h2>
          <SimilarProperties 
            :property-type="property.type"
            :current-property-id="property.id"
          />
        </section>
      </main>

      <!-- Contact Footer -->
      <footer class="contact-footer">
        <div class="owner-info" style="border:1px solid #ddd;border-radius:6px;">
          <img 
            :src="property.owner.avatar || '/placeholder.svg?height=40&width=40'" 
            :alt="property.owner.name"
            class="owner-avatar"
          />
          <div class="owner-details">
            <span class="owner-name">{{ property.owner.name }}</span>
            <span class="owner-type">Chứng nhận bởi FPT Telecom</span>
          </div>
        </div>
        <div class="contact-actions">
          <!-- <a 
            :href="`tel:${property.owner.phone}`" 
            class="contact-button call-button"
          >
            <i class="fas fa-phone"></i>
            <span>{{ property.owner.phone }}</span>
          </a>
          <button 
            class="contact-button chat-button"
            @click="openCallbackForm"
          >
            <i class="fas fa-comment-alt"></i>
            <span>Nhắn tin</span>
          </button> -->
          <button class="contact-button chat-button"
            @click="openCallbackForm">
            <i class=""></i> Gửi yêu cầu xem phòng
          </button>
        </div>
      </footer>

      <!-- Callback Form Modal -->
      <div v-if="showCallbackForm" class="modal-overlay" @click="closeCallbackForm">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeCallbackForm">
            <i class="fas fa-times"></i>
          </button>
          <h3 class="modal-title">Gửi yêu cầu xem phòng</h3>
          <ContactCallbackForm 
            :property-id="property.id"
            @success="handleCallbackSuccess"
            @close="closeCallbackForm"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPropertyById, incrementPropertyViews } from '../services/api';
import ImageSlider from '../components/ImageSlider.vue';
import GoogleMap from '../components/GoogleMap.vue';
import SimilarProperties from '../components/SimilarProperties.vue';
import ContactCallbackForm from '../components/ContactCallbackForm.vue';

import "@/assets/css/pages/PropertyDetailsPage.css"

export default {
  name: 'PropertyDetailsPage',
  components: {
    ImageSlider,
    GoogleMap,
    SimilarProperties,
    ContactCallbackForm
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    // State
    const property = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const copied = ref(false);
    const showCallbackForm = ref(false);

    // Fetch property data
    const fetchProperty = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const result = await getPropertyById(route.params.id);
        if (result?.property) {
          property.value = result.property;
          saveToViewHistory(result.property);
          updateMetaTagSEO();
        } else {
          throw new Error('Không tìm thấy thông tin phòng');
        }
      } catch (err) {
        console.error('Error:', err);
        error.value = err.message || 'Đã có lỗi xảy ra';
      } finally {
        loading.value = false;
      }
    };

    // Save to view history
    const saveToViewHistory = (propertyData) => {
      const history = JSON.parse(localStorage.getItem('propertyViewHistory') || '[]');
      
      const historyItem = {
        id: propertyData.id,
        title: propertyData.title,
        address: propertyData.address,
        viewedAt: Date.now()
      };

      const existingIndex = history.findIndex(item => item.id === propertyData.id);
      if (existingIndex !== -1) {
        history[existingIndex] = historyItem;
      } else {
        history.push(historyItem);
      }

      if (history.length > 50) history.splice(0, history.length - 50);
      
      localStorage.setItem('propertyViewHistory', JSON.stringify(history));
    };

    // Increment view count
    const incrementViews = async () => {
      try {
        await incrementPropertyViews(route.params.id);
      } catch (err) {
        console.error('Error incrementing views:', err);
      }
    };

    // Format helpers
    const formatPrice = (price) => {
      if (price === null || price === undefined) return 'Liên hệ';
      if (price === 0) return 'Miễn phí';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    };

    const formatStatus = (status) => ({
      'FOR_RENT': 'Hi FPT đã xác thực địa điểm',
      'RENTED': 'Đã cho thuê',
      'EXPIRED': 'Hết hạn',

      'GOLD' : 'Đạt chuẩn Golden Home - FPT Telecom RSC'
    }[status] || status);

    const formatTimeAgo = (timestamp) => {
      const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);
      
      const intervals = {
        năm: 31536000,
        tháng: 2592000,
        tuần: 604800,
        ngày: 86400,
        giờ: 3600,
        phút: 60
      };

      for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
          return `${interval} ${unit} trước`;
        }
      }
      
      return 'Vừa xong';
    };

    // Group amenities by category
    const groupedAmenities = computed(() => {
      if (!property.value?.amenities) return {};
      
      return property.value.amenities.reduce((acc, amenity) => {
        const category = amenity.category || 'Khác';
        if (!acc[category]) acc[category] = [];
        acc[category].push(amenity);
        return acc;
      }, {});
    });

    const isAmenityAvailable = (amenity) => {
      return property.value.amenities.some(a => a.id === amenity.id);
    };

    // Actions
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copied.value = true;
        setTimeout(() => copied.value = false, 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    };

    const goBack = () => router.back();

    const openCallbackForm = () => {
      showCallbackForm.value = true;
    };

    const closeCallbackForm = () => {
      showCallbackForm.value = false;
    };

    const handleCallbackSuccess = () => {
      alert('Chúng tôi sẽ liên hệ lại với bạn sớm nhất!');
      closeCallbackForm();
    };

    
    const updateMetaTag = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
      if (element) {
        element.setAttribute('content', content)
      } else {
        element = document.createElement('meta')
        if (name.startsWith('og:')) {
          element.setAttribute('property', name)
        } else {
          element.setAttribute('name', name)
        }
        element.setAttribute('content', content)
        document.head.appendChild(element)
      }
    }

    const updateMetaTagSEO = () => {
      if (!property.value) return
      document.title = property.value.title || 'Chi tiết phòng'
      updateMetaTag('description', property.value.address || 'Thông tin phòng chi tiết')
      updateMetaTag('og:title', property.value.title || 'Chi tiết phòng')
      updateMetaTag('og:description', property.value.address || 'Thông tin phòng chi tiết')
      updateMetaTag('og:image', property.value.images?.[0] || '/default-og-image.png')
      updateMetaTag('og:url', window.location.href)
    }

    const copyCurrentUrl = () => {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl)
        .then(() => {
          alert('Link đã được sao chép!');
        })
        .catch(() => {
          alert('Không thể sao chép link!');
        });
    };

    // Lifecycle
    onMounted(() => {
      fetchProperty();
      incrementViews();
    });

    return {
      property,
      loading,
      error,
      copied,
      showCallbackForm,
      groupedAmenities,
      formatPrice,
      formatStatus,
      formatTimeAgo,
      isAmenityAvailable,
      copyToClipboard,
      goBack,
      openCallbackForm,
      closeCallbackForm,
      handleCallbackSuccess,
      copyCurrentUrl // Added this function to the return object
    };
  }
};
</script>