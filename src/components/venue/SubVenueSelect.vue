<template>
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-test="SubVenues-alert"/>
  <Loading v-if="isLoading"/>
  <v-select
    v-if="!isLoading && SubVenues?.length" :item-props="itemProps"
    :items="SubVenues" label="SubVenues"
    v-model="SubVenue" data-test="SubVenues-select">
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchSubVenues } from '@/services/api.subvenue.js'
import { formatErrorMessage } from '@/utils/formatMessage.js'

const props = defineProps({
  venue_id: String,
  venue_name: String
})
const { getAccessTokenSilently } = useAuth0();
const emit = defineEmits(['SubVenueChange']);
const SubVenues = ref(null);
const SubVenue = ref(null);
const errorMessage = ref(null)
const isLoading = ref(true)

watch(SubVenue, (newValue) => {
  emit('SubVenueChange', newValue)
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
  } else {
    SubVenues.value = data
  }
  isLoading.value = false
})

</script>
