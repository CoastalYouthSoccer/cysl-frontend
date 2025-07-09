<template>
  <v-select
    v-if="getSubVenues?.length"
    :item-props="itemProps"
    :items="getSubVenues"
    label="SubVenues"
    v-model="subVenue"
    data-test="SubVenues-select">
  </v-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useShareStore } from '@/stores/sharedData'
const shareStore = useShareStore()
const { getSubVenues } = storeToRefs(shareStore)

const props = defineProps({
  venue_id: String,
  venue_name: String,
  selected: {
    type: Object,
    default: null
  }
})
const subVenue = ref(props.selected ?? null)
const emit = defineEmits(['SubVenueChange']);

watch(subVenue, (newValue) => {
  emit('SubVenueChange', newValue)
})

function itemProps(item) {
  return {
    name: item.name
  };
}

</script>
