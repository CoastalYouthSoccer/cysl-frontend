<template>
  <v-select
    :item-props="itemProps"
    :item-value="'id'"
    :item-title="'name'"
    :items="getVenues"
    v-model="venueId"
    placeholder="Select a venue"
    data-test="venue-select">
  </v-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useVenueSubVenueStore } from '@/stores/venueSubVenue';
const venueSubVenueStore = useVenueSubVenueStore()
const { getVenues } = storeToRefs(venueSubVenueStore)

const emit = defineEmits(['venueChange']);
const props = defineProps({
  selected: {
    type: [String, null],
    default: null
  }
})
const venueId = ref(props.selected ?? null)

watch(venueId, (newValue) => {
  const selected = getVenues.value.find(v => v.id === newValue)
  emit('venueChange', selected)
})

watch(() => props.selected, (newVal) => {
  venueId.value = newVal
})

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.city,
  };
}
</script>
