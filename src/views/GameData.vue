<template>
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-test="gameData-alert"/>
  <Loading v-if="isLoading"/>
  <v-container>
    <!-- Season Filter + Save All -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <SeasonSelect/>
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
    <v-data-table
      :headers="headers"
      :items="filteredGames"
      item-value="id"
      class="elevation-1"
    >
      <!-- Venue Dropdown -->
      <template #item.venue="{ item }">
        <VenueSelect
          :selected="item.venue.id"
          @venueChange="val => {
            if (item.venue?.id !== val?.id) {
              item.venue = val
              item.subVenue = null
              markDirty(item)
            }
          }"
          style="min-width: 150px"
        />
      </template>

      <!-- SubVenue -->
      <template #item.subVenue="{ item }">
        <SubVenueSelect
          :venue_id="item.venue?.id"
          :selected="item.subVenue?.id"
          @SubVenueChange="val => { item.subVenue = val; markDirty(item) }"
          style="min-width: 150px"
        />
      </template>

      <!-- Time Picker -->
      <template #item.time="{ item }">
        <v-text-field
          v-model="item.time"
          density="compact"
          hide-details
          @input="markDirty(item)"
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

const errorMessage = ref(null)
const isLoading = ref(true)

const games = ref([
  {
    id: 1,
    venue: 'Main Stadium',
    subVenue: 'Field A',
    date: '2025-07-05',
    time: '15:00',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    dirty: false,
    justSaved: false,
  },
  {
    id: 2,
    venue: 'Main Stadium',
    subVenue: 'Field B',
    date: '2025-07-05',
    time: '16:30',
    homeTeam: 'Team C',
    awayTeam: 'Team D',
    dirty: false,
    justSaved: false,
  },
  {
    id: 3,
    venue: 'East Complex',
    subVenue: 'Field 1',
    date: '2025-07-06',
    time: '14:00',
    homeTeam: 'Team E',
    awayTeam: 'Team F',
    dirty: false,
    justSaved: false,
  },
])

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
  { title: 'Home Team', key: 'homeTeam' },
  { title: 'Away Team', key: 'awayTeam' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Date filter
const selectedDate = ref(null)
const filteredGames = computed(() => {
  if (!selectedDate.value) return games.value
  return games.value.filter(g => g.date === selectedDate.value)
})

// Dirty logic
const markDirty = (game) => {
  const original = originalData.value[game.id]
  const changed =
    game.time !== original.time ||
    game.venue !== original.venue ||
    game.subVenue !== original.subVenue ||
    game.homeTeam !== original.homeTeam ||
    game.awayTeam !== original.awayTeam

  game.dirty = changed
  game.justSaved = false
}

const saveGame = (game) => {
  console.log('Saved:', { ...game })
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
</script>
