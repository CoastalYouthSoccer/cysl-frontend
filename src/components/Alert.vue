<template>
  <div class="text-center ma-2">
    <v-snackbar
      :timeout="5000"
      :color=color
      variant="tonal"
      v-model="snackbar"
      data-test="alert-snackbar"
    >
      {{ msg }}
      <template v-slot:actions>
        <v-btn
          :color=color
          variant="text"
          @click="snackbar = false"
          data-test="alert-btn"
        >
          <strong>Close</strong>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const props = defineProps({
    msg: String,
    color: String
  })
  const snackbar = ref(true)
</script>
