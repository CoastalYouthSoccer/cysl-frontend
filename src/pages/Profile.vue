<template>
  <v-form id="profile-form" v-model="valid">
    <v-container :fluid=true>
      <v-row justify="center">
        <v-col sm="4" lg="4">
          <v-text-field label="First Name" type="text" v-model="firstName" data-cy="firstName"/>
        </v-col>
        </v-row>
        <v-row justify="center">
        <v-col sm="4" lg="4">
          <v-text-field label="Last Name" type="text" v-model="lastName" data-cy="lastName"/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col sm="2" lg="2">
          <v-checkbox v-model="isReferee" label="Referee?" data-cy="isReferee"/>
        </v-col>
        <v-col sm="2" lg="2">
          <v-checkbox v-model="isAssignor" label="Assignor?" data-cy="isAssignor"/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col sm="2" lg="2">
          <v-btn color="success" rounded type="submit" data-cy="update">Update</v-btn>
        </v-col>
        <v-col sm="2" lg="2">
          <v-btn color="info" rounded type="button" @click="cancel" data-cy="cancel">Cancel</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <Alert :text=msg color="success" v-if="msg && !apiError"/>
  <Alert :text=msg color="red-darken-4" v-if="msg && apiError"/>
</template>

<script setup>
  import { ref } from "vue";
  import { useAuth0 } from "@auth0/auth0-vue";
  import { storeToRefs } from 'pinia';
  const { getAccessTokenSilently } = useAuth0();
  import { useUserStore } from '@/stores/user.js'
  import Alert from "@/components/Alert.vue";

  const baseURL = window.location.origin;
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const msg = ref(null);
  const firstName = ref(null);
  const lastName = ref(null);
  const isReferee = ref(false);
  const isAssignor = ref(false);

  const apiError = ref(false);
  const valid = ref(false);

//  export default defineComponent({
//    name: "Profile",
//    setup() {
//      const isCoach = ref(store.getters.isCoach);
//      const isReferee = ref(store.getters.isReferee);
//      const firstName = ref(store.getters.firstName);
//      const lastName = ref(store.getters.lastName);
//
//      return {
//        isCoach,
//        isReferee,
//        firstName,
//        lastName,
//  // Make First and Last Name read only with Social Accounts
//        isSocial: store.getters.isSocialLogin ? "readonly" : "",
//        getAccessTokenSilently,
//        msg,
//        apiError,
//        valid
//      }
//    },
//    methods: {
//      cancel(event) {
//        console.log("close form, return to prior page");
//      },
//      async submit() {
//        const accessToken = await this.getAccessTokenSilently();
//        store.commit('setIsCoach', this.isCoach);
//        store.commit('setIsReferee', this.isReferee);
//        store.commit('setFirstName', this.firstName);
//        store.commit('setLastName', this.lastName);
//        const postData = {
//          last_name: this.lastName, first_name: this.firstName,
//          is_coach: this.isCoach, is_referee: this.isReferee,
//          id: store.getters.userId
//        };
//
//        try {
//          this.apiError = false;
//          const res = await fetch(`${baseURL}/profile`, {
//            method: "post",
//            headers: {
//              "Content-Type": "application/json",
//              "Authorization": `Bearer ${accessToken}`,
//            },
//            body: JSON.stringify(postData),
//          });
//
//          if (!res.ok) {
//            this.apiError = true;
//            const message = `An error has occurred: ${res.status} - ${res.statusText}`;
//            throw new Error(message);
//          }
//
//          const data = await res.json();
//
//          const result = {
//            status: res.status + "-" + res.statusText,
//            headers: {
//              "Content-Type": res.headers.get("Content-Type"),
//              "Content-Length": res.headers.get("Content-Length"),
//            },
//            data: data,
//          };
//          this.msg = result.data;
//        } catch (err) {
//          this.apiError = true;
//          this.msg = err.message;
//        }
//      }
//    },
//    components: {
//      Alert
//    }
//  });

  </script>
