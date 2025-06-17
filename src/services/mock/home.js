// mocks/mockData.js
export const mockHomeData = {
    success: true,
    message: "OK",
    data: {
      menu: [
        {
          id: 1,
          icon_url: "/public_data/menu/1.png",
          title: "Tìm phòng",
          route: "/properties",
          order: 1,
        },
        {
          id: 2,
          icon_url: "/public_data/menu/2.png",
          title: "Vuốt nào",
          route: "/swipe-flow",
          order: 2,
        },
        {
          id: 3,
          icon_url: "/public_data/menu/3.png",
          title: "Ký gửi",
          route: "/ky-gui-phong",
          order: 3,
        },
        {
          id: 4,
          icon_url: "/public_data/menu/4.png",
          title: "Lịch sử xem",
          route: "/property/view-history",
          order: 4,
        },


        {
          id: 5,
          icon_url: "/public_data/menu/5.png",
          title: "Quản lý phòng",
          route: "/room-management",
          order: 5,
        },

        {
          id: 6,
          icon_url: "/public_data/menu/6.png",
          title: "My Room",
          route: "/my-room",
          order: 6,
        },
      ],
      articles: [
        {
          id: 1,
          title: "Nhà trọ siêu sang giữa lòng Quận 7 - chỉ 15 triệu",
          description:
            "Nhà trọ với 120m2, có phòng ngủ, phòng tăm, phòng ăn và phòng khách riêng biệt, ban công view Bitexco",
          image:
            "/public_data/room/1/1.png",
          date: "13/04/2025",
          source: "Có Internet FPT",
          url: "https://bongda24h.vn/bong-da-anh/mu-nham-chieu-mo-sao-tre-ajax-172-418577.html",
        },
        {
          id: 2,
          title:
            "An tâm sinh sống đảm bảo sự an toàn với Khu trọ có lắp đặt Camera IQ thông minh đến từ FPT",
          description:
            "Nhiều phường tại TP.HCM đang lấy ý kiến người dân về việc sáp nhập...",
          image:
            "/public_data/room/2/1.png",
          date: "13/04/2025",
          source: "Có Camera FPT",
          url: "https://znews.vn/tphcm-lay-y-kien-nguoi-dan-ve-sap-nhap-binh-duong-ba-ria-vung-tau-post1545441.html",
        },
      ],
      ads: [
        {
          id: 1,
          title: "Internet An tâm - An toàn cho con cái của bạn",
          description:
            "Giải pháp mạng vừa mạnh mẽ, vừa an toàn là nhu cầu thiết yếu của mọi gia đình",
          image:
            "/public_data/banner/1.jpg",
          url: "https://fpt.vn/tin-tuc/fpt-an-tam-la-chan-an-toan-cho-ket-noi-mang-gia-dinh-11103.html",
        },
        {
          id: 2,
          title: "Combo Internet & Camera với nhiều lợi ích siêu hấp dẫn",
          description:
            "Đừng bỏ lỡ cơ hội nâng tầm cuộc sống với Combo Internet & Camera FPT",
          image:
            "/public_data/banner/2.png",
          url: "https://wifi-fpt.com.vn/fpt-ra-mat-3-goi-cuoc-combo-internet-camera-voi-nhieu-loi-ich-sieu-hap-dan/",
        },
      ],
    },
  }
  