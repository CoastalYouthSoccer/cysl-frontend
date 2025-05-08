<template>
  <v-container>
    This is the home page of CYSL Management system
    <Alert v-if="isAlert" :msg=errorMessage color='red'/>
  </v-container>
</template>
<script setup>
  import Alert from '@/components/Alert.vue';
  import { ref } from 'vue';

  const isAlert = ref(true)
  const errorMessage = ref('This is a test')
</script>

