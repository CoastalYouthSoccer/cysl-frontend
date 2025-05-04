<template>
  <button v-if="isAdmin">Manage Users</button>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.roles.includes('admin'))
</script>
