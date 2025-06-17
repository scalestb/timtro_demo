<template>
  <div class="filter-section p-3">
   <div class="filter-content">
     <!-- Property Type -->
     <div class="mb-4">
       <h3 class="h6 mb-3">{{ t('filters.propertyType') }}</h3>
       <div class="row g-2">
         <div 
           v-for="type in filterData.types"
           :key="type.id"
           class="col-6 col-md-4"
         >
           <button
             class="btn w-100"
             :class="[
               selectedType === type.id 
                 ? 'btn-primary' 
                 : 'btn-outline-secondary'
             ]"
             @click="selectType(type.id, $event)"
           >
             <i :class="type.icon"></i>
             <span class="ms-2">{{ type.name }}</span>
           </button>
         </div>
       </div>
     </div>
  
     <!-- Price Range -->
     <div class="mb-4">
       <h3 class="h6 mb-3">{{ t('filters.priceRange') }}</h3>
       <div class="row g-2">
         <div 
           v-for="range in filterData.priceRanges"
           :key="range.id"
           class="col-12 col-md-6"
         >
           <button
             class="btn w-100"
             :class="[
               selectedPriceRange === range.id 
                 ? 'btn-primary' 
                 : 'btn-outline-secondary'
             ]"
             @click="selectPriceRange(range.id, $event)"
           >
             {{ range.label }}
           </button>
         </div>
       </div>
     </div>
  
     <!-- Location -->
     <!-- <div class="mb-4">
       <h3 class="h6 mb-3">{{ t('filters.location') }}</h3>
       <div class="row g-2">
         <div class="col-12">
           <select 
             v-model="selectedProvince"
             class="form-select"
             @change="handleProvinceChange"
           >
             <option value="">{{ t('filters.selectProvince') }}</option>
             <option 
               v-for="province in filterData.provinces"
               :key="province.id"
               :value="province.id"
             >
               {{ province.name }}
             </option>
           </select>
         </div>
  
         <div class="col-12">
           <select 
             v-model="selectedDistrict"
             class="form-select"
             :disabled="!selectedProvince || loadingDistricts"
             @change="handleDistrictChange"
           >
             <option value="">{{ t('filters.selectDistrict') }}</option>
             <option 
               v-for="district in districts"
               :key="district.id"
               :value="district.id"
             >
               {{ district.name }}
             </option>
           </select>
         </div>
  
         <div class="col-12">
           <select 
             v-model="selectedCommune"
             class="form-select"
             :disabled="!selectedDistrict || loadingCommunes"
           >
             <option value="">{{ t('filters.selectCommune') }}</option>
             <option 
               v-for="commune in communes"
               :key="commune.id"
               :value="commune.id"
             >
               {{ commune.name }}
             </option>
           </select>
         </div>
       </div>
     </div> -->
  
     <!-- Sort Options -->
     <div class="mb-4">
       <h3 class="h6 mb-3">{{ t('filters.sortBy') }}</h3>
       <select 
         v-model="selectedSort"
         class="form-select"
       >
         <option 
           v-for="option in filterData.sortOptions"
           :key="option.value"
           :value="option.value"
         >
           {{ option.text }}
         </option>
       </select>
     </div>
  
     <!-- Apply Filters Button -->
     <button 
       class="btn btn-primary w-100"
       @click="applyFilters($event)"
       :disabled="loading"
     >
       <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
       {{ t('filters.applyFilters') }}
     </button>
   </div>
  </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { useTranslation } from '../locales';
  import { getLocationOptions } from '../services/api';
  
  export default {
  name: 'FilterSection',
  props: {
   filterOptions: {
     type: Object,
     required: true,
     default: () => ({
       types: [],
       priceRanges: [],
       provinces: [],
       amenities: [],
       sortOptions: []
     })
   },
   initialFilters: {
     type: Object,
     default: () => ({})
   },
   loading: {
     type: Boolean,
     default: false
   }
  },
  emits: ['update:filters'],
  setup(props, { emit }) {
   const { t } = useTranslation();
  
   // Create a computed property for filter data with defaults
   const filterData = computed(() => ({
     types: props.filterOptions?.types || [],
     priceRanges: props.filterOptions?.priceRanges || [],
     provinces: props.filterOptions?.provinces || [],
     amenities: props.filterOptions?.amenities || [],
     sortOptions: props.filterOptions?.sortOptions || [
       { value: 'newest', text: t('filters.sortOptions.newest') },
       { value: 'price_asc', text: t('filters.sortOptions.priceAsc') },
       { value: 'price_desc', text: t('filters.sortOptions.priceDesc') }
     ]
   }));
  
   // State
   const selectedType = ref(props.initialFilters.type || '');
   const selectedPriceRange = ref(props.initialFilters.priceRange || '');
   const selectedProvince = ref(props.initialFilters.province || '');
   const selectedDistrict = ref(props.initialFilters.district || '');
   const selectedCommune = ref(props.initialFilters.commune || '');
   const selectedSort = ref(props.initialFilters.sort || 'newest');
  
   // Loading states
   const loadingDistricts = ref(false);
   const loadingCommunes = ref(false);
  
   // Dynamic location options
   const districts = ref([]);
   const communes = ref([]);
  
   // Computed
  
   // Methods
   const applyFilters = (e) => {
     if (e) e.preventDefault();
     emit('update:filters', {
       type: selectedType.value,
       priceRange: selectedPriceRange.value,
       province: selectedProvince.value,
       district: selectedDistrict.value,
       commune: selectedCommune.value,
       sort: selectedSort.value
     }, e);
   };
  
   const handleProvinceChange = async () => {
     selectedDistrict.value = '';
     selectedCommune.value = '';
     districts.value = [];
     communes.value = [];
  
     if (selectedProvince.value) {
       loadingDistricts.value = true;
       try {
         const result = await getLocationOptions('districts', selectedProvince.value);
         districts.value = result.districts || [];
       } catch (error) {
         console.error('Error fetching districts:', error);
         districts.value = [];
       } finally {
         loadingDistricts.value = false;
       }
     }
   };
  
   const handleDistrictChange = async () => {
     selectedCommune.value = '';
     communes.value = [];
  
     if (selectedDistrict.value) {
       loadingCommunes.value = true;
       try {
         const result = await getLocationOptions('communes', selectedDistrict.value);
         communes.value = result.communes || [];
       } catch (error) {
         console.error('Error fetching communes:', error);
         communes.value = [];
       } finally {
         loadingCommunes.value = false;
       }
     }
   };
  
   const selectType = (typeId, e) => {
     if (e) e.preventDefault();
     selectedType.value = selectedType.value === typeId ? '' : typeId;
   };
  
   const selectPriceRange = (rangeId, e) => {
     if (e) e.preventDefault();
     selectedPriceRange.value = selectedPriceRange.value === rangeId ? '' : rangeId;
   };
  
   // Watch for prop changes
   watch(() => props.initialFilters, (newFilters) => {
     selectedType.value = newFilters.type || '';
     selectedPriceRange.value = newFilters.priceRange || '';
     selectedProvince.value = newFilters.province || '';
     selectedDistrict.value = newFilters.district || '';
     selectedCommune.value = newFilters.commune || '';
     selectedSort.value = newFilters.sort || 'newest';
   }, { deep: true });
  
   return {
     // State
     selectedType,
     selectedPriceRange,
     selectedProvince,
     selectedDistrict,
     selectedCommune,
     selectedSort,
     districts,
     communes,
     loadingDistricts,
     loadingCommunes,
     filterData,
  
     // Methods
     selectType,
     selectPriceRange,
     handleProvinceChange,
     handleDistrictChange,
     applyFilters,
  
     // i18n
     t
   };
  }
  };
  </script>
  
  <style scoped>
  /* Remove all custom styles - using Bootstrap classes instead */
  </style>
  
  