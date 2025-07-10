<template>
  <v-select
    :item-value="'id'"
    :item-title="'name'"
    :items="getSeasons"
    v-model="season"
    placeholder="Select a season"
    data-test="season-select">
  </v-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia';
import {  useShareStore } from '@/stores/sharedData';
const seasonStore = useShareStore()
const { getSeasons } = storeToRefs(seasonStore)

const emit = defineEmits(['seasonChange']);
const season = ref(null);

watch(season, (newValue) => {
  emit('seasonChange', newValue)
})

</script>
