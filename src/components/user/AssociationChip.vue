<template>
  <div>
    <v-chip
      v-for="association in getAssociations"
      :key="association"
      class="ma-1"
      prepend-icon="mdi-home"
      :color="isAssigned(association) ? 'primary' : 'grey lighten-1'"
      :text-color="isAssigned(association) ? 'white' : 'black'"
      :text="association.name"
      variant="elevated"
      clickable
      label
      @click="toggleAssociation(association)"
    >
    </v-chip>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useShareStore } from '@/stores/sharedData';
const shareStore = useShareStore()
const { getAssociations } = storeToRefs(shareStore)

const props = defineProps({
  assignedAssociations: {
    type: Array,
    required: true,
  }
})

const emit = defineEmits(['update:assignedAssociations'])

const localAssigned = ref([...props.assignedAssociations])

const isAssigned = (association) => {
  return localAssigned.value.some(r => r === association)
}
const toggleAssociation = (association) => {
  if (isAssigned(association)) {
    localAssigned.value = localAssigned.value.filter(r => r !== association)
  } else {
    localAssigned.value.push(association)
  }

  emit('update:assignedAssociations', [...localAssigned.value])
}
</script>
