<template>
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-test="gameData-alert"/>
  <Loading v-if="isLoading"/>
  <v-container>
    <!-- Season Filter + Save All -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <SeasonSelect @seasonChange="handleSeasonChange"/>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn
          :disabled="!dirtyGames.length"
          color="primary"
          @click="saveAllGames"
        >
          Save All
        </v-btn>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-data-table v-if="selectedSeason"
      :headers="headers"
      :items="games"
      :hide-default-footer="games.length < 11"
      item-value="id"
      class="elevation-1"
    >
      <!-- Venue Dropdown -->
      <template #item.venue="{ item }">
        <VenueSelect
          :selected="item.venue_id"
          @venueChange="val => {
            if (item?.venue_id !== val?.id) {
              item.venue = val
              item.subVenue = null
              markDirty(item)
            }
          }"
          style="min-width: 150px"
          density="compact"
        />
      </template>

      <!-- SubVenue -->
      <template #item.subVenue="{ item }">
        <SubVenueSelect
          :venue_id="item?.venue_id"
          :selected="item?.sub_venue_id"
          @SubVenueChange="val => { item.subVenue = val; markDirty(item) }"
          style="min-width: 150px"
          density="compact"
        />
      </template>

      <!-- Date Picker -->
      <template #item.date="{ item }">
        <v-text-field
          :model-value="getDate(item).value"
          type="date"
          hide-details
          density="compact"
          @input="val => setDate(item, val)"
        />
      </template>

      <!-- Time Picker -->
      <template #item.time="{ item }">
        <v-text-field
          :model-value="getTime(item).value"
          type="time"
          density="compact"
          hide-details
          @input="val => setTime(item, val)"
        />
      </template>

      <!-- Actions: Save / Cancel / Status -->
      <template #item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon v-if="item.dirty" color="orange" class="me-1" icon="mdi-pencil" size="small"></v-icon>
          <v-icon v-else-if="item.justSaved" color="green" class="me-1" icon="mid-check" size="small"></v-icon>
        <v-btn
          icon
          color="green"
          size="x-small"
          @click="saveGame(item)"
          :disabled="!item.dirty"
        >
          <v-icon icon="mdi-content-save"></v-icon>
        </v-btn>

        <v-btn
          icon
          color="grey"
          size="x-small"
          @click="resetGame(item)"
          :disabled="!item.dirty"
        >
          <v-icon icon="mdi-undo"></v-icon>
        </v-btn>
      </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VenueSelect from '@/components/venue/VenueSelect.vue'
import SubVenueSelect from '@/components/venue/SubVenueSelect.vue'
import SeasonSelect from '@/components/season/SeasonSelect.vue'
import { fetchGames } from '@/services/api.game'
import { formatErrorMessage } from '@/utils/formatMessage.js'
import { useAuth0 } from '@auth0/auth0-vue';

const { getAccessTokenSilently } = useAuth0();

const errorMessage = ref(null)
const isLoading = ref(true)
const games = ref([])

const originalData = ref({})
const tempTimes = ref({})

// Populate tracking maps on mount
onMounted(() => {
  games.value.forEach(game => {
    originalData.value[game.id] = { ...game }
    tempTimes.value[game.id] = game.time
  })
  isLoading.value = false

})

// Headers
const headers = [
  { title: 'Venue', key: 'venue' },
  { title: 'Sub-Venue', key: 'subVenue' },
  { title: 'Date', key: 'date' },
  { title: 'Time', key: 'time', width: '135px' },
  { title: 'Home Team', key: 'home_team' },
  { title: 'Away Team', key: 'away_team' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Season filter
const selectedSeason = ref(null)

// Dirty logic
const markDirty = (game) => {
  const original = originalData.value[game.id]
  const changed =
    game.date !== original.date ||
    game.time !== original.time ||
    game.venue !== original.venue ||
    game.subVenue !== original.subVenue ||
    game.homeTeam !== original.homeTeam ||
    game.awayTeam !== original.awayTeam

  game.dirty = changed
  game.justSaved = false
}

const saveGame = (game) => {
  originalData.value[game.id] = { ...game }
  game.dirty = false
  game.justSaved = true
  setTimeout(() => {
    game.justSaved = false
  }, 2000)
}

const resetGame = (game) => {
  const original = originalData.value[game.id]
  Object.assign(game, { ...original })
  game.dirty = false
  game.justSaved = false
  tempTimes.value[game.id] = original.time
}

const dirtyGames = computed(() =>
  games.value.filter(g => g.dirty)
)

const saveAllGames = () => {
  dirtyGames.value.forEach(saveGame)
}

function getTime(item) {
  return computed({
    get() {
      if (!item.game_dt) return ''
      const date = new Date(item.game_dt)
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    },
    set(val) {
      const [hours, minutes] = val.split(':').map(Number)
      const date = item.game_dt ? new Date(item.game_dt) : new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      date.setSeconds(0)
      date.setMilliseconds(0)
      item.game_dt = date.toISOString().slice(0, 19).replace('T', ' ')
      markDirty(item)
    }
  })
}

function getDate(item) {
  return computed({
    get() {
      if (!item.game_dt) return ''
      const date = new Date(item.game_dt)
      const year = String(date.getFullYear())
      const month = String(date.getMonth()+1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    set(val) {
      const [mm, dd, yyyy] = val.split('-').map(Number)
      const date = item.game_dt ? new Date(item.game_dt) : new Date()
      date.setMonth(mm)
      date.setDate(dd)
      date.setFullYear(yyyy)
      date.setMilliseconds(0)
      item.game_dt = date.toISOString().slice(0, 19).replace('T', ' ')
      markDirty(item)
    }
  })
}

async function handleSeasonChange(season) {
  selectedSeason.value = season
  if (!selectedSeason) return

  const token = await getAccessTokenSilently();
  isLoading.value = true;

  const params = {
    season_id: season
  }
  const { data, error } = await fetchGames(token, params);
  if (data) {
    games.value = data;
  }

  if (error?.message) {
    errorMessage.value = `Error Fetching Games: ${formatErrorMessage(error.message)}`;
  }
  isLoading.value = false;
}
</script>
