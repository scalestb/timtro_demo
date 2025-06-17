<template>
  <div class="search-box">
    <div class="search-container">
      <form @submit.prevent="handleSearch" class="search-form">
        <div class="input-group">
          <span class="input-group-text border-0">
            <i class="fas fa-search"></i>
          </span>
          
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('searchBox.searchProperties')"
            class="form-control border-0 shadow-none search-input"
            @input="fetchSuggestions"
            @focus="showSuggestions = true"
            autocomplete="off"
          />

          <button 
            v-if="searchQuery" 
            type="button"
            class="btn btn-link border-0 clear-button"
            @click="clearSearch"
          >
            <i class="fas fa-times"></i>
          </button>

          <button type="submit" class="btn btn-primary search-button">
            {{ t('searchBox.search') }}
          </button>
        </div>
        
        <!-- Suggestions dropdown -->
        <div 
          v-if="showSuggestions && suggestions.length > 0" 
          class="suggestions-dropdown"
        >
          <div 
            v-for="suggestion in suggestions" 
            :key="suggestion"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            <i class="fas fa-search me-2"></i>
            <span>{{ suggestion }}</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTranslation } from '../locales';
import { getSearchSuggestions } from '../services/api';

export default {
name: 'SearchBox',
setup() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const searchQuery = ref('');
  const suggestions = ref([]);
  const showSuggestions = ref(false);

  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      showSuggestions.value = false;
      router.push({ 
        name: 'SearchResults', 
        query: { q: searchQuery.value.trim() } 
      });
    }
  };

  const fetchSuggestions = async () => {
    if (searchQuery.value.length > 2) {
      try {
        const result = await getSearchSuggestions(searchQuery.value);
        suggestions.value = result.suggestions || [];
        showSuggestions.value = true;
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        suggestions.value = [];
        showSuggestions.value = false;
      }
    } else {
      suggestions.value = [];
      showSuggestions.value = false;
    }
  };

  const selectSuggestion = (suggestion) => {
    searchQuery.value = suggestion;
    showSuggestions.value = false;
    handleSearch();
  };

  const clearSearch = () => {
    searchQuery.value = '';
    suggestions.value = [];
    showSuggestions.value = false;
  };

  // Close suggestions when clicking outside
  const handleClickOutside = (event) => {
    if (!event.target.closest('.search-box')) {
      showSuggestions.value = false;
    }
  };

  // Add click outside listener
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside);
  }

  // Cleanup
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', handleClickOutside);
    }
  });

  // Watch for changes in search query
  watch(searchQuery, (newValue) => {
    if (newValue.length > 2) {
      fetchSuggestions();
    } else {
      suggestions.value = [];
      showSuggestions.value = false;
    }
  });

  return {
    searchQuery,
    suggestions,
    showSuggestions,
    handleSearch,
    fetchSuggestions,
    selectSuggestion,
    clearSearch,
    t
  };
}
};
</script>

<style scoped>
.search-box {
  width: 100%;
  position: relative;
  z-index: 100;
}

.search-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
}

.search-form {
  position: relative;
}

.input-group {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
}

.input-group-text {
  background: transparent;
  color: #6c757d;
  padding-left: 1.25rem;
}

.search-input {
  height: 56px;
  font-size: 1.125rem;
  background: transparent;
  padding-left: 0.5rem;
}

.search-input:focus {
  background: transparent;
}

.clear-button {
  color: #6c757d;
  padding: 0 1rem;
}

.clear-button:hover {
  color: #343a40;
}

.search-button {
  margin: 4px;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}

.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-item i {
  color: #6c757d;
  width: 20px;
}

@media (max-width: 768px) {
  .search-container {
    border-radius: 12px;
  }

  .search-input {
    height: 48px;
    font-size: 1rem;
  }

  .search-button {
    padding: 0.5rem 1rem;
  }
}
</style>

