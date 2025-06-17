<template>
  <b-card no-body class="contact-form">
    <b-card-header>
      <h2 class="h5 mb-0">{{ t('contactForm.title') }}</h2>
    </b-card-header>
    <b-card-body>
      <b-form @submit.prevent="submitForm">
        <b-form-group 
          :label="t('contactForm.name')" 
          label-for="name"
          :state="nameState"
          :invalid-feedback="t('contactForm.nameRequired')"
        >
          <b-form-input 
            id="name" 
            v-model="form.name" 
            :state="nameState"
            :placeholder="t('contactForm.namePlaceholder')"
            required
          ></b-form-input>
        </b-form-group>
  
        <b-form-group 
          :label="t('contactForm.phone')" 
          label-for="phone"
          :state="phoneState"
          :invalid-feedback="t('contactForm.phoneRequired')"
        >
          <b-form-input 
            id="phone" 
            v-model="form.phone" 
            type="tel" 
            :state="phoneState"
            :placeholder="t('contactForm.phonePlaceholder')"
            required
          ></b-form-input>
        </b-form-group>
  
        <b-form-group 
          :label="t('contactForm.email') + ' (' + t('common.optional') + ')'" 
          label-for="email"
        >
          <b-form-input 
            id="email" 
            v-model="form.email" 
            type="email"
            :placeholder="t('contactForm.emailPlaceholder')"
          ></b-form-input>
        </b-form-group>
  
        <b-form-group 
          :label="t('contactForm.message') + ' (' + t('common.optional') + ')'" 
          label-for="message"
        >
          <b-form-textarea 
            id="message" 
            v-model="form.message" 
            rows="3" 
            max-rows="6"
            :placeholder="t('contactForm.messagePlaceholder')"
          ></b-form-textarea>
        </b-form-group>
  
        <b-button 
          type="submit" 
          variant="primary" 
          block 
          :disabled="submitting"
        >
          <b-spinner small v-if="submitting"></b-spinner>
          {{ submitting ? t('contactForm.sending') : t('contactForm.submit') }}
        </b-button>
      </b-form>
    </b-card-body>
  </b-card>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useTranslation } from '../locales';
  import axios from 'axios';
  
  export default {
  name: 'ContactForm',
  setup() {
    const { t } = useTranslation();
    const submitting = ref(false);
  
    const form = ref({
      name: '',
      phone: '',
      email: '',
      message: ''
    });
  
    const nameState = computed(() => {
      return form.value.name.length >= 2 ? true : null;
    });
  
    const phoneState = computed(() => {
      const phoneRegex = /^[0-9]{10,11}$/;
      return form.value.phone && phoneRegex.test(form.value.phone) ? true : null;
    });
  
    const submitForm = async () => {
      if (!form.value.name || !form.value.phone) {
        return;
      }
  
      submitting.value = true;
      try {
        const response = await axios.post('/api/contact', form.value);
        if (response.data.success) {
          // Reset form
          form.value = {
            name: '',
            phone: '',
            email: '',
            message: ''
          };
          // Show success message
          alert(t('contactForm.success'));
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert(t('contactForm.error'));
      } finally {
        submitting.value = false;
      }
    };
  
    return {
      form,
      nameState,
      phoneState,
      submitting,
      submitForm,
      t
    };
  }
  };
  </script>
  
  