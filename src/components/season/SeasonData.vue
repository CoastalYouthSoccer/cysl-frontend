<template>
  <!-- Alert Component -->
  <Alert v-if="errorMessage"
  :msg="errorMessage"
  data-test="season-alert"
  class="mb-4"/>

  <!-- Loading State -->
  <div v-if="isLoading"
   class="d-flex justify-center align-center"
   style="min-height: 400px;"
   data-test="season-loading">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </div>

  <!-- Main Content -->
  <div v-if="!isLoading">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Seasons</h1>
          <p class="text-subtitle-1 text--secondary mb-0">
            Manage and organize seasonal game schedules
          </p>
        </div>
        <v-btn
          v-if="allowEdit"
          color="success"
          size="large"
          prepend-icon="mdi-plus"
          class="add-button"
          elevation="2"
          data-test="add-season-btn"
          @click="add"
        >
          Add Season
        </v-btn>
      </div>
    </div>

    <!-- Data Table Card -->
    <v-card
      v-if="seasons?.length"
      class="data-table-card elevation-2"
      rounded="lg"
    >
      <v-card-title class="card-header">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-calendar-range</v-icon>
            <span class="text-h6 font-weight-medium">Season Overview</span>
          </div>
          <div class="d-flex align-center ga-3">
            <!-- Search -->
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search seasons..."
              variant="outlined"
              density="compact"
              hide-details
              class="search-field"
              style="max-width: 300px;"
            ></v-text-field>

            <!-- Filter -->
            <v-btn
              icon="mdi-filter-variant"
              variant="outlined"
              size="small"
            ></v-btn>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :headers="enhancedHeaders"
        :items="seasons"
        :search="searchQuery"
        :hide-default-footer="seasons?.length < 11"
        class="professional-table"
        :items-per-page="10"
        :sort-by="[{ key: 'start_dt', order: 'desc' }]"
      >
        <!-- Season Name Column -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" color="primary" class="mr-3">
              <v-icon color="white" size="16">mdi-calendar</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="text-caption text--secondary">
                {{ formatSeasonType(item.name) }}
              </div>
            </div>
          </div>
        </template>

        <!-- Start Date Column -->
        <template #item.start_dt="{ item }">
          <v-chip
            :color="getDateChipColor(item.start_dt)"
            variant="tonal"
            size="small"
          >
            <v-icon start size="14">mdi-calendar-start</v-icon>
            {{ formatDisplayDate(item.start_dt) }}
          </v-chip>
        </template>

        <!-- Length Column -->
        <template #item.season_length="{ item }">
          <div class="text-center">
            <v-chip
              color="info"
              variant="outlined"
              size="small"
            >
              {{ item.season_length }} weeks
            </v-chip>
          </div>
        </template>

        <!-- Holiday Dates Column -->
        <template #item.holiday_dates="{ item }">
          <div v-if="item.holiday_dates && item.holiday_dates.length">
            <v-chip
              v-for="(date, index) in formatHolidayDates(item.holiday_dates)"
              :key="index"
              color="warning"
              variant="tonal"
              size="small"
              class="mr-1 mb-1"
            >
              <v-icon start size="14">mdi-calendar-alert</v-icon>
              {{ date }}
            </v-chip>
          </div>
          <span v-else class="text--secondary">No holidays</span>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              v-if="allowEdit"
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              data-test="edit-season-btn"
              @click="edit(item)"
            >
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">
                Edit Season
              </v-tooltip>
            </v-btn>

            <v-btn
              icon="mdi-eye"
              variant="text"
              size="small"
              color="info"
              @click="viewSeason(item)"
            >
              <v-icon>mdi-eye</v-icon>
              <v-tooltip activator="parent" location="top">
                View Details
              </v-tooltip>
            </v-btn>

            <v-btn
              v-if="allowDelete"
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              data-test="delete-season-btn"
              @click="openDeleteDialog(item)"
            >
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="top">
                Delete Season
              </v-tooltip>
            </v-btn>
          </div>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">
              mdi-calendar-blank
            </v-icon>
            <h3 class="text-h6 mb-2">No Seasons Found</h3>
            <p class="text-body-2 text--secondary mb-4">
              Get started by creating your first season
            </p>
            <v-btn
              v-if="allowEdit"
              color="primary"
              prepend-icon="mdi-plus"
              data-test="add-season-btn"
              @click="add"
            >
              Create Season
            </v-btn>
            <v-btn
              v-else
              prepend-icon="mdi-refresh"
              variant="outlined"
              @click="getSeasons"
            >
              Refresh
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Empty State Card (when no seasons at all) -->
    <v-card v-else class="data-table-card elevation-2" rounded="lg">
      <v-card-text class="text-center pa-12">
        <v-icon size="80" color="grey-lighten-2" class="mb-4">
          mdi-calendar-plus
        </v-icon>
        <h2 class="text-h5 mb-3">Welcome to Season Management</h2>
        <p class="text-body-1 text--secondary mb-6" style="max-width: 400px; margin: 0 auto;">
          Start organizing your games by creating your first season. Define schedules,
          manage holidays, and keep everything organized in one place.
        </p>
        <v-btn
          v-if="allowEdit"
          color="success"
          size="large"
          prepend-icon="mdi-plus"
          class="add-button"
          elevation="2"
          data-test="add-season-btn"
          @click="add"
        >
          Create Your First Season
        </v-btn>
      </v-card-text>
    </v-card>
  </div>

  <!-- Add/Edit Dialog -->
  <v-dialog v-model="modifyDialog" max-width="600" persistent>
    <v-card class="modify-dialog-card" rounded="lg">
      <v-card-title class="dialog-header">
        <div class="d-flex align-center">
          <v-avatar size="32" :color="isEditing ? 'warning' : 'success'" class="mr-3">
            <v-icon color="white" size="16">
              {{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}
            </v-icon>
          </v-avatar>
          <div>
            <h3 class="text-h6 mb-0">{{ isEditing ? 'Edit' : 'Add' }} Season</h3>
            <p class="text-caption text--secondary mb-0">
              {{ isEditing ? 'Update season information' : 'Create a new season' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="seasonForm" v-model="formValid" @submit.prevent="save(record)">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="record.name"
                label="Season Name"
                placeholder="e.g., Spring 2025"
                variant="outlined"
                :rules="nameRules"
                prepend-inner-icon="mdi-tag-outline"
                data-test="input-name"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-date-input
                v-model="record.start_dt"
                label="Start Date"
                variant="outlined"
                :rules="startDateRules"
                prepend-inner-icon="mdi-calendar-start"
                data-test="start-date"
                required
              ></v-date-input>
            </v-col>

            <v-col cols="12" md="6">
              <v-number-input
                v-model="record.season_length"
                label="Season Length (weeks)"
                variant="outlined"
                :rules="lengthRules"
                prepend-inner-icon="mdi-calendar-week"
                :min="1"
                :max="52"
                data-test="season-length"
                required
              ></v-number-input>
            </v-col>

            <v-col cols="12">
              <v-date-input
                v-model="record.holiday_dates"
                label="Holiday Dates (Optional)"
                variant="outlined"
                multiple
                prepend-inner-icon="mdi-calendar-alert"
                data-test="holiday-dates"
                hint="Select dates when games should not be scheduled"
                persistent-hint
              ></v-date-input>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="dialog-actions pa-4">
        <v-btn
          variant="text"
          prepend-icon="mdi-close"
          data-test="modify-cancel-btn"
          @click="modifyDialog = false"
        >
          Cancel
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-content-save"
          :disabled="!formValid"
          data-test="modify-save-btn"
          @click="save(record)"
        >
          {{ isEditing ? 'Update' : 'Create' }} Season
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="deleteDialog" max-width="500" persistent>
    <v-card class="delete-dialog-card" rounded="lg">
      <v-card-title class="delete-dialog-header">
        <div class="d-flex align-center">
          <v-avatar size="32" color="error" class="mr-3">
            <v-icon color="white" size="16">mdi-alert</v-icon>
          </v-avatar>
          <div>
            <h3 class="text-h6 mb-0">Delete Season</h3>
            <p class="text-caption text--secondary mb-0">This action cannot be undone</p>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <div class="d-flex align-center mb-4">
          <v-icon color="warning" size="24" class="mr-3">mdi-alert-circle</v-icon>
          <span class="text-body-1">
            Are you sure you want to delete
            <strong>"{{ seasonToDelete?.name }}"</strong>?
          </span>
        </div>
        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-0"
        >
          This will permanently remove the season and all associated data.
        </v-alert>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="dialog-actions pa-4">
        <v-btn
          variant="text"
          prepend-icon="mdi-close"
          data-test="delete-cancel-btn"
          @click="deleteDialog = false"
        >
          Cancel
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          color="error"
          variant="flat"
          prepend-icon="mdi-delete"
          data-test="delete-delete-btn"
          @click="deleteItem(seasonToDelete)"
        >
          Delete Season
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, shallowRef, computed } from 'vue'
import { useDate } from 'vuetify'
import { useAuth0 } from '@auth0/auth0-vue'

import { useUserStore } from '@/stores/user'
import { fetchSeasons, deleteSeason, updateSeason, createSeason } from '@/services/api.season.js'
import { formatDateToYYYYMMDD } from '@/utils/date'
import { formatErrorMessage } from '@/utils/formatMessage.js'
import Alert from '../Alert.vue'

const adapter = useDate()
const { getAccessTokenSilently } = useAuth0()

const DEFAULT_RECORD = { name: '', start_dt: null, season_length: 0, holiday_dates: null }

// Reactive data
const seasons = ref([])
const seasonToDelete = ref(null)
const record = ref({ ...DEFAULT_RECORD })
const modifyDialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const isEditing = shallowRef(false)
const userStore = useUserStore()
const errorMessage = ref(null)
const isLoading = ref(true)
const searchQuery = ref('')
const formValid = ref(false)
const seasonForm = ref(null)

// Computed properties
const allowEdit = computed(() => userStore.user.permissions.includes('write:seasons'))
const allowDelete = computed(() => userStore.user.permissions.includes('delete:seasons'))

// Enhanced headers with better styling
const enhancedHeaders = [
  { title: 'Season Name', key: 'name', align: 'start', sortable: true },
  { title: 'Start Date', key: 'start_dt', sortable: true },
  { title: 'Length', key: 'season_length', align: 'center', sortable: true },
  { title: 'Holiday Dates', key: 'holiday_dates', sortable: false },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false }
]

// Form validation rules
const nameRules = [
  v => !!v || 'Season name is required',
  v => (v && v.length > 2 && v.length <= 50) || 'Name must be greater than 2 characters and less than 50 characters'
]

const startDateRules = [
  v => !!v || 'Start date is required'
]

const lengthRules = [
  v => !!v || 'Season length is required',
  v => (v && v > 0) || 'Season length must be greater than 0',
  v => (v && v <= 52) || 'Season length must be 52 weeks or less'
]

// Lifecycle
onMounted(() => {
  modifyDialog.value = false
  record.value = { ...DEFAULT_RECORD }
  getSeasons()
})

// Utility functions
const formatDisplayDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatSeasonType = (name) => {
  if (!name) return ''
  const parts = name.split(' ')
  return parts.length > 1 ? `${parts[0]} Season` : 'Season'
}

const formatHolidayDates = (dates) => {
  if (!dates || !Array.isArray(dates)) return []
  return dates.map(date => formatDisplayDate(date))
}

const getDateChipColor = (dateString) => {
  if (!dateString) return 'default'
  const date = new Date(dateString)
  const now = new Date()

  if (date > now) return 'success'
  if (date < now) return 'warning'
  return 'primary'
}

// Dialog functions
function openDeleteDialog(item) {
  seasonToDelete.value = item
  deleteDialog.value = true
}

function add() {
  isEditing.value = false
  record.value = { ...DEFAULT_RECORD }
  modifyDialog.value = true
}

function edit(item) {
  isEditing.value = true
  record.value = { ...item }
  modifyDialog.value = true
}

function viewSeason(item) {
  // Implement view functionality
  console.log('View season:', item)
}

function deleteItem(item) {
  deleteApiItem(item)
}

async function save(item) {
  if (!seasonForm.value?.validate()) return

  if (isEditing.value) {
    await updateItem(item)
  } else {
    await createItem(item)
  }

  modifyDialog.value = false
}

// API functions
async function getSeasons() {
  try {
    isLoading.value = true
    const token = await getAccessTokenSilently()
    const { data, error } = await fetchSeasons(token)

    if (error?.message) {
      errorMessage.value = `Error Fetching Seasons: ${formatErrorMessage(error.message)}`
    } else {
      seasons.value = data || []
    }
  } catch (err) {
    errorMessage.value = `Error: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

async function createItem(item) {
  try {
    item.start_dt = formatDateToYYYYMMDD(item.start_dt)
    const token = await getAccessTokenSilently()
    const { data, error } = await createSeason(item, token)

    if (data) {
      seasons.value.push(data)
      // Show success message
      errorMessage.value = null
    }

    if (error?.message) {
      errorMessage.value = `Error Creating Season: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = `Error: ${err.message}`
  }
}

async function updateItem(item) {
  try {
    const token = await getAccessTokenSilently()
    const { data, error } = await updateSeason(item, token)

    if (data) {
      const index = seasons.value.findIndex(season => season.id === data.id)
      if (index !== -1) {
        seasons.value[index] = data
      }
      errorMessage.value = null
    }

    if (error?.message) {
      errorMessage.value = `Error Updating Season: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = `Error: ${err.message}`
  }
}

async function deleteApiItem(season) {
  try {
    const token = await getAccessTokenSilently()
    const { error } = await deleteSeason(season.id, token)

    if (!error?.message) {
      const index = seasons.value.findIndex(s => s.id === season.id)
      if (index !== -1) {
        seasons.value.splice(index, 1)
      }
      errorMessage.value = null
    } else {
      errorMessage.value = `Error Deleting Season: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = `Error: ${err.message}`
  } finally {
    deleteDialog.value = false
  }
}
</script>

<style scoped>
/* Page Header Styling */
.page-header {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.add-button {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%) !important;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4) !important;
}

/* Data Table Card */
.data-table-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-bottom: 1px solid #e0e0e0;
  padding: 20px 24px;
}

.search-field {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

/* Professional Table Styling */
.professional-table {
  background: transparent;
}

.professional-table :deep(.v-data-table-header) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-weight: 600;
  color: #37474f;
}

.professional-table :deep(.v-data-table-header th) {
  border-bottom: 2px solid #e0e0e0 !important;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.professional-table :deep(tbody tr) {
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.professional-table :deep(tbody tr:hover) {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.04) 0%, rgba(25, 118, 210, 0.02) 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.professional-table :deep(td) {
  padding: 16px 12px;
  vertical-align: middle;
}

/* Dialog Styling */
.modify-dialog-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
}

.dialog-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  padding: 20px 24px;
}

.delete-dialog-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
}

.delete-dialog-header {
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border-bottom: 1px solid #feb2b2;
  padding: 20px 24px;
}

.dialog-actions {
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

/* Chip Styling */
.v-chip {
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.25px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    padding: 16px;
  }

  .page-header .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .card-header .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .search-field {
    width: 100% !important;
    max-width: none !important;
  }
}

/* Loading Animation */
.v-progress-circular {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
