<template>
  <div class="google-map">
    <div ref="mapContainer" style="width: 100%; height: 300px;"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'GoogleMap',
  props: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const mapContainer = ref(null);

    onMounted(() => {
      // Load Google Maps API script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    });

    const initMap = () => {
      const map = new google.maps.Map(mapContainer.value, {
        center: { lat: props.lat, lng: props.lng },
        zoom: 15,
      });

      new google.maps.Marker({
        position: { lat: props.lat, lng: props.lng },
        map: map,
      });
    };

    return {
      mapContainer,
    };
  },
};
</script>

