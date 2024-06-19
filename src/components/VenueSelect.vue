<template>
  <v-select :item-props="itemProps" :items="venues.venues" label="Venue"></v-select>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useVenueStore } from '@/stores/venue.js'

const venues = useVenueStore();

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.city,
  };
}

onMounted(() => {
  venues.loadVenues();
})

</script>
