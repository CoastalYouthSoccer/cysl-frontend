<template>
  <v-tooltip text="Login to access additional content.">
    <template v-slot:activator="{ props }">
      <v-btn icon @click="handleLogin" data-test="login-btn">
        <v-icon>mdi-login</v-icon>Login
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup>
  import { ref } from "vue";
  import { useAuth0 } from "@auth0/auth0-vue";

  const { loginWithRedirect } = useAuth0();
  const tooltip = ref(false);

  const handleLogin = () => {
    loginWithRedirect({
      prompt: "login",
      appState: {
        target: "/",
      },
    });
  };

</script>
