<template>
  <Alert v-if="errorMessage" data-testid="association-alert"/>
  <div v-if="isLoading" class="d-flex justify-center my-4" data-testid="association-loading">
    <v-progress-circular indeterminate color="primary" />
  </div>
  <v-select
    v-if="!isLoading && associations.length" :item-props="itemProps"
    :items="associations" label="Association"
    v-model="association" data-testid="association-select">
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchAssociations } from '@/services/api.association.js'
import formatErrorMessage from '@/utils/formatMessage.js'
import Alert from '../Alert.vue';

const { getAccessTokenSilently } = useAuth0();
const emit = defineEmits(['associationChange']);
const associations = ref(null);
const association = ref(null);
const errorMessage = ref(null)
const isLoading = ref(true)

watch(association, (newValue) => {
  emit('associationChange', newValue)
})

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.city,
  };
}

onBeforeMount(async() => {
  const token = await getAccessTokenSilently();
  const { data, error } = await fetchAssociations(token);
  if (error?.message) {
    errorMessage.value = `Error fetching associations: ${formatErrorMessage(error.message)}`
    console.error(errorMessage.value)
  } else {
    associations.value = data
  }
  isLoading.value = false
})

</script>
