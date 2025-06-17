<template>
  <div class="quick-navigation" :class="{ 'fixed-bottom': isFixed }">
    <div class="container">
      <div class="row g-2">
        <div v-for="(item, index) in navigationItems" :key="index" class="col-3">
          <router-link 
            :to="item.route" 
            class="nav-item"
            :class="{ active: isActive(item.route) }"
          >
            <i :class="item.icon"></i>
            <span class="nav-label">{{ t(item.labelKey) }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
 </template>
 
 <script>
 import { computed } from 'vue';
 import { useRoute } from 'vue-router';
 import { useTranslation } from '../locales';
 
 export default {
  name: 'QuickNavigation',
  props: {
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const route = useRoute();
    const { t } = useTranslation();
 
    const navigationItems = [
      { 
        labelKey: 'quickNav.home', 
        icon: 'fas fa-home', 
        route: '/' 
      },
      { 
        labelKey: 'quickNav.swipe', 
        icon: 'fas fa-stream', 
        route: '/swipe-flow' 
      },
      { 
        labelKey: 'quickNav.search', 
        icon: 'fas fa-search', 
        route: '/properties/search' 
      },
      { 
        labelKey: 'quickNav.others', 
        icon: 'fas fa-ellipsis-h', 
        route: '/others' 
      }
    ];
 
    const isActive = (path) => {
      if (path === '/properties/search') {
        return route.path.startsWith('/properties');
      }
      return route.path === path;
    };
 
    return {
      navigationItems,
      isActive,
      t
    };
  }
 };
 </script>
 
 <style scoped>
 .quick-navigation {
  background-color: white;
  padding: 0.5rem 0; /* Reduced from 0.75rem */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
 }
 
 .quick-navigation.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001; /* Increased from 1000 to be above the swipe view */
 }
 
 .nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #6c757d;
  padding: 0.3rem; /* Reduced from 0.5rem */
  border-radius: 8px;
  transition: all 0.2s ease;
 }
 
 .nav-item:hover {
  color: var(--bs-primary);
  background-color: rgba(153, 204, 255, 0.1);
 }
 
 .nav-item.active {
  color: var(--bs-primary);
  background-color: rgba(153, 204, 255, 0.1);
 }
 
 .nav-item i {
  font-size: 1.1rem; /* Reduced from 1.25rem */
  margin-bottom: 0.2rem; /* Reduced from 0.25rem */
 }
 
 .nav-label {
  font-size: 0.7rem; /* Reduced from 0.75rem */
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
 }
 
 @media (max-width: 375px) {
  .nav-label {
    font-size: 0.65rem; /* Reduced from 0.7rem */
  }
 }
 </style>
 
 