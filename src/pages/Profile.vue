<template>
  <v-form id="profile-form" v-model="valid">
    <v-container :fluid=true>
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
</template>

<script setup>
  import { ref } from "vue";
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore()
  const { isAssignor, isReferee, isAdmin, isCoach, isLeagueRep,
          isAssociationRep } = storeToRefs(userStore)

  const valid = ref(false);

  function cancel() {
    console.log('cancel')
  }
</script>
