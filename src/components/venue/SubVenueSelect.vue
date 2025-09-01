<template>
  <v-select
    :item-props="itemProps"
    :items="availableSubVenues"
    :item-value="'id'"
    :item-title="'name'"
    v-model="subVenueId"
    placeholder="Select a sub-venue"
    data-test="SubVenues-select">
  </v-select>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useVenueSubVenueStore } from '@/stores/venueSubVenue';
const venueSubVenueStore = useVenueSubVenueStore()

const props = defineProps({
  venue_id: {
    type: [String, null],
    default: null
  },
  selected: {
    type: [String, null],
    default: null
  }
})
const subVenueId = ref(props.selected ?? null)
const emit = defineEmits(['SubVenueChange']);

watch(subVenueId, (newValue) => {
  emit('SubVenueChange', newValue)
})

watch(() => props.selected, (newVal) => {
  subVenueId.value = newVal
})

function itemProps(item) {
  return {
    name: item.name
  };
}

const availableSubVenues = computed(() => venueSubVenueStore.subVenuesForVenue(props.venue_id) ?? [])
</script>
