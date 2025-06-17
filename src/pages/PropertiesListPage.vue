<template>
  <div class="properties-list-page">
   <header class="page-header">
     <div class="container">
       <div class="header-content" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
         <h1 class="page-title">{{ pageTitle }}</h1>
         <button 
           class="filter-toggle"
           @click="toggleFilters"
         >
           <i class="fas fa-filter"></i>
           <span class="d-none d-sm-inline">{{ t('filters.filters') }}</span>
           <i :class="showFilters ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
         </button>
       </div>
     </div>
   </header>
  
   <div class="container main-container py-5">
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
  
     <!-- Properties Grid -->
     <div class="properties-content">
       <div v-if="loading" class="loading-state">
         <div class="spinner"></div>
         <p>{{ t('common.loading') }}</p>
       </div>
  
       <div v-else-if="error" class="error-state">
         <i class="fas fa-exclamation-circle"></i>
         <p>{{ error }}</p>
         <button @click="fetchProperties" class="retry-button">
           <i class="fas fa-redo"></i>
           {{ t('common.retry') }}
         </button>
       </div>
  
       <div v-else-if="properties.length === 0" class="empty-state">
         <i class="fas fa-search"></i>
         <h3>{{ t('propertiesList.noPropertiesFound') }}</h3>
         <p>{{ t('propertiesList.tryAdjustingFilters') }}</p>
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
             <span>{{ t('propertiesList.loadMore') }}</span>
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
  import { ref, reactive, computed, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useTranslation } from '../locales';
  import { getProperties, getFilterOptions } from '../services/api';
  import FilterSection from '../components/FilterSection.vue';
  import PropertyCard from '../components/PropertyCard.vue';
  import QuickNavigation from '../components/QuickNavigation.vue';
  
import "@/assets/css/pages/PropertiesList.css"

  export default {
  name: 'PropertiesListPage',
  components: {
   FilterSection,
   PropertyCard,
   QuickNavigation
  },
  props: {
   type: {
     type: String,
     default: ''
   }
  },
  setup(props) {
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
     type: props.type || '',
     priceRange: null,
     province: null,
     district: null,
     commune: null,
     amenities: [],
     sort: 'newest'
   });
  
   const pageTitle = computed(() => {
     if (props.type) {
       return t(`propertyTypes.${props.type}`);
     }
     return t('propertiesList.title');
   });
  
   const toggleFilters = () => {
     showFilters.value = !showFilters.value;
   };
  
   const handleFilterUpdate = (newFilters) => {
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
  
   const loadMoreProperties = () => {
     page.value++;
     fetchProperties();
   };
  
   const viewProperty = (id) => {
     router.push({ 
       name: 'PropertyDetails', 
       params: { id: id.toString() } 
     });
   };
  
   onMounted(async () => {
     await fetchFilterOptions();
     
     // Initialize filters from URL query params
     const queryParams = route.query;
     Object.keys(filters).forEach(key => {
       if (queryParams[key]) {
         if (key === 'amenities') {
           filters[key] = Array.isArray(queryParams[key])
             ? queryParams[key].map(Number)
             : [Number(queryParams[key])];
         } else {
           filters[key] = queryParams[key];
         }
       }
     });
  
     if (props.type) {
       filters.type = props.type;
     }
     
     fetchProperties(true);
   });
  
   // Watch for route changes
   watch(() => props.type, (newType) => {
     if (newType !== filters.type) {
       filters.type = newType || '';
       page.value = 1;
       fetchProperties(true);
     }
   });
  
   return {
     showFilters,
     filterOptions,
     filters,
     loading,
     loadingFilters,
     error,
     properties,
     hasMoreProperties,
     pageTitle,
     toggleFilters,
     handleFilterUpdate,
     loadMoreProperties,
     viewProperty,
     t
   };
  }
  };
  </script>
  
  <style scoped>
  
  </style>
  
  