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
              item.venue_id = val?.id
              item.subVenue = null
              item.sub_venue_id = null
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
          @SubVenueChange="val => {
            item.subVenue = val
            item.sub_venue_id = val?.id || null
            markDirty(item)
          }"
          style="min-width: 150px"
          density="compact"
        />
      </template>

      <!-- Date Picker -->
      <template #item.date="{ item }">
        <v-text-field
          :model-value="formatDate(item.game_dt)"
          @update:model-value="val => updateDate(item, val)"
          type="date"
          hide-details
          density="compact"
        />
      </template>

      <!-- Time Picker -->
      <template #item.time="{ item }">
        <v-text-field
          :model-value="formatTime(item.game_dt)"
          @update:model-value="val => updateTime(item, val)"
          type="time"
          density="compact"
          hide-details
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
    game.game_dt !== original.game_dt ||
    game.venue_id !== original.venue_id ||
    game.sub_venue_id !== original.sub_venue_id

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
  Object.assign(game, JSON.parse(JSON.stringify(original)));
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
    originalData.value = {}
    data.forEach(game => {
      originalData.value[game.id] = JSON.parse(JSON.stringify(game))
    })
  }

  if (error?.message) {
    errorMessage.value = `Error Fetching Games: ${formatErrorMessage(error.message)}`;
  }
  isLoading.value = false;
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function updateDate(item, val) {
  const [yyyy, mm, dd] = val.split('-').map(Number)
  const date = item.game_dt ? new Date(item.game_dt) : new Date()

  const hh = date.getUTCHours()
  const min = date.getUTCMinutes()
  console.log(`hh: ${hh}, min: ${min}`)
  const utcDate = new Date(Date.UTC(yyyy, mm - 1, dd, hh, min, 0))
  console.log(`date: ${utcDate.toISOString()}`)
  item.game_dt = utcDate.toISOString().slice(0, 19).replace('T', ' ')
  markDirty(item)
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mm = String(date.getUTCMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function updateTime(item, val) {
  const [hh, mm] = val.split(':').map(Number)
  const date = item.game_dt ? new Date(item.game_dt) : new Date()
  const yyyy = date.getUTCFullYear()
  const mmIndex = date.getUTCMonth()
  const dd = date.getUTCDate()
  const utcDate = new Date(Date.UTC(yyyy, mmIndex, dd, hh, mm, 0))
  item.game_dt = utcDate.toISOString().slice(0, 19).replace('T', ' ')

  markDirty(item)
}
</script>
