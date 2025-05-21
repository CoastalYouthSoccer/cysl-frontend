<template>
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-test="association-alert"/>
  <div v-if="isLoading" class="d-flex justify-center my-4" data-test="association-loading">
    <v-progress-circular indeterminate color="primary" />
  </div>
  <v-select
    v-if="!isLoading && getAssociations.length" :item-props="itemProps"
    :items="getAssociations" label="Association"
    v-model="association" data-test="association-select">
  </v-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useShareStore } from '@/stores/sharedData'

const emit = defineEmits(['associationChange']);
const shareStore = useShareStore()
const { getAssociations } = storeToRefs(shareStore)
const association = ref(null);

watch(association, (newValue) => {
  emit('associationChange', newValue)
})

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.city,
  };
}
</script>
