import axios from "axios"
import i18n from "../locales"

import { mockHomeData } from "../services/mock/home"
// Get Home Datas (ads, news, menu)
export const getHomeDatas = async () => {
  return mockHomeData.data
}



import { mockRoomId } from "../services/mock/roomId"

export const getPropertyById = async (id) => {
  return mockRoomId.data
}


import { mockSwipeFlowAd } from "../services/mock/swipeFlow"

export const fetchSwipeFlowAds = async () => {
  return mockSwipeFlowAd.data
}


import { mockRoomList } from "../services/mock/roomList"

export const getProperties = async (params = {}) => {
  return mockRoomList.data
}





// const API_BASE_URL = "http://localhost:8008/api"
const API_BASE_URL = "https://conhadat.vn/api"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include language in headers
apiClient.interceptors.request.use(
  (config) => {
    // Get current language from i18n
    const currentLang = i18n.global.locale.value

    // Set language header
    config.headers["Accept-Language"] = currentLang === "vi" ? "vi" : "en"

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Error handler helper
const handleApiError = (error) => {
  console.error("API Error:", error)
  if (error.response) {
    throw new Error(error.response.data.message || "Server error occurred")
  } else if (error.request) {
    throw new Error("No response from server")
  } else {
    throw error
  }
}

// Response handler helper
const handleApiResponse = (response) => {
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || "Invalid response format")
}

const normalizePrice = (price) => {
  if (price === undefined || price === "") return null
  const numPrice = Number(price)
  return isNaN(numPrice) ? null : numPrice
}

const normalizeFees = (fees) => ({
  ...fees,
  monthlyRent: normalizePrice(fees?.monthlyRent),
  deposit: normalizePrice(fees?.deposit),
  electricityPrice: normalizePrice(fees?.electricityPrice),
  waterPrice: normalizePrice(fees?.waterPrice),
  internetFee: normalizePrice(fees?.internetFee),
  cleaningFee: normalizePrice(fees?.cleaningFee),
  motorbikeParkingFee: normalizePrice(fees?.motorbikeParkingFee),
  carParking: normalizePrice(fees?.carParking),
  managementFee: normalizePrice(fees?.managementFee),
})





/**
 * Get properties by type
 */
export const getPropertiesByType = async (type, page = 1, pageSize = 10) => {
  try {
    const response = await apiClient.get("/website/properties", {
      params: { type, page, pageSize },
    })
    const data = handleApiResponse(response)
    return {
      ...data,
      properties: data.properties.map((property) => ({
        ...property,
        fees: normalizeFees(property.fees),
      })),
    }
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Get filter options
 */
export const getFilterOptions = async () => {
  try {
    const response = await apiClient.get("/website/filter-options")
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Get location options
 */
export const getLocationOptions = async (type, parentId) => {
  try {
    const response = await apiClient.get(`/website/locations/${type}/${parentId}`)
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Get search suggestions
 */
export const getSearchSuggestions = async (query) => {
  try {
    const response = await apiClient.get("/website/search-suggestions", {
      params: { q: query },
    })
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Submit contact form
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await apiClient.post("/website/contact", formData)
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Increment property views
 */
export const incrementPropertyViews = async (id) => {
  try {
    const response = await apiClient.post(`/website/properties/${id}/views`)
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Get property view history
 */
export const getPropertyViewHistory = async () => {
  try {
    const response = await apiClient.get("/website/property-view-history")
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Submit consultation request
 */
export const submitConsultationRequest = async (data) => {
  try {
    const response = await apiClient.post("/website/consultation-requests", data)
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Get similar properties
 */
export const getSimilarProperties = async (propertyId, limit = 4) => {
  try {
    const response = await apiClient.get(`/website/properties/${propertyId}/similar`, {
      params: { limit },
    })
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Get property statistics
 */
export const getPropertyStatistics = async (propertyId) => {
  try {
    const response = await apiClient.get(`/website/properties/${propertyId}/statistics`)
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}


/**
 * Get others menu items
 */
export const getOthersMenu = async () => {
  try {
    const response = await apiClient.get("/website/menu-others")
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}





/**
 * Fetch news articles
 */
export const fetchNewsArticles = async () => {
  try {
    const response = await apiClient.get("/website/news-articles")
    return handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching news articles:", error)

    // Fallback mock data for development/testing
    return {
      success: true,
      articles: [
        {
          id: 1,
          title: "Thị trường phòng trọ Việt Nam 2023: Cơ hội và thách thức",
          description:
            "Phân tích chi tiết về thị trường phòng trọ Việt Nam trong năm 2023, các xu hướng mới và cơ hội đầu tư.",
          image: "https://via.placeholder.com/300x200",
          date: "2023-06-15",
          source: "VnExpress",
          url: "https://vnexpress.net",
        },
        {
          id: 2,
          title: "Top 5 khu vực có tiềm năng phát triển phòng trọ tại Hà Nội",
          description: "Khám phá những khu vực đang phát triển mạnh mẽ và có tiềm năng đầu tư phòng trọ tại Hà Nội.",
          image: "https://via.placeholder.com/300x200",
          date: "2023-06-10",
          source: "Batdongsan.com.vn",
          url: "https://batdongsan.com.vn",
        },
        {
          id: 3,
          title: "Làm thế nào để tìm thuê căn hộ phù hợp với ngân sách hạn chế?",
          description: "Những lời khuyên hữu ích giúp bạn tìm được căn hộ phù hợp với nhu cầu và ngân sách của mình.",
          image: "https://via.placeholder.com/300x200",
          date: "2023-06-05",
          source: "CafeLand",
          url: "https://cafeland.vn",
        },
      ],
    }
  }
}

/**
 * Fetch home advertisements
 */
export const fetchHomeAds = async () => {
  try {
    const response = await apiClient.get("/website/home-ads")
    return handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching home ads:", error)

    // Fallback mock data for development/testing
    return {
      success: true,
      ads: [
        {
          id: 1,
          title: "Căn hộ cao cấp tại trung tâm thành phố",
          description: "Trải nghiệm cuộc sống đẳng cấp với căn hộ cao cấp mới nhất của chúng tôi",
          image: "https://via.placeholder.com/800x400?text=Premium+Apartments",
          url: "/properties/search?type=apartment",
        },
        {
          id: 2,
          title: "Biệt thự nghỉ dưỡng ven biển",
          description: "Tận hưởng kỳ nghỉ tuyệt vời với biệt thự nghỉ dưỡng ven biển",
          image: "https://via.placeholder.com/800x400?text=Beach+Villas",
          url: "/properties/search?type=villa",
        },
        {
          id: 3,
          title: "Nhà phố thương mại",
          description: "Đầu tư sinh lời với nhà phố thương mại tại các vị trí đắc địa",
          image: "https://via.placeholder.com/800x400?text=Commercial+Houses",
          url: "/properties/search?type=house",
        },
      ],
    }
  }
}

/**
 * Fetch home menu items
 */
export const fetchHomeMenu = async () => {
  try {
    const response = await apiClient.get("/website/home-menu")
    return handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching home menu:", error)

    // Fallback mock data for development/testing
    return {
      success: true,
      menu: [
        {
          id: 1,
          icon: "fas fa-search",
          titleKey: "homePage.features.search.title",
          route: "/properties/search",
          order: 1,
        },
        {
          id: 2,
          icon: "fas fa-stream",
          titleKey: "homePage.features.swipe.title",
          route: "/swipe-flow",
          order: 2,
        },
        {
          id: 3,
          icon: "fas fa-map-marker-alt",
          titleKey: "homePage.features.location.title",
          route: "/properties",
          order: 3,
        },
        {
          id: 4,
          icon: "fas fa-heart",
          titleKey: "homePage.features.favorites.title",
          route: "/view-history",
          order: 4,
        },
      ],
    }
  }
}



// Update the api object to include the new function
export const api = {
  getProperties,
  getPropertyById,
  getPropertiesByType,
  getFilterOptions,
  getLocationOptions,
  getSearchSuggestions,
  submitContactForm,
  incrementPropertyViews,
  getPropertyViewHistory,
  submitConsultationRequest,
  getSimilarProperties,
  getPropertyStatistics,
  getOthersMenu,
  fetchNewsArticles,
  fetchHomeAds,
  fetchHomeMenu,
  fetchSwipeFlowAds,
}

export default api




