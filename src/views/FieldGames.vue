<template>
  <div v-if="errorExist">
    <Alert
      :msg="errorMsg"
      color="red"
    />
  </div>
  <h1>Field Coordinator Screen</h1>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-date-input v-model="gameDate" label="Date" :rules="[rules.required]"></v-date-input>
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
          <v-btn color="primary" @click="returnGames(gameDate, venue)">
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
          width="100%"
          rounded
      >
        <div>
          <h2 class="text-h4 font-weight-black" style="padding: 20px;">{{ fieldName }}</h2>
          <v-table>
              <thead>
                <tr>
                  <th id="time">Time</th>
                  <th id="grade">Grade</th>
                  <th id="gender">Gender</th>
                  <th id="awayTeam">Away Team</th>
                  <th id="homeTeam">Home Team</th>
                  <th id="referee">Center</th>
                  <th id="ar1">AR1</th>
                  <th id="ar2">AR2</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(game, time) in timeSlots" :key="time">
                  <td>{{ time }}</td>
                  <td>{{  game.grade }}</td>
                  <td>{{  game.gender }}</td>
                  <td>{{ game.away_team }}</td>
                  <td>{{ game.home_team }}</td>
                  <td v-for="(official, officialIndex) in game.officials">
                    <v-chip
                      :key="officialIndex"
                      class="ma-1"
                      :color="official.accepted ? 'green' : 'red'"
                      text-color="white"
                      :text="`${official.first_name} ${official.last_name}`"
                      variant="elevated"
                      clickable
                      label
                    ></v-chip>
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
import Alert from "@/components/Alert.vue";

import { fetchAssignrGames } from '@/services/api.game.js'

const { getAccessTokenSilently } = useAuth0();

let venue = ref()
const dataExists = ref(false)
const loading = ref(false)
const games = ref(null)
const gameDate = ref(null)
const errorExist = ref(false)
const errorMsg = ref(null)
const errorType = ref(null)

const rules = {
  required: value => !!value || 'Required.',
}

function handleVenueChange(value) {
  venue.value = value.name;
}

async function returnGames(gameDate, venue) {
  if (!gameDate) {
    errorExist.value = true;
    errorMsg.value = "Date must be provided";
    return
  }
  if (!venue) {
    errorExist.value = true;
    errorMsg.value = "Venue must be provided";
    return
  }

  const token = await getAccessTokenSilently();
  loading.value = true;
  errorExist.value = false;
  errorType.value = "success";
  dataExists.value = false;
  const params = {
    start_dt: gameDate,
    end_dt: gameDate,
    venue: venue
  }
  const { data, error } = await fetchAssignrGames(token, params);

  if (data) {
    games.value = data;
    dataExists.value = true;
  }

  if (error.message) {
    console.error('Error fetching games:', error.message);
    errorExist.value = true;
    errorMsg.value = error.message;
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
