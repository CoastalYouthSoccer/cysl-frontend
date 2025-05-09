<template>
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-test="SubVenues-alert"/>
  <div v-if="isLoading" class="d-flex justify-center my-4" data-test="SubVenues-loading">
    <v-progress-circular indeterminate color="primary" />
  </div>
  <v-select
    v-if="!isLoading && SubVenuess.length" :item-props="itemProps"
    :items="SubVenues" label="SubVenues"
    v-model="SubVenues" data-test="SubVenues-select">
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchSubVenues } from '@/services/api.SubVenues.js'
import { formatErrorMessage } from '@/utils/formatMessage.js'

const props = defineProps({
  venue_id: String,
  venue_name: String
})
const { getAccessTokenSilently } = useAuth0();
const emit = defineEmits(['SubVenuesChange']);
const SubVenues = ref(null);
const SubVenue = ref(null);
const errorMessage = ref(null)
const isLoading = ref(true)

watch(SubVenues, (newValue) => {
  emit('SubVenuesChange', newValue)
})

function itemProps(item) {
  return {
    name: item.name
  };
}

onBeforeMount(async() => {
  const token = await getAccessTokenSilently();
  const { data, error } = await fetchSubVenues(token, {"venue_id": props.venue_id});

  if (error?.message) {
    errorMessage.value = `Error fetching SubVenues: ${formatErrorMessage(error.message)}`
    console.error(errorMessage.value)
  } else {
    SubVenues.value = data
  }
  isLoading.value = false
})

</script>
