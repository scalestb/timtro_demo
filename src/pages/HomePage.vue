<template>
  <div class="home-page">
    <!-- Main Content -->
    <main class="app-content">

      <!-- Website Feature Menu -->
      <section class="feature-menu-section">
        <div class="section-title">
          <h3>{{ t('homePage.exploreFeatures') }}</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loadingFeatures" class="loading-state">
          <div class="spinner"></div>
          <p>{{ t('common.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="featuresError" class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>{{ featuresError }}</p>
          <button @click="fetchFeatureMenu" class="retry-button">
            <i class="fas fa-redo"></i>
            {{ t('common.retry') }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="features.length === 0" class="empty-state">
          <i class="fas fa-th-large"></i>
          <p>{{ t('homePage.noFeatures') }}</p>
        </div>

        <!-- Feature Menu with API data -->
        <div v-else class="feature-menu">
          <div
            v-for="(feature, index) in features"
            :key="feature.id || index"
            class="feature-item"
            @click="navigateTo(feature.route)"
          >
            <div class="feature-icon">
              <img :src="feature.icon_url" :alt="feature.title" />
            </div>
            <div class="feature-text">
                {{feature.title }}
            </div>
          </div>
        </div>
      </section>

      <!-- Banner Slide -->
      <section class="banner-section">
        <div class="section-title">
          <h3>{{ t('homePage.featuredProperties') }}</h3>
          <button class="view-all-btn" @click="navigateTo('/properties')">
            {{ t('homePage.viewAll') }}
          </button>
        </div>

        <div class="banner-container">
          <div v-if="loadingBanners" class="loading-state">
            <div class="spinner"></div>
            <p>{{ t('common.loading') }}</p>
          </div>

          <div v-else-if="bannerError" class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>{{ bannerError }}</p>
            <button @click="fetchBanners" class="retry-button">
              <i class="fas fa-redo"></i>
              {{ t('common.retry') }}
            </button>
          </div>

          <div v-else-if="banners.length === 0" class="empty-state">
            <i class="fas fa-images"></i>
            <p>{{ t('banner.noBanners') }}</p>
          </div>

          <BannerSlider v-else :banners="banners" />
        </div>
      </section>

      <!-- Featured Articles -->
      <section class="articles-section">
        <div class="section-title">
          <h3>{{ t('homePage.featuredArticles') }}</h3>
        </div>

        <div v-if="loadingArticles" class="loading-state">
          <div class="spinner"></div>
          <p>{{ t('common.loading') }}</p>
        </div>

        <div v-else-if="articlesError" class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>{{ articlesError }}</p>
          <button @click="fetchArticles" class="retry-button">
            <i class="fas fa-redo"></i>
            {{ t('common.retry') }}
          </button>
        </div>

        <div v-else-if="articles.length === 0" class="empty-state">
          <i class="fas fa-newspaper"></i>
          <p>{{ t('homePage.noArticles') }}</p>
        </div>

        <div v-else class="articles-list">
          <div
            v-for="(article, index) in articles"
            :key="index"
            class="article-item"
            @click="openExternalLink(article.url)"
          >
            <div class="article-image">
              <img :src="article.image || 'https://via.placeholder.com/300x200'" :alt="article.title">
              <div class="article-source">{{ article.source }}</div>
            </div>

            <div class="article-content">
              <h4 class="article-title">{{ article.title }}</h4>
              <p class="article-description">{{ article.description }}</p>
              <div class="article-date">
                <i class="fas fa-calendar-alt"></i>
                {{ formatDate(article.date) }}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>

    <QuickNavigation :is-fixed="true" />
  </div>
</template>


<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from '../locales'
import BannerSlider from '../components/BannerSlider.vue'
import QuickNavigation from '../components/QuickNavigation.vue'
import { getHomeDatas } from '../services/api'
import '@/assets/css/pages/HomePage.css'
export default {
  name: 'HomePage',
  components: {
    BannerSlider,
    QuickNavigation
  },
  setup() {
    const { t } = useTranslation();
    const router = useRouter();

    // State for banners
    const banners = ref([]);
    const loadingBanners = ref(true);
    const bannerError = ref(null);

    // State for articles
    const articles = ref([]);
    const loadingArticles = ref(true);
    const articlesError = ref(null);

    // State for feature menu
    const features = ref([]);
    const loadingFeatures = ref(true);
    const featuresError = ref(null);

    // Function gọi API mới getHomeDatas
    const fetchHomeDatas = async () => {
      try {
        loadingBanners.value = true;
        loadingArticles.value = true;
        loadingFeatures.value = true;

        const res = await getHomeDatas()
        banners.value = res.ads || []
        articles.value = res.articles  || []
        features.value = res.menu ? res.menu.flat() : []

      } catch (error) {
        console.error('Error fetching home datas:', error)
      } finally {
        loadingBanners.value = false;
        loadingArticles.value = false;
        loadingFeatures.value = false;
      }
    }

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        if (typeof dateString === 'string' && dateString.includes('T')) {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(date);
        }
        return dateString;
      } catch (e) {
        console.error('Error formatting date:', e);
        return dateString;
      }
    }

    const navigateTo = (route) => {
      router.push(route);
    }

    const openExternalLink = (url) => {
      if (!url) return;
      let fullUrl = url;
      if (!url.startsWith('http')) {
        fullUrl = `https://${url}`;
      }
      window.open(fullUrl, '_blank');
    }
    onMounted(() => {
      fetchHomeDatas()
    })

    return {
      features,
      loadingFeatures,
      featuresError,
      banners,
      articles,
      loadingBanners,
      loadingArticles,
      bannerError,
      articlesError,
      navigateTo,
      openExternalLink,
      formatDate,
      t
    }
  }
}
</script>