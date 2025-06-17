<template>
  <div class="similar-properties">
   <div v-if="loading" class="loading-state">
     <b-spinner variant="primary" :label="t('common.loading')"></b-spinner>
     <span class="ms-2">{{ t('similarProperties.loading') }}</span>
   </div>
  
   <div v-else-if="error" class="error-state">
     <i class="fas fa-exclamation-circle"></i>
     <p>{{ t('similarProperties.error') }}</p>
   </div>
  
   <div v-else-if="properties.length === 0" class="empty-state">
     <i class="fas fa-search"></i>
     <p>{{ t('similarProperties.noProperties') }}</p>
   </div>
  
   <div v-else class="properties-grid">
     <PropertyCard 
       v-for="property in properties" 
       :key="property.id" 
       :property="property" 
       @click="viewProperty(property.id)"
     />
   </div>
  
   <div v-if="properties.length > 0" class="view-more">
     <button 
       class="btn-view-more"
       @click="viewMoreSimilar"
     >
       {{ t('similarProperties.viewMore') }}
     </button>
   </div>
  </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useTranslation } from '../locales';
  import { getPropertiesByType } from '../services/api';
  import PropertyCard from './PropertyCard.vue';
  
  export default {
  name: 'SimilarProperties',
  props: {
   propertyType: {
     type: String,
     required: true,
   },
   currentPropertyId: {
     type: Number,
     required: true,
   },
  },
  components: {
   PropertyCard,
  },
  setup(props) {
   const properties = ref([]);
   const loading = ref(true);
   const error = ref(null);
   const router = useRouter();
   const { t } = useTranslation();
  
   const viewProperty = (id) => {
     router.push({ name: 'PropertyDetails', params: { id } });
   };
  
   const viewMoreSimilar = () => {
     router.push({ 
       name: 'PropertiesSearch', 
       query: { type: props.propertyType } 
     });
   };
  
   onMounted(async () => {
     try {
       loading.value = true;
       const result = await getPropertiesByType(props.propertyType, 1, 4);
       properties.value = result.properties.filter(p => p.id !== props.currentPropertyId);
     } catch (error) {
       console.error('Error fetching similar properties:', error);
       error.value = t('similarProperties.error');
     } finally {
       loading.value = false;
     }
   });
  
   return {
     properties,
     loading,
     error,
     viewProperty,
     viewMoreSimilar,
     t
   };
  },
  };
  </script>
  
  <style scoped>
  .similar-properties {
   position: relative;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
   text-align: center;
   padding: 2rem;
   color: #6c757d;
  }
  
  .error-state i,
  .empty-state i {
   font-size: 2rem;
   margin-bottom: 1rem;
  }
  
  .properties-grid {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
   gap: 1.5rem;
   margin-bottom: 1.5rem;
  }
  
  .view-more {
   text-align: center;
  }
  
  .btn-view-more {
   padding: 0.75rem 2rem;
   border: none;
   border-radius: 8px;
   background-color: var(--bs-primary);
   color: white;
   font-weight: 600;
   transition: all 0.3s ease;
  }
  
  .btn-view-more:hover {
   background-color: #7ab8ff;
   transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
   .properties-grid {
     grid-template-columns: 1fr;
   }
  }
  </style>
  
  