<template>
  <v-select
    v-if="venues" :item-props="itemProps" :items="venues" label="Venue"
    v-model="venue" >
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'

import { fetchVenues } from '@/services/api.venue.js'

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
  const { data, error } = await fetchVenues();

  if (data) {
    venues.value = data;
  }

  if (error && error.message) {
    console.error('Error fetching venues:', error.message);
  }
}

onBeforeMount(() => {
  getVenues()
})

</script>
