<template>
  <div v-if="errorExist">
    <Alert
      :msg="errorMsg"
      color="red"
    />
  </div>
  <div :class="['text-h3']">Field Coordinator Screen</div>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-date-input v-model="gameDate" label="Date" :rules="[rules.required]"></v-date-input>
        </v-col>
        <v-col cols="8">
          <VenueSelect @venueChange="handleVenueChange" :rules="[rules.required]"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-spacer></v-spacer>
        </v-col>
        <v-col>
          <v-btn
            color="primary"
            @click="returnGames(gameDate, venue)"
            data-test="submit-btn">
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
        <div :class="['text-h4']" data-test="header">{{ venue }} - {{ formattedDate }}</div>
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
          <div :class="['text-h5']">{{ fieldName }}</div>
          <v-table>
              <thead>
                <tr>
                  <th id="time">Time</th>
                  <th id="age">Age</th>
                  <th id="gender">Gender</th>
                  <th id="awayTeam">Away Team</th>
                  <th id="awayScore">Away Score</th>
                  <th id="homeTeam">Home Team</th>
                  <th id="homeScore">Home Score</th>
                  <th id="referees">Referees</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(game, time) in timeSlots" :key="time">
                  <td>{{ time }}</td>
                  <td>{{ game.age_group }}</td>
                  <td>{{ game.gender }}</td>
                  <td>{{ game.away_team }}</td>
                  <td>{{ game.report.away_score }}</td>
                  <td>{{ game.home_team }}</td>
                  <td>{{ game.report.away_score }}</td>
                  <td>
                    <v-chip v-for="(official, officialIndex) in game.officials"
                      :key="officialIndex"
                      :color="official.accepted ? 'green' : 'red'"
                      text-color="white"
                      :text="`${official.first_name} ${official.last_name}`"
                      @click="viewReport(game.report)"
                    ></v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
        </div>
      </v-sheet>
    </v-row>
  </v-container>
  <v-dialog v-model="viewDialog" max-width="500">
    <v-card
      title="Game Report Summary"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="record.author" label="Author"
            data-test="input-author" disabled></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-checkbox v-model="record.misconducts" label="Misconducts"
            data-test="box-misconducts" disabled></v-checkbox>
          </v-col>

          <v-col cols="12" md="6">
            <v-checkbox v-model="record.ejections" label="Ejections"
            data-test="box-ejections" disabled></v-checkbox>
          </v-col>

          <v-col cols="12" md="6">
            <v-checkbox v-model="record.no_show" label="No Show"
            data-test="box-no-show" disabled></v-checkbox>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Close" variant="plain" @click="viewDialog = false" data-test="close-btn"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref, shallowRef, computed } from 'vue'
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
const viewDialog = shallowRef(false)
const record = ref(null)

function viewReport (item) {
  record.value = { ...item }
  viewDialog.value = true
}

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
  const date = new Date(`${gameDate.value}T00:00:00`);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
})
</script>
