<template>
  <div v-if="errorExist">
    <v-alert
      :type=errorType
      variant="outlined"
      close-label="Close"
      closable
    >
    {{  errorMsg }}
    </v-alert>
  </div>
  <h1>Field Coordinator Screen</h1>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-date-input v-model="gameDate" label="Date input"></v-date-input>
        </v-col>
        <v-col cols="8">
          <VenueSelect @venueChange="handleVenueChange"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-spacer></v-spacer>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="returnGames(gameDate, gameDate, venue)">
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>

  <div class="text-center" v-if="loading">
    <v-progress-circular
      color="primary"
      :size="200"
      :width="10"
      indeterminate
    ></v-progress-circular>
  </div>

  <v-container v-if="dataExists">
    <v-row>
      <v-col>
        <h1>{{ venue }} - {{ formattedDate }}</h1>
      </v-col>
    </v-row>
    <v-row v-for="(timeSlots, fieldName) in games" style="padding: 20px;">
      <v-sheet
          class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
          elevation="4"
          width="80%"
          rounded
      >
        <div>
          <h2 class="text-h4 font-weight-black" style="padding: 20px;">{{ fieldName }}</h2>
          <v-table>
              <thead>
                <th>Time</th>
                <th>Center</th>
                <th>AR1</th>
                <th>AR2</th>
              </thead>
              <tbody>
                <tr v-for="(game, time) in timeSlots" :key="time">
                  <td>{{ time }}</td>
                  <td v-for="(official, officialIndex) in game.officials" :key="officialIndex">
                    {{ official.first_name }} {{ official.last_name }}
                  </td>
                </tr>
              </tbody>
            </v-table>
        </div>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth0 } from "@auth0/auth0-vue";

import { fetchGames } from '@/services/api.game.js'

const { getAccessTokenSilently } = useAuth0();

let venue = ref()
const dataExists = ref(false)
const loading = ref(false)
const games = ref(null)
const gameDate = ref(null)
const errorExist = ref(false)
const errorMsg = ref(null)
const errorType = ref(null)

function handleVenueChange(value) {
  venue.value = value.name;
}

async function returnGames(startDt, endDt, venue) {
  loading.value = true;
  errorExist.value = false;
  errorType.value = "success";
  dataExists.value = false;
  const params = {
    start_dt: startDt,
    end_dt: endDt,
    venue: venue
  }
  const accessToken = await getAccessTokenSilently({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: import.meta.env.VITE_AUTH0_SCOPE,
    },
  });
  const { data, error } = await fetchGames(accessToken, params);

  if (data) {
    console.log(data);
    games.value = data;
    dataExists.value = true;
  }

  if (error) {
    console.error('Error fetching games:', error);
    errorExist.value = true;
    errorMsg.value = error;
    errorType.value = "error";
  }

  loading.value = false;
}

const formattedDate = computed(() => {
  if (gameDate.value == null) {
    return null;
  }
  const date = new Date(gameDate.value);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
})
</script>
