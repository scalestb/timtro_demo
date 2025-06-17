<template>
  <div class="property-card" :class="{ 'loading': isLoading }" @click="handleClick">
    <!-- Top Row: Title and Status -->
    <div class="header-row">
      <h3 class="property-title">{{ property.title }}</h3>
      <div :class="['status-badge', property.status]">
        {{ formatStatus(property.status) }}
      </div>
    </div>
  
    <!-- Second Row: Costs -->
    <div class="costs-row">
      <div class="cost-item main-cost">
        <i class="fas fa-money-bill"></i>
        <div class="cost-content">
          <span class="cost-label">Giá thuê</span>
          <span class="cost-value">{{ formatPrice(property.fees.monthlyRent) }}</span>
        </div>
      </div>
      <div class="cost-item">
        <i class="fas fa-bolt"></i>
        <div class="cost-content">
          <span class="cost-label">Điện</span>
          <span class="cost-value">{{ formatPrice(property.fees.electricityPrice) }}/kWh</span>
        </div>
      </div>
      <div class="cost-item">
        <i class="fas fa-water"></i>
        <div class="cost-content">
          <span class="cost-label">Nước</span>
          <span class="cost-value">{{ formatPrice(property.fees.waterPrice) }}/tháng</span>
        </div>
      </div>
    </div>
  
    <!-- Third Row: Basic Info -->
    <div class="info-row">
      <div class="info-item">
        <i class="fas fa-ruler-combined"></i>
        <div class="info-content">
          <span class="info-label">Diện tích</span>
          <span class="info-value">{{ property.basicInfo.area }}m²</span>
        </div>
      </div>
      <div class="info-item">
        <i class="fas fa-bed"></i>
        <div class="info-content">
          <span class="info-label">Phòng ngủ</span>
          <span class="info-value">{{ property.basicInfo.bedrooms || '-' }}</span>
        </div>
      </div>
      <div class="info-item">
        <i class="fas fa-bath"></i>
        <div class="info-content">
          <span class="info-label">Phòng tắm</span>
          <span class="info-value">{{ property.basicInfo.bathrooms || '-' }}</span>
        </div>
      </div>
    </div>
  
    <!-- Fourth Row: Amenities and Image -->
    <div class="bottom-row">
      <div class="amenities-section">
        <div class="amenities-list">
          <div 
            v-for="amenity in property.amenities" 
            :key="amenity.id"
            class="amenity-tag"
          >
            <i :class="amenity.icon"></i>
            <span>{{ amenity.name }}</span>
          </div>
        </div>
      </div>
      <div class="image-section">
        <img 
          :src="property.images[0]" 
          :alt="property.title"
          class="property-image"
          @error="handleImageError"
          loading="lazy"
        />
        <button 
          class="copy-button"
          @click.stop="copyToClipboard"
          :class="{ 'copied': copied }"
          :aria-label="copied ? 'Đã sao chép' : 'Sao chép liên kết'"
        >
          <i class="fas" :class="copied ? 'fa-check' : 'fa-link'"></i>
        </button>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
  name: 'PropertyCard',
  props: {
    property: {
      type: Object,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const copied = ref(false);
  
    const formatPrice = (price) => {
      if (!price) return 'Liên hệ';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    };
  
    const formatStatus = (status) => {
      const statusMap = {
        'FOR_RENT': 'Đạt chuẩn Golden Home',
        'RENTED': 'Đã cho thuê',
        'EXPIRED': 'Hết hạn'
      };
      return statusMap[status] || status;
    };
  
    const copyToClipboard = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      try {
        await navigator.clipboard.writeText(window.location.origin + '/property/' + props.property.id);
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };
  
    const handleImageError = (event) => {
      event.target.src = '/placeholder.svg?height=200&width=300';
    };
  
    const handleClick = (e) => {
      e.preventDefault();
      emit('click');
    };
  
    return {
      copied,
      formatPrice,
      formatStatus,
      copyToClipboard,
      handleImageError,
      handleClick
    };
  }
  };
  </script>
  
  <style scoped>
  .property-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #e2e8f0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .property-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
  
  /* Header Row */
  .header-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .property-title {
    flex: 1;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    background: #dcfce7;
    color: #16a34a;
    white-space: nowrap;
  }
  /* Thêm màu cho status */
  .FOR_RENT{
    color: #16a34a;
    background-color: #dcfce7;
  }

  .RENTED{
    color: #102cc9;
    background-color: #85c5d4;
  }

  .EXPIRED{
    color: #000000;
    background-color: #7f7d82;
  }


  /* Costs Row */
  .costs-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .cost-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 8px;
    font-size: 0.75rem;
  }
  
  .cost-item i {
    font-size: 0.875rem;
    color: var(--bs-primary);
    width: 16px;
    text-align: center;
  }
  
  .cost-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }
  
  .cost-label {
    font-size: 0.65rem;
    color: #64748b;
  }
  
  .cost-value {
    font-weight: 500;
    color: #1a1a1a;
  }
  
  .main-cost {
    background: rgba(153, 204, 255, 0.1);
  }
  
  .main-cost .cost-value {
    font-weight: 600;
    color: var(--bs-primary);
  }
  
  /* Info Row */
  .info-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 8px;
    font-size: 0.75rem;
  }
  
  .info-item i {
    font-size: 0.875rem;
    color: var(--bs-primary);
    width: 16px;
    text-align: center;
  }
  
  .info-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }
  
  .info-label {
    font-size: 0.65rem;
    color: #64748b;
  }
  
  .info-value {
    font-weight: 500;
    color: #1a1a1a;
  }
  
  /* Bottom Row */
  .bottom-row {
    display: flex;
    gap: 1rem;
    min-height: 100px;
  }
  
  .amenities-section {
    flex: 1;
    min-width: 0;
  }
  
  .amenities-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }
  
  .amenity-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: #f8fafc;
    border-radius: 100px;
    font-size: 0.7rem;
    color: #64748b;
    white-space: nowrap;
  }
  
  .amenity-tag i {
    font-size: 0.75rem;
    color: var(--bs-primary);
  }
  
  .image-section {
    position: relative;
    width: 120px;
    min-width: 120px;
    height: 100px;
  }
  
  .property-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .copy-button {
    position: absolute;
    top: 0.375rem;
    right: 0.375rem;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(4px);
  }
  
  .copy-button:hover {
    transform: scale(1.1);
  }
  
  .copy-button.copied {
    color: #16a34a;
  }
  
  /* Loading State */
  .loading {
    opacity: 0.7;
    pointer-events: none;
  }
  

  /* Responsive Design */
  @media (max-width: 640px) {
    .property-card {
      padding: 0.75rem;
      gap: 0.625rem;
    }
  
    .costs-row,
    .info-row {
      gap: 0.375rem;
    }
  
    .cost-item,
    .info-item {
      padding: 0.375rem;
    }
  
    .bottom-row {
      flex-direction: column;
      gap: 0.75rem;
    }
  
    .image-section {
      width: 100%;
      height: 160px;
      min-width: 0;
      order: -1;
    }
  
    .amenities-list {
      margin-top: -0.25rem;
    }
  }
  
  @media (min-width: 768px) {
    .property-card {
      padding: 1rem;
    }
  
    .image-section {
      width: 140px;
      height: 120px;
    }
  }
  </style>
  
  