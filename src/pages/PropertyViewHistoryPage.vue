<template>
  <div class="property-view-history-page">
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>{{ t('viewHistory.title') }}</h1>
          <div class="header-stats">
            <div class="stat-item">
              <i class="fas fa-eye"></i>
              <span>{{ t('viewHistory.totalViews', { count: sortedViewHistory.length }) }}</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-calendar"></i>
              <span>{{ t('viewHistory.lastViewed', { time: getLastViewedTime() }) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div class="container py-4">
      <div class="toolbar mb-4">
        <div class="search-box" v-if="sortedViewHistory.length">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="t('viewHistory.searchPlaceholder')"
            class="search-input"
          >
        </div>
        
        <button 
          v-if="sortedViewHistory.length"
          @click="confirmClearHistory" 
          class="clear-button"
        >
          <i class="fas fa-trash-alt"></i>
          {{ t('viewHistory.clearHistory') }}
        </button>
      </div>
  
      <transition-group 
        name="history-list" 
        tag="div" 
        class="history-grid"
      >
        <div 
          v-for="item in filteredHistory" 
          :key="item.id" 
          class="history-card"
          :class="{ 'fade-out': isDeleting === item.id }"
        >
          <div class="card-header">
            <div class="time-badge">
              <i class="fas fa-clock"></i>
              {{ formatTimeAgo(item.viewedAt) }}
            </div>
            <div class="card-actions">
              <button 
                @click="removeFromHistory(item.id)"
                class="action-button delete-button"
                :title="t('viewHistory.removeItem')"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
  
          <div class="card-body" @click="goToProperty(item.id)">
            <h3 class="property-title">{{ item.title }}</h3>
            <p class="property-location">
              <i class="fas fa-map-marker-alt"></i>
              {{ item.address }}
            </p>
            <div class="view-details">
              <span>{{ t('common.viewDetails') }}</span>
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
  
        <div 
          v-if="sortedViewHistory.length === 0" 
          key="empty-state" 
          class="empty-state"
        >
          <div class="empty-state-content">
            <i class="fas fa-history"></i>
            <h2>{{ t('viewHistory.noHistory') }}</h2>
            <p>{{ t('viewHistory.startBrowsing') }}</p>
            <button @click="goToHome" class="browse-button">
              {{ t('viewHistory.browseProperies') }}
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useTranslation } from '../locales';
  
  export default {
  name: 'PropertyViewHistoryPage',
  setup() {
    const router = useRouter();
    const { t } = useTranslation();
    const viewHistory = ref([]);
    const searchQuery = ref('');
    const isDeleting = ref(null);
  
    const loadViewHistory = () => {
      const history = localStorage.getItem('propertyViewHistory');
      if (history) {
        viewHistory.value = JSON.parse(history);
      }
    };
  
    const sortedViewHistory = computed(() => {
      return [...viewHistory.value].sort((a, b) => b.viewedAt - a.viewedAt);
    });
  
    const filteredHistory = computed(() => {
      if (!searchQuery.value) return sortedViewHistory.value;
      
      const query = searchQuery.value.toLowerCase();
      return sortedViewHistory.value.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.address.toLowerCase().includes(query)
      );
    });
  
    const saveHistory = () => {
      localStorage.setItem('propertyViewHistory', JSON.stringify(viewHistory.value));
    };
  
    const removeFromHistory = async (id) => {
      isDeleting.value = id;
      await new Promise(resolve => setTimeout(resolve, 300)); // Animation delay
      viewHistory.value = viewHistory.value.filter(item => item.id !== id);
      saveHistory();
      isDeleting.value = null;
    };
  
    const confirmClearHistory = () => {
      if (confirm(t('viewHistory.confirmClear'))) {
        localStorage.removeItem('propertyViewHistory');
        viewHistory.value = [];
      }
    };
  
    const goToProperty = (id) => {
      router.push({ name: 'PropertyDetails', params: { id } });
    };
  
    const goToHome = () => {
      router.push({ name: 'Home' });
    };
  
    const formatTimeAgo = (timestamp) => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
      };
  
      for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
          return t(`viewHistory.timeAgo.${unit}`, { count: interval });
        }
      }
  
      return t('viewHistory.timeAgo.justNow');
    };
  
    const getLastViewedTime = () => {
      if (sortedViewHistory.value.length === 0) return t('viewHistory.never');
      return formatTimeAgo(sortedViewHistory.value[0].viewedAt);
    };
  
    onMounted(loadViewHistory);
  
    return {
      sortedViewHistory,
      filteredHistory,
      searchQuery,
      isDeleting,
      removeFromHistory,
      confirmClearHistory,
      goToProperty,
      goToHome,
      formatTimeAgo,
      getLastViewedTime,
      t
    };
  }
  };
  </script>
  
  <style scoped>
  .property-view-history-page {
    min-height: 100vh;
    background-color: #f8f9fa;
  }
  
  .page-header {
    background: linear-gradient(135deg, var(--bs-primary) 0%, #7ab8ff 100%);
    padding: 3rem 0;
    color: white;
    margin-bottom: 2rem;
  }
  
  .header-content {
    text-align: center;
  }
  
  .header-content h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  
  .header-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stat-item i {
    font-size: 1.25rem;
  }
  
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  .search-box {
    position: relative;
    flex: 1;
    max-width: 400px;
  }
  
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 3px rgba(153, 204, 255, 0.25);
  }
  
  .clear-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    background-color: #dc3545;
    color: white;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .clear-button:hover {
    background-color: #c82333;
    transform: translateY(-1px);
  }
  
  .history-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
  }
  
  .history-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }
  
  .history-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
  
  .card-header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
  }
  
  .time-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-size: 0.875rem;
  }
  
  .card-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .action-button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: #6c757d;
    transition: all 0.2s ease;
  }
  
  .action-button:hover {
    background-color: #f8f9fa;
    color: #dc3545;
  }
  
  .card-body {
    padding: 1.5rem;
    cursor: pointer;
  }
  
  .property-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #1a1a1a;
  }
  
  .property-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  
  .view-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--bs-primary);
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 0;
  }
  
  .empty-state-content {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .empty-state i {
    font-size: 3rem;
    color: #6c757d;
    margin-bottom: 1.5rem;
  }
  
  .empty-state h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }
  
  .empty-state p {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }
  
  .browse-button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    background-color: var(--bs-primary);
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .browse-button:hover {
    background-color: #7ab8ff;
    transform: translateY(-2px);
  }
  
  /* Animations */
  .history-list-enter-active,
  .history-list-leave-active {
    transition: all 0.3s ease;
  }
  
  .history-list-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .history-list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  .fade-out {
    opacity: 0;
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    .page-header {
      padding: 2rem 0;
    }
  
    .header-content h1 {
      font-size: 1.5rem;
    }
  
    .header-stats {
      flex-direction: column;
      gap: 1rem;
    }
  
    .toolbar {
      flex-direction: column;
    }
  
    .search-box {
      max-width: 100%;
    }
  
    .history-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
  
  