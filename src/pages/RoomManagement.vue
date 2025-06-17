<template>
    <div class="room-management-page">
      <h1 class="page-title">Quản lý phòng trọ</h1>
  
      <div class="room-row-list">
        <div class="room-row" v-for="room in rooms" :key="room.id">
          <div class="room-info" :class="room.tenant ? 'rented' : 'not-rented'">
            <h2 class="room-name">{{ room.name }}</h2>
            <p class="room-tenant"><strong>Người thuê:</strong> {{ room.tenant || 'Chưa có' }}</p>
            <p class="room-status"><strong>Tiền trọ:</strong>
              <span :class="room.status === 'open' ? 'status-open' : 'status-close'">
                {{ room.status === 'open' ? 'Đã đóng' : 'Chưa đóng' }}
              </span>
            </p>
            <p class="room-status"><strong>Share wifi:</strong>
              <span :class="room.wifi ? 'status-open' : 'status-close'">
                {{ room.wifi ? 'Có' : 'Không' }}
              </span>
            </p>
            <p class="room-status"><strong>Share Camera:</strong>
              <span :class="room.camera ? 'status-open' : 'status-close'">
                {{ room.camera ? 'Có' : 'Không' }}
              </span>
            </p>
            <p class="room-desc">{{ room.price.toLocaleString() }} đ</p>
            <p class="room-rent-status"><strong>Trạng thái thuê:</strong>
              <span :class="room.tenant ? 'status-open' : 'status-close'">
                {{ room.tenant ? 'Đã cho thuê' : 'Chưa cho thuê' }}
              </span>
            </p>
          </div>
          <div class="room-actions">
            <button class="btn" @click="toggleStatus(room)">Đổi</button>
            <button class="btn" @click="goToDetail()">Chi tiết</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const rooms = reactive([
    {
      id: 1,
      name: 'Phòng 101',
      address: '283 Huỳnh Tấn Phát, Quận 7',
      area: 20,
      price: 2500000,
      status: 'open',
      wifi: true,
      camera: false,
      tenant: 'Nguyễn Văn A',
    },
    {
      id: 2,
      name: 'Phòng 102',
      address: '283 Huỳnh Tấn Phát, Quận 7',
      area: 18,
      price: 2200000,
      status: 'close',
      wifi: true,
      camera: true,
      tenant: null,
    },
  ])
  
  function toggleStatus(room) {
    room.status = room.status === 'open' ? 'close' : 'open'
  }
  
  function goToDetail() {
    router.push('/room-update')
  }
  </script>
  
  <style scoped>
  .room-management-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 16px;
    text-align: center;
  }
  
  .room-row-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .room-row {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  
  .room-info.rented {
    background-color: #e7fbe7;
  }
  
  .room-info.not-rented {
    background-color: #f5f5f5;
  }
  
  .room-info {
    flex: 1;
    padding: 12px;
  }
  
  .room-name {
    font-size: 16px;
    font-weight: bold;
    margin: 0;
  }
  
  .room-desc,
  .room-status,
  .room-tenant,
  .room-rent-status {
    font-size: 14px;
    margin: 4px 0;
    color: #444;
  }
  
  .status-open {
    color: green;
    font-weight: bold;
  }
  
  .status-close {
    color: red;
    font-weight: bold;
  }
  
  .room-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    border-left: 1px solid #ddd;
    background: #f9f9f9;
  }
  
  .btn {
    padding: 6px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  
  @media (min-width: 600px) {
    .room-actions {
      flex-direction: row;
    }
  }
  </style>
  