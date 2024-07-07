<template>
  <v-form id="profile-form" v-model="valid">
    <v-container :fluid=true>
      <v-row justify="center">
        <v-col sm="4" lg="4">
          <v-text-field label="First Name" type="text" v-model="firstName" data-test="firstName" :disabled="true"/>
        </v-col>
        </v-row>
        <v-row justify="center">
        <v-col sm="4" lg="4">
          <v-text-field label="Last Name" type="text" v-model="lastName" data-test="lastName" :disabled="true"/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col sm="2" lg="2">
          <v-checkbox v-model="isReferee" label="Referee?" data-test="isReferee" :disabled="true"/>
        </v-col>
        <v-col sm="2" lg="2">
          <v-checkbox v-model="isAssignor" label="Assignor?" data-test="isAssignor" :disabled="true"/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col sm="2" lg="2">
          <v-btn color="success" rounded type="submit" data-test="update">Update</v-btn>
        </v-col>
        <v-col sm="2" lg="2">
          <v-btn color="info" rounded type="button" @click="cancel" data-test="cancel">Cancel</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <Alert :text=msg color="success" v-if="msg && !apiError"/>
  <Alert :text=msg color="red-darken-4" v-if="msg && apiError"/>
</template>

<script setup>
  import { watch, ref } from "vue";
  import { useAuth0 } from "@auth0/auth0-vue";
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  import Alert from "@/components/Alert.vue";

  const baseURL = window.location.origin;

  const msg = ref(null);
  const firstName = ref(null);
  const lastName = ref(null);
  const isReferee = ref(false);
  const isAssignor = ref(false);

  const apiError = ref(false);
  const valid = ref(false);

  watch(user, function() {
    firstName.value = user.value?.given_name
    lastName.value = user.value?.family_name;
    isReferee.value = user.value?.user_roles.includes("referee");
    isAssignor.value = user.value?.user_roles.includes("assignor");
    valid.value = isAuthenticated;
  });

  function cancel() {
    console.log('cancel')
  }
  </script>
