<template>
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-test="venue-alert"/>
  <div v-if="isLoading" class="d-flex justify-center my-4" data-test="venue-loading">
    <v-progress-circular indeterminate color="primary" />
  </div>
  <v-select
    v-if="!isLoading && venues.length" :item-props="itemProps"
    :items="venues" label="Venue"
    v-model="venue" data-test="venue-select">
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchAssignrVenues } from '@/services/api.venue.js'
import { formatErrorMessage } from '@/utils/formatMessage.js'

const { getAccessTokenSilently } = useAuth0();
const emit = defineEmits(['venueChange']);
const venues = ref(null);
const venue = ref(null);
const errorMessage = ref(null)
const isLoading = ref(true)

watch(venue, (newValue) => {
  emit('venueChange', newValue)
})

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.city,
  };
}

onBeforeMount(async() => {
  const token = await getAccessTokenSilently();
  const { data, error } = await fetchAssignrVenues(token);

  if (error?.message) {
    errorMessage.value = `Error fetching venues: ${formatErrorMessage(error.message)}`
    console.error(errorMessage.value)
  } else {
    venues.value = data
  }
  isLoading.value = false
})

</script>
