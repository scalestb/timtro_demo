<template>
  <section class="property-section mb-5">
    <h2 class="mb-3">{{ title }}</h2>
    <div class="property-grid">
      <div v-for="property in properties" :key="property.id">
        <PropertyCard 
          :property="property" 
          @click="$emit('view-details', property.id)"
        />
      </div>
    </div>
    <div v-if="properties.length > limit" class="view-more">
      <router-link 
        :to="{ name: 'PropertiesSearch', query: { type: type } }" 
        class="btn btn-primary"
      >
        {{ t('propertySection.viewMore') }}
      </router-link>
    </div>
  </section>
  </template>
  
  <script>
  import PropertyCard from './PropertyCard.vue';
  import { useTranslation } from '../locales';
  
  export default {
   name: 'PropertySection',
   components: {
     PropertyCard
   },
   props: {
     title: {
       type: String,
       required: true
     },
     properties: {
       type: Array,
       required: true
     },
     type: {
       type: String,
       required: true
     },
     limit: {
       type: Number,
       default: Infinity
     }
   },
   emits: ['view-details'],
   setup() {
     const { t } = useTranslation();
     return { t };
   }
  };
  </script>
  
  <style scoped>
  .property-section {
   margin-bottom: 1rem;
  }
  
  .property-grid {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
   gap: 0.5rem;
  }
  
  @media (min-width: 768px) {
   .property-grid {
     gap: 0.75rem;
   }
  }
  
  @media (max-width: 640px) {
   .property-grid {
     grid-template-columns: 1fr;
     gap: 0.5rem;
   }
  }
  </style>
  
  