<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col>
        <div class="d-flex align-center mb-2">
          <v-icon icon="mdi-soccer-field" size="large" class="mr-3" color="primary"></v-icon>
          <h1 class="text-h3 font-weight-light text-primary">Field Coordinator</h1>
        </div>
        <p class="text-subtitle-1 text-medium-emphasis">Manage game schedules and venue assignments</p>
        <v-divider class="mt-4"></v-divider>
      </v-col>
    </v-row>

    <!-- Alert Section -->
    <v-row v-if="errorMessage" class="mb-4">
      <v-col>
        <v-alert
          :text="errorMessage"
          type="error"
          variant="tonal"
          closable
          @click:close="errorMessage = null"
          data-test="games-alert"
        ></v-alert>
      </v-col>
    </v-row>

    <!-- Search Form -->
    <v-card elevation="2" class="mb-6">
      <v-card-title class="bg-primary text-white">
        <v-icon icon="mdi-magnify" class="mr-2"></v-icon>
        Search Games
      </v-card-title>
      <v-card-text class="pa-6">
        <v-form>
          <v-row>
            <v-col cols="12" md="4">
              <v-date-input
                v-model="gameDate"
                label="Select Date"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-date-input>
            </v-col>
            <v-col cols="12" md="6">
              <VenueAssignrSelect
                @venueChange="handleVenueChange"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center">
              <v-btn
                color="primary"
                size="large"
                variant="elevated"
                @click="returnGames(gameDate, venue)"
                data-test="submit-btn"
                :loading="isLoading"
                block
              >
                <v-icon icon="mdi-magnify" class="mr-2"></v-icon>
                Search
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <v-row v-if="isLoading && !dataExists" class="justify-center">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
          class="mb-4"
        ></v-progress-circular>
        <p class="text-h6 text-medium-emphasis">Loading games...</p>
      </v-col>
    </v-row>

    <!-- Results Section -->
    <div v-if="dataExists">
      <!-- Results Header -->
      <v-card elevation="1" class="mb-4" color="surface-variant">
        <v-card-text class="py-4">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h2 class="text-h4 font-weight-medium" data-test="header">
                <v-icon icon="mdi-map-marker" class="mr-2" color="primary"></v-icon>
                {{ venue }}
              </h2>
              <p class="text-h6 text-medium mt-1 text-white">{{ formattedDate }}</p>
            </div>
            <v-chip
              color="success"
              variant="elevated"
              size="large"
              prepend-icon="mdi-check-circle"
            >
              {{ Object.keys(games || {}).length }} Field(s)
            </v-chip>
          </div>
        </v-card-text>
      </v-card>

      <!-- Games by Field -->
      <v-row>
        <v-col v-for="(timeSlots, fieldName) in games" :key="fieldName" cols="12">
          <v-card elevation="3" class="mb-4">
            <!-- Field Header -->
            <v-card-title class="bg-secondary text-white d-flex align-center">
              <v-icon icon="mdi-soccer-field" class="mr-2"></v-icon>
              {{ fieldName }}
              <v-spacer></v-spacer>
              <v-chip
                color="white"
                text-color="secondary"
                variant="elevated"
                size="small"
              >
                {{ Object.keys(timeSlots).length }} Games
              </v-chip>
            </v-card-title>

            <!-- Games Table -->
            <v-card-text class="pa-0">
              <v-table hover density="comfortable">
                <thead>
                  <tr class="bg-grey-lighten-5">
                    <th class="text-left font-weight-bold">
                      <v-icon icon="mdi-clock-outline" size="small" class="mr-1"></v-icon>
                      Time
                    </th>
                    <th class="text-left font-weight-bold">Age Group</th>
                    <th class="text-left font-weight-bold">
                      Gender
                    </th>
                    <th class="text-left font-weight-bold">Away Team</th>
                    <th class="text-center font-weight-bold">Away Score</th>
                    <th class="text-left font-weight-bold">Home Team</th>
                    <th class="text-center font-weight-bold">Home Score</th>
                    <th class="text-left font-weight-bold">
                      Referees
                    </th>
                    <th class="text-center font-weight-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(game, time) in timeSlots" :key="time" class="hover-row">
                    <td class="font-weight-medium text-primary">{{ time }}</td>
                    <td>
                      <v-chip
                        :color="getAgeGroupColor(game.age_group)"
                        variant="tonal"
                        size="small"
                        class="font-weight-medium"
                      >
                        {{ game.age_group }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip
                        :color="game.gender === 'Boys' ? 'blue' : game.gender === 'F' ? 'pink' : 'grey'"
                        variant="tonal"
                        size="small"
                      >
                        {{ game.gender }}
                      </v-chip>
                    </td>
                    <td class="font-weight-medium">{{ game.away_team }}</td>
                    <td class="text-center">
                      <v-chip
                        color="orange"
                        variant="outlined"
                        size="small"
                        class="font-weight-bold"
                      >
                        {{ game.report?.away_score ?? '-' }}
                      </v-chip>
                    </td>
                    <td class="font-weight-medium">{{ game.home_team }}</td>
                    <td class="text-center">
                      <v-chip
                        color="green"
                        variant="outlined"
                        size="small"
                        class="font-weight-bold"
                      >
                        {{ game.report?.home_score ?? '-' }}
                      </v-chip>
                    </td>
                    <td>
                      <div class="d-flex flex-wrap ga-1">
                        <v-chip
                          v-for="(official, officialIndex) in game.officials"
                          :key="officialIndex"
                          :color="official.accepted ? 'success' : 'error'"
                          variant="elevated"
                          size="small"
                          class="text-white font-weight-medium"
                        >
                          <v-icon
                            :icon="official.accepted ? 'mdi-check' : 'mdi-close'"
                            size="x-small"
                            class="mr-1"
                          ></v-icon>
                          {{ official.first_name }} {{ official.last_name }}
                        </v-chip>
                      </div>
                    </td>
                    <td class="text-center">
                      <v-btn
                        icon="mdi-file-document-outline"
                        variant="text"
                        color="primary"
                        size="small"
                        @click="viewReport(game.report)"
                        :disabled="!game.report"
                      >
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Game Report Dialog -->
    <v-dialog v-model="viewDialog" max-width="600" persistent>
      <v-card elevation="8">
        <v-card-title class="bg-primary text-white d-flex align-center">
          <v-icon icon="mdi-file-document" class="mr-2"></v-icon>
          Game Report Summary
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            size="small"
            @click="viewDialog = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-row v-if="record">
            <v-col cols="12">
              <v-text-field
                v-model="record.author"
                label="Report Author"
                prepend-inner-icon="mdi-account-edit"
                variant="outlined"
                readonly
                data-test="input-author"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-checkbox
                v-model="record.misconducts"
                label="Misconducts Reported"
                color="warning"
                readonly
                data-test="box-misconducts"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="4">
              <v-checkbox
                v-model="record.ejections"
                label="Ejections Occurred"
                color="error"
                readonly
                data-test="box-ejections"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="4">
              <v-checkbox
                v-model="record.no_show"
                label="Team No Show"
                color="info"
                readonly
                data-test="box-no-show"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            @click="viewDialog = false"
            data-test="close-btn"
          >
            <v-icon icon="mdi-check" class="mr-2"></v-icon>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, shallowRef, computed } from 'vue'
import { useAuth0 } from "@auth0/auth0-vue";

import { fetchAssignrGames } from '@/services/api.game.js'

const { getAccessTokenSilently } = useAuth0();

let venue = ref()
const dataExists = ref(false)
const isLoading = ref(false)
const games = ref(null)
const gameDate = ref(null)
const errorMessage = ref(null)
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

function getAgeGroupColor(ageGroup) {
  const colors = {
    'U8': 'green',
    'Grade 1/2': 'green',
    'U10': 'blue',
    'Grade 3/4': 'blue',
    'U12': 'purple',
    'Grade 5/6': 'purple',
    'U14': 'orange',
    'Grade 7/8': 'orange',
    'U16': 'red',
    'Grade 9/10': 'red',
    'U18': 'indigo',
    'Grade 11/12': 'indigo'
  }
  return colors[ageGroup] || 'grey'
}

async function returnGames(gameDate, venue) {
  if (!gameDate) {
    errorMessage.value = "Date must be provided";
    return
  }
  if (!venue) {
    errorMessage.value = "Venue must be provided";
    return
  }

  const token = await getAccessTokenSilently();
  isLoading.value = true;
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

  if (error?.message) {
    errorMessage.value = `Error Fetching Games: ${formatErrorMessage(error.message)}`
  }

  isLoading.value = false;
}

const formattedDate = computed(() => {
  if (!gameDate.value) return null;

  const date = new Date(gameDate.value);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
});
</script>

<style scoped>
.hover-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.v-card-title {
  font-weight: 500;
}

.v-table th {
  font-size: 0.875rem;
}

.v-chip {
  font-size: 0.75rem;
}
</style>
