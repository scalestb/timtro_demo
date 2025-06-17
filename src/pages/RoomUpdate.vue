<template>
    <div class="room-update-page">
      <h1 class="page-title">Cập nhật thông tin phòng</h1>
  
      <form class="form-section">
        <div class="form-group">
          <label>Tiền nhà</label>
          <input type="number" class="form-control" v-model="form.rent" placeholder="Tiền nhà" />
        </div>
  
        <div class="form-group">
          <label>Tiền điện</label>
          <input type="number" class="form-control" v-model="form.electric" placeholder="Tiền điện" />
        </div>
  
        <div class="form-group">
          <label>Tiền nước</label>
          <input type="number" class="form-control" v-model="form.water" placeholder="Tiền nước" />
        </div>
  
        <div class="form-group">
          <label>Tiền dịch vụ</label>
          <input type="number" class="form-control" v-model="form.service" placeholder="Tiền dịch vụ" />
        </div>
  
        <div class="form-group">
          <label>Chỉ số điện tháng này (kWh)</label>
          <input type="number" class="form-control" v-model="form.electricCurrent" />
        </div>
  
        <div class="form-group">
          <label>Chỉ số nước tháng này (m³)</label>
          <input type="number" class="form-control" v-model="form.waterCurrent" />
        </div>
  
        <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" id="paid" v-model="form.paid" />
          <label class="form-check-label" for="paid">
            Xác nhận đã thu tiền <br />
            <small class="text-muted">Tình trạng: {{ form.paid ? 'Đã thu' : 'Chưa thu' }}</small>
          </label>
        </div>
  
        <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" id="internet" v-model="form.internet" />
          <label class="form-check-label" for="internet">
            Cấp quyền sử dụng Internet <br />
            <small class="text-muted">Tình trạng: {{ form.internet ? 'Đã cấp' : 'Chưa cấp' }}</small>
          </label>
        </div>
  
        <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" id="camera" v-model="form.camera" />
          <label class="form-check-label" for="camera">
            Cấp quyền xem Camera <br />
            <small class="text-muted">Tình trạng: {{ form.camera ? 'Đã cấp' : 'Chưa cấp' }}</small>
          </label>
        </div>
  
        <div class="form-group">
          <label>Đăng ký mở line Internet mới</label>
          <select class="form-control" v-model="form.newLine">
            <option disabled value="">-- Chọn gói --</option>
            <option>FPT Super80</option>
            <option>FPT Super100</option>
            <option>FPT Meta300</option>
          </select>
          <small class="text-muted">Đã chọn: {{ form.newLine || 'Chưa đăng ký' }}</small>
        </div>
  
        <button type="button" class="btn btn-primary w-100 mt-3" @click="submitForm">Cập nhật</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  
  const form = reactive({
    rent: 2500000,
    electric: 320000,
    water: 120000,
    service: 50000,
    electricCurrent: 135,
    waterCurrent: 25,
    paid: false,
    internet: false,
    camera: false,
    newLine: ''
  })
  
  function submitForm() {
    alert('Đã gửi cập nhật:\n' + JSON.stringify(form, null, 2))
  }
  </script>
  
  <style scoped>
  .room-update-page {
    padding: 16px;
    font-family: 'Segoe UI', sans-serif;
  }
  
  .page-title {
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #2c3e50;
  }
  
  .form-section {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-check-label {
    font-size: 14px;
  }
  
  input[type="number"],
  select {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  .btn {
    font-size: 16px;
    padding: 10px;
  }
  
  @media (min-width: 600px) {
    .form-section {
      max-width: 500px;
      margin: 0 auto;
    }
  }
  </style>
  