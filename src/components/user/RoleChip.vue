<template>
  <div>
    <v-chip
      v-for="role in getRoles"
      :key="role.id"
      class="ma-1"
      prepend-icon="mdi-account-circle"
      :color="isAssigned(role) ? 'primary' : 'grey lighten-1'"
      :text-color="isAssigned(role) ? 'white' : 'black'"
      :text="role.name"
      variant="elevated"
      clickable
      label
      @click="toggleRole(role)"
    >
    </v-chip>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useShareStore } from '@/stores/sharedData';
const shareStore = useShareStore()
const { getRoles } = storeToRefs(shareStore)

const props = defineProps({
  assignedRoles: {
    type: Array,
    required: true,
  }
})

const emit = defineEmits(['update:assignedRoles'])

const localAssigned = ref([...props.assignedRoles])

const isAssigned = (role) => {
  return localAssigned.value.some(r => r.id === role.id)
}
const toggleRole = (role) => {
  if (isAssigned(role)) {
    localAssigned.value = localAssigned.value.filter(r => r.id !== role.id)
  } else {
    localAssigned.value.push(role)
  }

  emit('update:assignedRoles', [...localAssigned.value])
}
</script>
