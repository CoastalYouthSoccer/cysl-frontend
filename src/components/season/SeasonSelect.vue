<template>
  <Alert v-if="errorMessage" :msg=errorMessage data-test="season-alert"/>
  <Loading v-if="isLoading"/>

  <v-select
    v-if="!isLoading && seasons?.length" :item-props="itemProps" :items="seasons" label="Season"
    v-model="season" data-test="season-select">
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchSeasons } from '@/services/api.season.js'
import { formatErrorMessage } from '@/utils/formatMessage.js'
import Alert from '../Alert.vue';

const { getAccessTokenSilently } = useAuth0();
const emit = defineEmits(['seasonChange']);
const seasons = ref(null);
const season = ref(null);
const errorMessage = ref(null)
const isLoading = ref(true)

watch(season, (newValue) => {
  emit('seasonChange', newValue)
})

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.city,
  };
}

async function getSeasons() {
  const token = await getAccessTokenSilently();
  const { data, error } = await fetchSeasons(token);
  if (error?.message) {
    errorMessage.value = `Error Fetching Seasons: ${formatErrorMessage(error.message)}`
  } else {
    seasons.value = data
  }
  isLoading.value = false
}

onBeforeMount(() => {
  getSeasons()
})

</script>
