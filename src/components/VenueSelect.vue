<template>
  <v-select
    v-if="venues" :item-props="itemProps" :items="venues" label="Venue"
    v-model="venue" >
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import APIService from '@/services/APIService.js'

const emit = defineEmits(['venueChange']);
const venues = ref(null);
const venue = ref(null);

watch(venue, (newValue) => {
  emit('venueChange', newValue)
})

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.city,
  };
}

async function getVenues() {
  await APIService.fetchVenues()
    .then((response) => {
      venues.value = response.data
    })
    .catch((error) => {
      console.error('Error fetching venues:', error);
    });
}

onBeforeMount(() => {
  getVenues()
})

</script>
