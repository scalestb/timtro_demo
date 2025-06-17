<template>
  <div class="others-page">
    <h1 class="page-title">FPT Telecom Review Standards Certification</h1>
    <p class="page-subtitle">
      Chứng chỉ đánh giá tiêu chuẩn dịch vụ và công nghệ tiên tiến của FPT Telecom
    </p>

    <section class="cert-intro">
      <h2 class="section-title">Giới thiệu</h2>
      <p>
        Chứng chỉ <strong>FPT Telecom Review Standards Certification</strong> là biểu tượng cho sự uy tín, chất lượng và cam kết công nghệ trong lĩnh vực bất động sản số. Chứng chỉ được cấp bởi FPT Telecom cho các địa điểm đáp ứng bộ tiêu chí nghiêm ngặt do tập đoàn xây dựng và thẩm định.
      </p>
    </section>

    <section class="cert-criteria">
      <h2 class="section-title">Tiêu chí cấp chứng chỉ</h2>
      <ul class="criteria-list">
        <li>📍 Địa điểm đã được <strong>xác thực thông tin</strong> và <strong>khảo sát khu vực</strong></li>
        <li>📡 Sử dụng các dịch vụ Internet, Truyền hình hoặc Camera <strong>do FPT Telecom cung cấp</strong></li>
        <li>📱 Sử dụng <strong>app Hi FPT</strong> để quản lý hợp đồng, thiết bị và dịch vụ</li>
        <li>🏠 Tích hợp hệ sinh thái <strong>IOT Smart Home</strong> của FPT như cảm biến, camera, điều khiển từ xa</li>
      </ul>
    </section>

    <section class="cert-ranks">
      <h2 class="section-title">Hệ thống hạng chứng chỉ</h2>
      <ul class="rank-list">
        <li><strong>Đối tác liên kết</strong> – Hợp tác chia sẻ dịch vụ</li>
        <li><strong>Silver Home</strong> – Đáp ứng các tiêu chí cơ bản</li>
        <li><strong>Golden Home</strong> – Tối ưu dịch vụ và tương tác số</li>
        <li><strong>Platinum Home</strong> – Công nghệ kết nối toàn diện</li>
        <li><strong>Diamond Home</strong> – Chuẩn sống thông minh, trải nghiệm vượt trội</li>
      </ul>
    </section>

    <section class="cert-value">
      <h2 class="section-title">Giá trị chứng chỉ</h2>
      <p>
        Bên cạnh việc khẳng định đẳng cấp công nghệ, chứng chỉ còn giúp khách hàng dễ dàng nhận diện các bất động sản đã tích hợp hạ tầng dịch vụ cao cấp, đảm bảo an toàn, tiện nghi và quản lý dễ dàng thông qua nền tảng số.
      </p>
    </section>

    <div class="quick-nav-fixed">
      <QuickNavigation />
    </div>
  </div>
</template>

<script>
import QuickNavigation from "@/components/QuickNavigation.vue";

export default {
  name: "OthersPage",
  components: {
    QuickNavigation,
  },
};
</script>

<style scoped>
.others-page {
  padding: 16px;
  padding-bottom: 80px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #fefefe;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
  color: #004080;
}

.page-subtitle {
  text-align: center;
  font-size: 14px;
  margin-bottom: 24px;
  color: #333;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #0066cc;
  margin-bottom: 8px;
}

.cert-intro,
.cert-criteria,
.cert-ranks,
.cert-value {
  background: #ffffff;
  border-left: 4px solid #007bff;
  border-radius: 6px;
  padding: 14px;
  margin-bottom: 18px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.criteria-list,
.rank-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.criteria-list li,
.rank-list li {
  margin-bottom: 6px;
  font-size: 14px;
  padding-left: 20px;
  position: relative;
}

.criteria-list li::before,
.rank-list li::before {
  content: "✔";
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

.quick-nav-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
