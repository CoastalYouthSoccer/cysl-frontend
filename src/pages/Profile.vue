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
          <v-checkbox v-model="isAdmin" label="Administrator?" data-test="isAdministrator" :disabled="true"/>
        </v-col>
        <v-col sm="2" lg="2">
          <v-checkbox v-model="isAssignor" label="Assignor?" data-test="isAssignor" :disabled="true"/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col sm="2" lg="2">
          <v-checkbox v-model="isReferee" label="Referee?" data-test="isReferee" :disabled="true"/>
        </v-col>
        <v-col sm="2" lg="2">
          <v-checkbox v-model="isCoach" label="Coach?" data-test="isCoach" :disabled="true"/>
        </v-col>
      </v-row>
        <v-row justify="center">
        <v-col sm="2" lg="2">
          <v-checkbox v-model="isLeagueRep" label="League Rep?" data-test="isLeagueRep" :disabled="true"/>
        </v-col>
        <v-col sm="2" lg="2">
          <v-checkbox v-model="isAssociationRep" label="Association Rep?" data-test="isAssociationRep" :disabled="true"/>
        </v-col>
      </v-row>
      <v-row justify="center">
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
  import { ref } from "vue";
  import Alert from "@/components/Alert.vue";
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore()
  const { isAssignor, isReferee, isAdmin, isCoach, isLeagueRep,
          isAssociationRep, firstName, lastName } = storeToRefs(userStore)
  const baseURL = window.location.origin;

  const msg = ref(null);

  const apiError = ref(false);
  const valid = ref(false);

  function cancel() {
    console.log('cancel')
  }
  </script>
