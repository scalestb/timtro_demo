<template>
  <div class="search-results-page">
    <header class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">{{ t('searchResults.title') }}</h1>
          <p class="results-count">
            {{ t('searchResults.showing', { count: properties.length }) }}
          </p>
        </div>
      </div>
    </header>
  
    <div class="container py-5">
      <!-- Filter Toggle -->
      <button 
        class="filter-toggle"
        @click="toggleFilters"
      >
        <i class="fas fa-filter"></i>
        <span>{{ t('filters.filters') }}</span>
        <i :class="showFilters ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </button>
  
      <!-- Filters Section -->
      <div 
        class="filters-panel"
        :class="{ show: showFilters }"
      >
        <FilterSection
          :filter-options="filterOptions"
          :initial-filters="filters"
          :loading="loadingFilters"
          @update:filters="handleFilterUpdate"
        />
      </div>
  
      <!-- Search Results -->
      <div class="search-results">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>{{ t('common.loading') }}</p>
        </div>
  
        <div v-else-if="error" class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>{{ error }}</p>
          <button @click="retrySearch" class="retry-button">
            <i class="fas fa-redo"></i>
            {{ t('common.retry') }}
          </button>
        </div>
  
        <div v-else-if="properties.length === 0" class="empty-state">
          <i class="fas fa-search"></i>
          <h3>{{ t('searchResults.noResults') }}</h3>
          <p>{{ t('searchResults.tryAnotherSearch') }}</p>
        </div>
  
        <div v-else>
          <div class="properties-grid">
            <PropertyCard 
              v-for="property in properties" 
              :key="property.id" 
              :property="property"
              @click="viewProperty(property.id)"
            />
          </div>
  
          <div 
            v-if="hasMoreProperties" 
            class="load-more"
          >
            <button 
              class="load-more-button"
              @click="loadMoreProperties"
              :disabled="loading"
            >
              <span>{{ t('searchResults.loadMore') }}</span>
              <i class="fas fa-arrow-down"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  
    <QuickNavigation :is-fixed="true" />
  </div>
  </template>
  
  <script>
  import { ref, reactive, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useTranslation } from '../locales';
  import { getProperties, getFilterOptions } from '../services/api';
  import FilterSection from '../components/FilterSection.vue';
  import PropertyCard from '../components/PropertyCard.vue';
  import QuickNavigation from '../components/QuickNavigation.vue';
  
  export default {
  name: 'SearchResultsPage',
  components: {
    FilterSection,
    PropertyCard,
    QuickNavigation
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { t } = useTranslation();
  
    const showFilters = ref(false);
    const filterOptions = ref({});
    const loading = ref(true);
    const loadingFilters = ref(true);
    const error = ref(null);
  
    const properties = ref([]);
    const page = ref(1);
    const hasMoreProperties = ref(true);
  
    const filters = reactive({
      q: '',
      type: null,
      priceRange: null,
      province: null,
      district: null,
      commune: null,
      amenities: [],
      sort: 'newest'
    });
  
    const toggleFilters = (e) => {
      e.preventDefault();
      showFilters.value = !showFilters.value;
    };
  
    const handleFilterUpdate = (newFilters, e) => {
      if (e) e.preventDefault();
      Object.assign(filters, newFilters);
      page.value = 1;
      fetchProperties(true);
      
      router.push({
        query: {
          ...route.query,
          ...newFilters
        }
      });
    };
  
    const fetchFilterOptions = async () => {
      try {
        loadingFilters.value = true;
        const options = await getFilterOptions();
        filterOptions.value = options;
      } catch (err) {
        console.error('Error fetching filter options:', err);
        error.value = t('common.error');
      } finally {
        loadingFilters.value = false;
      }
    };
  
    const fetchProperties = async (resetList = false) => {
      try {
        loading.value = true;
        error.value = null;
        
        const result = await getProperties({
          ...filters,
          page: page.value,
          pageSize: 12
        });
  
        if (resetList) {
          properties.value = result.properties;
        } else {
          properties.value = [...properties.value, ...result.properties];
        }
        hasMoreProperties.value = result.hasMore;
      } catch (err) {
        console.error('Error fetching properties:', err);
        error.value = t('common.error');
      } finally {
        loading.value = false;
      }
    };
  
    const loadMoreProperties = (e) => {
      e.preventDefault();
      page.value++;
      fetchProperties();
    };
  
    const viewProperty = (id) => {
      router.push({ 
        name: 'PropertyDetails', 
        params: { id: id.toString() } 
      });
    };
  
    const retrySearch = () => {
      page.value = 1;
      fetchProperties(true);
    };
  
    // Watch for route query changes
    watch(() => route.query, (newQuery) => {
      if (newQuery.q !== filters.q) {
        filters.q = newQuery.q || '';
        page.value = 1;
        fetchProperties(true);
      }
    }, { immediate: true });
  
    // Initial setup
    fetchFilterOptions();
  
    return {
      showFilters,
      filterOptions,
      filters,
      loading,
      loadingFilters,
      error,
      properties,
      hasMoreProperties,
      toggleFilters,
      handleFilterUpdate,
      loadMoreProperties,
      viewProperty,
      retrySearch,
      t
    };
  }
  };
  </script>
  
  <style scoped>
  .search-results-page {
    min-height: 100vh;
    background-color: #f8fafc;
    padding-bottom: 80px;
  }
  
  .page-header {
    background: white;
    padding: 1rem 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    z-index: 10;
  }
  
  .header-content {
    text-align: center;
  }
  
  .page-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #1a1a1a;
  }
  
  .results-count {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }
  
  .filter-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    color: #1a1a1a;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .filter-toggle:hover {
    background: #f8fafc;
  }
  
  .filters-panel {
    margin-top: 1rem;
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease;
  }
  
  .filters-panel.show {
    height: auto;
  }
  
  .search-results {
    margin-top: 2rem;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    text-align: center;
    padding: 4rem 0;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--bs-primary);
    border-radius: 50%;
    margin: 0 auto 1rem;
    animation: spin 1s linear infinite;
  }
  
  .error-state i,
  .empty-state i {
    font-size: 3rem;
    color: #64748b;
    margin-bottom: 1rem;
  }
  
  .retry-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--bs-primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 1rem;
  }
  
  .retry-button:hover {
    background: #7ab8ff;
    transform: translateY(-1px);
  }
  
  .properties-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .load-more {
    text-align: center;
  }
  
  .load-more-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 2rem;
    background: var(--bs-primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .load-more-button:hover {
    background: #7ab8ff;
    transform: translateY(-1px);
  }
  
  .load-more-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .page-header {
      top: 56px;
    }
  
    .properties-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .properties-content {
      padding-top: 72px;
    }
  }
  </style>
  
  