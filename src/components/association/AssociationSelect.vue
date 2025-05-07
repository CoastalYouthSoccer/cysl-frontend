<template>
  <v-select
    v-if="associations" :item-props="itemProps" :items="associations" label="Association"
    v-model="association" data-testid="association-select">
  </v-select>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchAssociations } from '@/services/api.association.js'

const { getAccessTokenSilently } = useAuth0();
const emit = defineEmits(['associationChange']);
const associations = ref(null);
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

async function getAssociations() {
  const token = await getAccessTokenSilently();
  const { data, error } = await fetchAssociations(token);

  if (data) {
    associations.value = data;
  }

  if (error && error.message) {
    console.error(`Error fetching associations: ${error.message}`);
  }
}

onBeforeMount(() => {
  getAssociations()
})

</script>
