<template>
  <v-select
    v-if="getVenues?.length > 0"
    :item-props="itemProps"
    :items="getVenues"
    label="Venue"
    v-model="venue"
    data-test="venue-select">
  </v-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useShareStore } from '@/stores/sharedData'
const shareStore = useShareStore()
const { getVenues } = storeToRefs(shareStore)

const emit = defineEmits(['venueChange']);
const props = defineProps({
  selected: {
    type: Object,
    default: null
  }
})
const venue = ref(props.selected ?? null)

watch(venue, (newValue) => {
  emit('venueChange', newValue)
})

watch(() => props.selected, (newVal) => {
  venue.value = newVal
})

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.city,
  };
}
</script>
