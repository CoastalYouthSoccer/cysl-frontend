<template>
  <v-select
    v-if="venues" :item-props="itemProps" :items="venues" label="Venue"
    v-model="venue" data-testid="venue-select">
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchAssignrVenues } from '@/services/api.venue.js'

const { getAccessTokenSilently } = useAuth0();
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
  const token = await getAccessTokenSilently();
  const { data, error } = await fetchAssignrVenues(token);

  if (data) {
    venues.value = data;
  }

  if (error && error.message) {
    console.error(`Error fetching venues: ${error.message}`);
  }
}

onBeforeMount(() => {
  getVenues()
})

</script>
