import { createRouter, createWebHistory } from "vue-router"

// Import components
import HomePage from "../pages/HomePage.vue"
import PropertyDetailsPage from "../pages/PropertyDetailsPage.vue"
import PropertiesListPage from "../pages/PropertiesListPage.vue"
import SearchResultsPage from "../pages/SearchResultsPage.vue"
import PropertyViewHistoryPage from "../pages/PropertyViewHistoryPage.vue"
import NotFoundPage from "../pages/NotFoundPage.vue"
import OthersPage from "../pages/OthersPage.vue"
import SwipeFlowPage from "../pages/SwipeFlowPage.vue"
import RoomManagement from "../pages/RoomManagement.vue"
import RoomDetail from "../pages/RoomDetail.vue"
import RoomUpdate from "../pages/RoomUpdate.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { title: "Tìm phòng Quận 7 - Có Nhà Đất đây - Tìm Phòng, Thuê Nhà Nhanh - CoNhaDat.vn", description: "Website đăng tin phòng trọ, thuê nhà trọ, căn hộ, phòng trọ, tìm kiếm dễ dàng và nhanh chóng.", ogImage: "/default-og-image.png" },
  },
  {
    path: "/property/:id",
    name: "PropertyDetails",
    component: PropertyDetailsPage,
    meta: { title: "Chi tiết phòng", description: "Xem chi tiết thông tin phòng, căn hộ, nhà đất.", ogImage: "/default-og-image.png" },
  },
  {
    path: "/properties",
    name: "PropertiesList",
    component: PropertiesListPage,
    meta: { title: "Danh sách phòng", description: "Danh sách phòng trọ, nhà thuê, phòng trọ nổi bật.", ogImage: "/default-og-image.png" },
  },
  {
    path: "/properties/search",
    name: "PropertiesSearch",
    component: SearchResultsPage,
    meta: { title: "Tìm kiếm phòng", description: "Kết quả tìm kiếm phòng trọ, nhà đất phù hợp với bạn.", ogImage: "/default-og-image.png" },
  },
  {
    path: "/property/view-history",
    name: "PropertyViewHistory",
    component: PropertyViewHistoryPage,
    meta: { title: "Lịch sử xem phòng", description: "Danh sách các phòng bạn đã xem gần đây." },
  },
  {
    path: "/others",
    name: "OthersPage",
    component: OthersPage,
    meta: { title: "Trang khác", description: "Trang thông tin khác.", ogImage: "/default-og-image.png" },
  },
  {
    path: "/swipe-flow",
    name: "SwipeFlowPage",
    component: SwipeFlowPage,
    meta: { title: "Gợi ý phòng", description: "Vuốt để tìm phòng nhanh." },
  },

  {
    path: '/room-management',
    name: 'RoomManagement',
    component: RoomManagement,
    meta: { title: "Quản lý phòng", description: "Quản lý các phòng trọ của bạn" },
  },

  {
    path: '/my-room',
    name: 'RoomDetail',
    component: RoomDetail,
    meta: { title: "Phòng của tôi", description: "Xem thông tin phòng" },

  },

  {
    path: '/room-update',
    name: 'RoomUpdate',
    component: RoomUpdate,
    meta: { title: "Cập nhật tình trạng", description: "Cập nhật thông tin phòng" },

  },


  {
    path: "/:catchAll(.*)",
    name: "NotFoundPage",
    component: NotFoundPage,
    meta: { title: "Không tìm thấy trang", description: "Trang bạn tìm không tồn tại.", ogImage: "/default-og-image.png" },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// SEO Meta Tag
router.afterEach((to) => {
  const defaultTitle = "Có Nhà Đất - CoNhaDat.vn"
  const defaultDescription = "Website tìm kiếm và cho thuê phòng trọ, nhà đất, căn hộ nhanh chóng."

  document.title = to.meta.title || defaultTitle

  const description = to.meta.description || defaultDescription
  const url = window.location.href

  updateMetaTag('description', description)
  updateMetaTag('og:title', document.title)
  updateMetaTag('og:description', description)
  updateMetaTag('og:url', url)
})

function updateMetaTag(name, content) {
  let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
  if (element) {
    element.setAttribute('content', content)
  } else {
    element = document.createElement('meta')
    if (name.startsWith('og:')) {
      element.setAttribute('property', name)
    } else {
      element.setAttribute('name', name)
    }
    element.setAttribute('content', content)
    document.head.appendChild(element)
  }
}

export default router
