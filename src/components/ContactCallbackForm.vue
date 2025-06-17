<template>
    <div class="contact-form">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Họ tên *</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            required
          />
          <div class="invalid-feedback">{{ errors.name }}</div>
        </div>
    
        <div class="form-group">
          <label for="phone">Số điện thoại *</label>
          <input
            type="tel"
            id="phone"
            v-model="form.phone"
            class="form-control"
            :class="{ 'is-invalid': errors.phone }"
            required
          />
          <div class="invalid-feedback">{{ errors.phone }}</div>
        </div>
    
        <div class="form-group">
          <label for="message">Tin nhắn (không bắt buộc)</label>
          <textarea
            id="message"
            v-model="form.message"
            class="form-control"
            rows="3"
          ></textarea>
        </div>
    
        <button 
          type="submit" 
          class="submit-button" 
          :disabled="submitting"
        >
          <span v-if="submitting" class="spinner"></span>
          <span>Gửi yêu cầu</span>
        </button>
      </form>
    </div>
    </template>
    
    <script>
    import { ref, reactive } from 'vue';
    import { submitContactForm } from '../services/api';
    
    export default {
      name: 'ContactCallbackForm',
      props: {
        propertyId: {
          type: [Number, String],
          required: true
        }
      },
      emits: ['success', 'close'],
      setup(props, { emit }) {
        const form = reactive({
          name: '',
          phone: '',
          message: ''
        });
    
        const errors = reactive({
          name: '',
          phone: ''
        });
    
        const submitting = ref(false);
    
        const validateForm = () => {
          let isValid = true;
          errors.name = '';
          errors.phone = '';
    
          if (!form.name.trim()) {
            errors.name = 'Vui lòng nhập họ tên';
            isValid = false;
          }
    
          const phoneRegex = /^[0-9]{10,11}$/;
          if (!phoneRegex.test(form.phone)) {
            errors.phone = 'Vui lòng nhập số điện thoại hợp lệ';
            isValid = false;
          }
    
          return isValid;
        };
    
        const submitForm = async () => {
          if (!validateForm()) return;
    
          submitting.value = true;
          try {
            await submitContactForm({
              ...form,
              propertyId: props.propertyId,
              type: 'callback'
            });
            
            emit('success');
            emit('close');
          } catch (error) {
            console.error('Error submitting form:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
          } finally {
            submitting.value = false;
          }
        };
    
        return {
          form,
          errors,
          submitting,
          submitForm
        };
      }
    };
    </script>
    
    <style scoped>
    .contact-form {
      color: #fff;
      padding: 1rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      /* color: #1a1a1a; */
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--bs-primary);
      box-shadow: 0 0 0 3px rgba(153, 204, 255, 0.25);
    }
    
    .form-control.is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      font-size: 0.875rem;
      color: #dc3545;
      margin-top: 0.25rem;
    }
    
    .submit-button {
      width: 100%;
      padding: 0.75rem;
      background: var(--bs-primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .submit-button:hover:not(:disabled) {
      background: #7ab8ff;
    }
    
    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    </style>
    
    