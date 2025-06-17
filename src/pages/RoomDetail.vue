<template>
    <div class="room-detail-page">
      <h1 class="page-title">Chi tiết phòng trọ</h1>
  
      <div class="room-section">
        <h2>Thông tin chung</h2>
        <p><strong>Tên phòng:</strong> Phòng 101</p>
        <p><strong>Địa chỉ:</strong> 283 Huỳnh Tấn Phát, Quận 7</p>
        <p><strong>Số hợp đồng:</strong> SGD000006</p>
      </div>
  
      <div class="room-section">
        <h2>Tiền phòng & Dịch vụ</h2>
        <p><strong>Tiền phòng:</strong> 2,500,000 đ</p>
        <p><strong>Tiền điện tháng trước:</strong> 350,000 đ</p>
        <p><strong>Chỉ số điện tháng trước:</strong> 351 kWh</p>
        <p><strong>Tiền nước tháng trước:</strong> 80,000 đ</p>
        <p><strong>Chỉ số nước tháng trước:</strong> 6.4 m³</p>
      </div>
  
      <div class="room-section">
        <h2>Biểu đồ sử dụng theo tuần</h2>
        <canvas id="weeklyChart" height="180"></canvas>
      </div>
  
      <div class="room-section">
        <h2>Bảng thống kê theo tháng</h2>
        <table class="stats-table">
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Điện (kWh)</th>
              <th>Tiền điện</th>
              <th>Nước (m³)</th>
              <th>Tiền nước</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in monthlyStats" :key="item.month">
              <td>{{ item.month }}</td>
              <td>{{ item.electric }}</td>
              <td>{{ item.electricCost.toLocaleString() }} đ</td>
              <td>{{ item.water }}</td>
              <td>{{ item.waterCost.toLocaleString() }} đ</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div class="room-section">
        <h2>Trạng thái chia sẻ</h2>
        <p><strong>Camera:</strong> <span class="status status-on">Đang chia sẻ</span></p>
        <p><strong>Tên camera:</strong> FPT-CAM-101</p>
        <p><strong>SĐT chia sẻ:</strong> 0988 123 456</p>
  
        <p><strong>Internet:</strong> <span class="status status-on">Đang chia sẻ</span></p>
        <p>
          <strong>WiFi:</strong>
          <span class="wifi-info">
            Tên: FPT_Home | Pass: 12345678<br />
             Gói: GiGa - Tốc độ: 300 Mbps
          </span>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const monthlyStats = ref([
  { month: '03/2024', electric: 120, electricCost: 280000, water: 6.0, waterCost: 60000 },
  { month: '04/2024', electric: 135, electricCost: 315000, water: 5.5, waterCost: 55000 },
  { month: '05/2024', electric: 142, electricCost: 330000, water: 6.2, waterCost: 62000 },
])

onMounted(() => {
  const ctx = document.getElementById('weeklyChart')
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      datasets: [
        {
          label: 'Điện (kWh)',
          data: [30, 35, 38, 40],
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
        },
        {
          label: 'Nước (m³)',
          data: [1.5, 1.3, 1.6, 1.7],
          borderColor: '#00c851',
          backgroundColor: 'rgba(0,200,81,0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  })
})
</script>

  
  <style scoped>
  .room-detail-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 16px;
    text-align: center;
  }
  
  .room-section {
    background: #f9f9f9;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  
  .room-section h2 {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .room-section p {
    font-size: 14px;
    margin: 4px 0;
  }
  
  .status {
    font-weight: bold;
  }
  
  .status-on {
    color: green;
  }
  
  .wifi-info {
    color: #333;
    font-style: italic;
    display: inline-block;
    margin-top: 4px;
    line-height: 1.5;
  }
  
  .stats-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    font-size: 14px;
  }
  
  .stats-table th,
  .stats-table td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center;
  }
  </style>
  