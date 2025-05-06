<template>
  <v-select
    v-if="seasons" :item-props="itemProps" :items="seasons" label="Season"
    v-model="season" >
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'

import { fetchSeasons } from '@/services/api.season.js'

const emit = defineEmits(['seasonChange']);
const seasons = ref(null);
const season = ref(null);

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
  const { data, error } = await fetchSeasons();

  if (data) {
    seasons.value = data;
  }

  if (error && error.message) {
    console.error('Error fetching seasons:', error.message);
  }
}

onBeforeMount(() => {
  getSeasons()
})

</script>
