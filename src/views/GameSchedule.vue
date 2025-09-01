<template>
  <v-container fluid>
    <!-- Header -->
    <v-row>
      <v-col>
        <h1 class="text-h4 font-weight-bold mb-4">Game Scheduler</h1>
        <v-divider class="mb-6"></v-divider>
      </v-col>
    </v-row>

    <!-- Controls -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedWeek"
          :items="weekOptions"
          label="Select Week"
          variant="outlined"
          density="compact"
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn
          color="primary"
          @click="addNewGame"
          prepend-icon="mdi-plus"
          variant="elevated"
        >
          Add Game
        </v-btn>
      </v-col>
    </v-row>

    <!-- Unscheduled Games Pool -->
    <v-row class="mb-6">
      <v-col>
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h6 pb-2">
            <v-icon class="mr-2">mdi-clipboard-list</v-icon>
            Unscheduled Games
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <div class="d-flex flex-wrap ga-3">
            <v-card
              v-for="game in unscheduledGames"
              :key="game.id"
              class="game-card unscheduled"
              :draggable="true"
              @dragstart="onDragStart($event, game)"
              elevation="3"
              min-width="280"
            >
              <v-card-text class="pa-3">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  {{ game.homeTeam }} vs {{ game.awayTeam }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(game.date) }}
                </div>
                <div class="text-caption text-medium-emphasis" v-if="game.venue">
                  <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                  {{ game.venue }}{{ game.subVenue ? ` - ${game.subVenue}` : '' }}
                </div>
              </v-card-text>
            </v-card>
          </div>
          <v-alert
            v-if="unscheduledGames.length === 0"
            type="info"
            variant="tonal"
            class="mt-3"
          >
            All games are scheduled!
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Calendar Grid -->
    <v-row>
      <v-col>
        <v-card elevation="2">
          <v-card-title class="text-h6 pa-4">
            <v-icon class="mr-2">mdi-calendar-month</v-icon>
            Weekly Schedule - {{ formatWeekRange(selectedWeek) }}
          </v-card-title>
          <v-divider></v-divider>

          <!-- Calendar Header -->
          <div class="calendar-grid">
            <div class="time-column header">Time</div>
            <div
              v-for="day in daysOfWeek"
              :key="day.date"
              class="day-column header"
            >
              <div class="font-weight-bold">{{ day.name }}</div>
              <div class="text-caption">{{ formatDate(day.date) }}</div>
            </div>

            <!-- Time Slots -->
            <template v-for="time in timeSlots" :key="time">
              <div class="time-column slot">{{ time }}</div>
              <div
                v-for="day in daysOfWeek"
                :key="`${day.date}-${time}`"
                class="day-column slot"
                :class="{ 'drop-zone-active': isDragOver === `${day.date}-${time}` }"
                @dragover.prevent
                @dragenter.prevent="onDragEnter(`${day.date}-${time}`)"
                @dragleave.prevent="onDragLeave"
                @drop.prevent="onDrop($event, day.date, time)"
              >
                <!-- Scheduled Games -->
                <v-card
                  v-for="game in getScheduledGames(day.date, time)"
                  :key="game.id"
                  class="game-card scheduled ma-1"
                  :draggable="true"
                  @dragstart="onDragStart($event, game)"
                  elevation="2"
                >
                  <v-card-text class="pa-2">
                    <div class="text-subtitle-2 font-weight-bold text-truncate">
                      {{ game.homeTeam }} vs {{ game.awayTeam }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      <span v-if="game.venue">{{ game.venue }}</span>
                      <span v-if="game.subVenue"> - {{ game.subVenue }}</span>
                      <span v-if="!game.venue && !game.subVenue">Venue TBD</span>
                    </div>
                    <div v-if="game.homeScore !== null && game.awayScore !== null" class="text-caption mt-1">
                      <v-chip size="x-small" color="success" variant="tonal">
                        {{ game.homeScore }} - {{ game.awayScore }}
                      </v-chip>
                    </div>
                    <v-btn
                      icon="mdi-close"
                      size="x-small"
                      variant="text"
                      class="unschedule-btn"
                      @click="unscheduleGame(game)"
                    ></v-btn>
                  </v-card-text>
                </v-card>
              </div>
            </template>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Game Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card>
        <v-card-title>Add New Game</v-card-title>
        <v-card-text>
          <v-form ref="gameForm">
            <v-text-field
              v-model="newGame.homeTeam"
              label="Home Team"
              variant="outlined"
              required
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="newGame.awayTeam"
              label="Away Team"
              variant="outlined"
              required
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="newGame.date"
              label="Date"
              type="date"
              variant="outlined"
              required
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="newGame.venue"
              label="Venue (optional)"
              variant="outlined"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="newGame.subVenue"
              label="Sub-venue (optional)"
              variant="outlined"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showAddDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveNewGame">Add Game</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const selectedWeek = ref(0)
const isDragOver = ref(null)
const showAddDialog = ref(false)
const draggedGame = ref(null)

// Form data
const newGame = ref({
  homeTeam: '',
  awayTeam: '',
  date: '',
  venue: '',
  subVenue: ''
})

// Mock game data
const games = ref([
  {
    id: 1,
    date: '2024-03-11',
    time: '10:00 AM',
    venue: 'Memorial Stadium',
    subVenue: 'Field A',
    homeTeam: 'Lions',
    awayTeam: 'Tigers',
    homeScore: 2,
    awayScore: 1
  },
  {
    id: 2,
    date: '2024-03-11',
    time: '2:00 PM',
    venue: 'Central Park',
    subVenue: null,
    homeTeam: 'Eagles',
    awayTeam: 'Hawks',
    homeScore: null,
    awayScore: null
  },
  {
    id: 3,
    date: '2024-03-12',
    time: null,
    venue: null,
    subVenue: null,
    homeTeam: 'Bears',
    awayTeam: 'Wolves',
    homeScore: null,
    awayScore: null
  },
  {
    id: 4,
    date: '2024-03-13',
    time: null,
    venue: 'Sports Complex',
    subVenue: 'Court 1',
    homeTeam: 'Panthers',
    awayTeam: 'Cougars',
    homeScore: null,
    awayScore: null
  },
  {
    id: 5,
    date: '2024-03-14',
    time: '11:00 AM',
    venue: null,
    subVenue: null,
    homeTeam: 'Sharks',
    awayTeam: 'Dolphins',
    homeScore: 3,
    awayScore: 2
  }
])

// Time slots for the calendar
const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
]

// Week options
const weekOptions = [
  { title: 'March 11-17, 2024', value: 0 },
  { title: 'March 18-24, 2024', value: 1 },
  { title: 'March 25-31, 2024', value: 2 }
]

// Computed properties
const daysOfWeek = computed(() => {
  const baseDate = new Date(2024, 2, 11) // March 11, 2024 (Monday)
  const weekStart = new Date(baseDate)
  weekStart.setDate(baseDate.getDate() + (selectedWeek.value * 7))

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return {
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toISOString().split('T')[0]
    }
  })
})

const unscheduledGames = computed(() => {
  return games.value.filter(game => !game.time)
})

const scheduledGames = computed(() => {
  return games.value.filter(game => game.time)
})

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatWeekRange = (weekIndex) => {
  const option = weekOptions.find(w => w.value === weekIndex)
  return option ? option.title : ''
}

const getScheduledGames = (date, time) => {
  return scheduledGames.value.filter(game =>
    game.date === date && game.time === time
  )
}

const onDragStart = (event, game) => {
  draggedGame.value = game
  event.dataTransfer.effectAllowed = 'move'
}

const onDragEnter = (slotId) => {
  isDragOver.value = slotId
}

const onDragLeave = () => {
  isDragOver.value = null
}

const onDrop = (event, date, time) => {
  if (draggedGame.value) {
    const game = games.value.find(g => g.id === draggedGame.value.id)
    if (game) {
      game.date = date
      game.time = time
    }
  }
  isDragOver.value = null
  draggedGame.value = null
}

const unscheduleGame = (game) => {
  const gameRef = games.value.find(g => g.id === game.id)
  if (gameRef) {
    gameRef.time = null
  }
}

const addNewGame = () => {
  newGame.value = {
    homeTeam: '',
    awayTeam: '',
    date: '',
    venue: '',
    subVenue: ''
  }
  showAddDialog.value = true
}

const saveNewGame = () => {
  if (newGame.value.homeTeam && newGame.value.awayTeam && newGame.value.date) {
    const id = Math.max(...games.value.map(g => g.id)) + 1
    games.value.push({
      id,
      ...newGame.value,
      time: null,
      homeScore: null,
      awayScore: null,
      venue: newGame.value.venue || null,
      subVenue: newGame.value.subVenue || null
    })
    showAddDialog.value = false
  }
}

onMounted(() => {
  // Component mounted
})
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
}

.time-column {
  background-color: #f5f5f5;
  padding: 12px 8px;
  text-align: center;
  font-weight: 500;
  border-right: 1px solid #e0e0e0;
}

.day-column {
  background-color: white;
  min-height: 80px;
  position: relative;
}

.day-column.header {
  background-color: #f8f9fa;
  padding: 12px 8px;
  text-align: center;
  min-height: auto;
}

.day-column.slot {
  padding: 4px;
  transition: background-color 0.2s;
}

.day-column.slot:hover {
  background-color: #f0f4f8;
}

.drop-zone-active {
  background-color: #e3f2fd !important;
  border: 2px dashed #2196f3;
}

.game-card {
  cursor: move;
  transition: all 0.2s;
  position: relative;
}

.game-card:hover {
  transform: translateY(-2px);
}

.game-card.unscheduled {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-left: 4px solid #ff9800;
}

.game-card.scheduled {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%);
  border-left: 4px solid #4caf50;
}

.unschedule-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.game-card:hover .unschedule-btn {
  opacity: 1;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
