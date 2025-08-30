<template>
  <v-alert
    v-if="errorMessage"
    :text="errorMessage"
    type="error"
    variant="tonal"
    closable
    class="mb-6"
    data-test="venue-alert"
    @click:close="errorMessage = null"
  ></v-alert>

  <div v-if="isLoading" class="d-flex flex-column align-center justify-center my-12" data-test="venue-loading">
    <v-progress-circular
      indeterminate
      color="primary"
      size="48"
      width="4"
    />
    <v-card-subtitle class="mt-4 text-medium-emphasis">
      Loading venues...
    </v-card-subtitle>
  </div>

  <!-- Main Content -->
  <v-card v-else elevation="2" rounded="lg">
    <v-data-table
      :headers="headers"
      :items="formattedVenues"
      :hide-default-footer="formattedVenues.length < 11"
      :loading="isLoading"
      item-value="id"
      class="elevation-0"
      hover
    >
      <!-- Header -->
      <template v-slot:top>
        <v-card-title class="d-flex align-center justify-space-between pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-map-marker" class="me-3" color="primary" size="28" />
            <div>
              <h2 class="text-h5 font-weight-medium">Venues</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Manage venues and locations
              </p>
            </div>
          </div>

          <v-btn
            v-if="allowEdit"
            color="primary"
            prepend-icon="mdi-plus"
            variant="elevated"
            rounded="lg"
            data-test="add-venue-btn"
            @click="add"
          >
            Add Venue
          </v-btn>
        </v-card-title>
        <v-divider />
      </template>

      <!-- Venue Name Column -->
      <template v-slot:item.name="{ value }">
        <div class="d-flex align-center py-2">
          <v-avatar color="primary-lighten-2" size="32" class="me-3">
            <v-icon icon="mdi-map-marker" size="18" />
          </v-avatar>
          <div>
            <div class="text-body-1 font-weight-medium">{{ value }}</div>
          </div>
        </div>
      </template>

      <!-- Address Columns with better formatting -->
      <template v-slot:item.address1="{ value }">
        <span class="text-body-2">{{ value || '—' }}</span>
      </template>

      <template v-slot:item.address2="{ value }">
        <span class="text-body-2 text-medium-emphasis">{{ value || '—' }}</span>
      </template>

      <template v-slot:item.city="{ value }">
        <span class="text-body-2">{{ value || '—' }}</span>
      </template>

      <template v-slot:item.state="{ value }">
        <v-chip
          v-if="value"
          size="small"
          variant="outlined"
          color="primary"
        >
          {{ value }}
        </v-chip>
        <span v-else class="text-medium-emphasis">—</span>
      </template>

      <template v-slot:item.association="{ value }">
        <v-chip
          v-if="value"
          size="small"
          variant="tonal"
          color="secondary"
          prepend-icon="mdi-domain"
        >
          {{ value }}
        </v-chip>
        <span v-else class="text-medium-emphasis">—</span>
      </template>

      <!-- Actions Column -->
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-1 justify-end">
          <v-tooltip text="Manage Sub-venues" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-crosshairs-gps"
                variant="text"
                size="small"
                color="info"
                data-test="edit-subvenue-btn"
                @click="editSubVenue(item)"
              />
            </template>
          </v-tooltip>

          <v-tooltip text="Edit Venue" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-if="allowEdit"
                v-bind="props"
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                data-test="edit-venue-btn"
                @click="edit(item)"
              />
            </template>
          </v-tooltip>

          <v-tooltip text="Delete Venue" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-if="allowDelete"
                v-bind="props"
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                data-test="delete-venue-btn"
                @click="openDeleteDialog(item)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>

      <!-- Empty State -->
      <template v-slot:no-data>
        <div class="text-center py-12">
          <v-icon icon="mdi-map-marker-off" size="64" color="medium-emphasis" class="mb-4" />
          <h3 class="text-h6 mb-2">No venues found</h3>
          <p class="text-body-2 text-medium-emphasis mb-6">
            Get started by adding your first venue
          </p>
          <v-btn
            v-if="allowEdit"
            prepend-icon="mdi-plus"
            variant="outlined"
            color="primary"
            @click="add"
          >
            Add Venue
          </v-btn>
          <v-btn
            v-else
            prepend-icon="mdi-refresh"
            variant="text"
            @click="reset"
          >
            Refresh
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>

  <!-- Add/Edit Dialog -->
  <v-dialog
    v-model="modifyDialog"
    max-width="600"
    persistent
    @keydown.esc="modifyDialog = false"
  >
    <v-card rounded="lg" elevation="8">
      <v-card-title class="d-flex align-center pa-6 bg-primary-lighten-5">
        <v-icon
          :icon="isEditing ? 'mdi-pencil' : 'mdi-plus'"
          class="me-3"
          color="primary"
        />
        <span class="text-h6">{{ isEditing ? 'Edit' : 'Add' }} Venue</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="form" v-model="isFormValid" @submit.prevent="save(record)">
          <v-row>
            <!-- Venue Name -->
            <v-col cols="12">
              <v-text-field
                v-model="record.name"
                label="Venue Name"
                placeholder="Enter venue name"
                variant="outlined"
                :rules="nameRules"
                prepend-inner-icon="mdi-map-marker"
                data-test="input-name"
                autofocus
                required
              />
            </v-col>

            <!-- Address Fields -->
            <v-col cols="12">
              <h4 class="text-subtitle-1 mb-3 d-flex align-center">
                <v-icon icon="mdi-home" class="me-2" size="20" />
                Address Information
              </h4>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="record.address1"
                label="Address Line 1"
                placeholder="Street address"
                variant="outlined"
                prepend-inner-icon="mdi-road"
                data-test="input-address1"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="record.address2"
                label="Address Line 2"
                placeholder="Apt, suite, etc. (optional)"
                variant="outlined"
                data-test="input-address2"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="record.city"
                label="City"
                placeholder="Enter city"
                variant="outlined"
                prepend-inner-icon="mdi-city"
                data-test="input-city"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="record.state"
                label="State"
                placeholder="Enter state"
                variant="outlined"
                prepend-inner-icon="mdi-map"
                data-test="input-state"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn
          variant="text"
          @click="modifyDialog = false"
          data-test="modify-cancel-btn"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-content-save"
          :disabled="!isFormValid || !record.name?.trim()"
          data-test="modify-save-btn"
          @click="save(record)"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="deleteDialog" max-width="400" persistent>
    <v-card rounded="lg" elevation="8">
      <v-card-title class="d-flex align-center pa-6 bg-error-lighten-5">
        <v-icon icon="mdi-alert-circle" class="me-3" color="error" />
        <span class="text-h6">Delete Venue</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <p class="text-body-1 mb-4">
          Are you sure you want to delete
          <strong>"{{ venueToDelete?.name }}"</strong>?
        </p>
        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-0"
        >
          This action will also remove all associated sub-venues and cannot be undone.
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn
          variant="text"
          @click="deleteDialog = false"
          data-test="delete-cancel-btn"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          variant="elevated"
          prepend-icon="mdi-delete"
          data-test="delete-delete-btn"
          @click="deleteItem(venueToDelete)"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, shallowRef, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDate } from 'vuetify'
import { useAuth0 } from '@auth0/auth0-vue'

import { useUserStore } from '@/stores/user'
import { fetchVenues, deleteVenue, updateVenue, createVenue }
  from '@/services/api.venue.js'
import { formatErrorMessage } from '@/utils/formatMessage.js'

const adapter = useDate()
const { getAccessTokenSilently } = useAuth0()
const router = useRouter()

const DEFAULT_RECORD = {
  name: '',
  address1: null,
  address2: null,
  city: null,
  state: null,
  zip_code: null,
  association: null
}

// Reactive data
const venues = ref([])
const venueToDelete = ref(null)
const record = ref({ ...DEFAULT_RECORD })
const modifyDialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const isEditing = shallowRef(false)
const errorMessage = ref(null)
const isLoading = ref(true)
const isFormValid = ref(false)

// Store and permissions
const userStore = useUserStore()
const allowEdit = computed(() => userStore.user.permissions.includes('write:venues'))
const allowDelete = computed(() => userStore.user.permissions.includes('delete:venues'))

// Form validation
const nameRules = [
  v => !!v || 'Venue name is required',
  v => v?.length >= 2 || 'Name must be at least 2 characters',
  v => v?.length <= 100 || 'Name must be less than 100 characters'
]

// Table configuration
const headers = [
  {
    title: 'Venue Name',
    key: 'name',
    align: 'start',
    sortable: true,
    width: '200px'
  },
  {
    title: 'Address 1',
    key: 'address1',
    sortable: true
  },
  {
    title: 'Address 2',
    key: 'address2',
    sortable: false
  },
  {
    title: 'City',
    key: 'city',
    sortable: true
  },
  {
    title: 'State',
    key: 'state',
    sortable: true,
    width: '100px'
  },
  {
    title: 'Association',
    key: 'association',
    sortable: true,
    width: '150px'
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'end',
    sortable: false,
    width: '140px'
  }
]

const formattedVenues = computed(() =>
  venues.value.map(venue => ({
    id: venue.id,
    name: venue.name,
    address_id: venue.address.id,
    address1: venue.address?.address1 ?? '',
    address2: venue.address?.address2 ?? '',
    city: venue.address?.city ?? '',
    state: venue.address?.state ?? '',
    zip_code: venue.address?.zip_code ?? '',
    association: venue.association?.name ?? '',
    association_id: venue.association.id
  }))
)

function inflateVenue(item) {
  return {
    id: item.id,
    name: item.name,
    address: {
      id: item.address_id,
      address1: item.address1,
      address2: item.address2,
      city: item.city,
      state: item.state,
      zip_code: item.zip_code
    },
    association: {
      id: item.association_id,
      name: item.association
    }
  }
}

onMounted(() => {
  modifyDialog.value = false
  record.value = { ...DEFAULT_RECORD }
  getVenues()
})

function editSubVenue(item) {
  router.push({
    name: 'SubVenue',
    query: { venueId: item.id, venueName: item.name }
  })
}

function openDeleteDialog(item) {
  venueToDelete.value = item
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

function deleteItem(item) {
  deleteApiItem(item)
}

function save(item) {
  if (!item.name?.trim()) return

  if (isEditing.value) {
    updateItem(item)
  } else {
    createItem(item)
  }
  modifyDialog.value = false
}

function reset() {
  getVenues()
}

async function getVenues() {
  try {
    isLoading.value = true
    errorMessage.value = null

    const token = await getAccessTokenSilently()
    const { data, error } = await fetchVenues(token)

    if (error?.message) {
      errorMessage.value = `Error loading venues: ${formatErrorMessage(error.message)}`
    } else {
      venues.value = data || []
    }
  } catch (err) {
    errorMessage.value = 'Failed to load venues. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function createItem(item) {
  try {
    const token = await getAccessTokenSilently()
    const { data, error } = await createVenue(item, token)

    if (data) {
      venues.value.push(data)
      errorMessage.value = null
    }

    if (error?.message) {
      errorMessage.value = `Error creating venue: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = 'Failed to create venue. Please try again.'
  }
}

async function updateItem(item) {
  try {
    const sendItem = inflateVenue(item)
    const token = await getAccessTokenSilently()
    const { data, error } = await updateVenue(sendItem, token)

    if (error?.message) {
      errorMessage.value = `Error updating venue: ${formatErrorMessage(error.message)}`
    } else {
      const index = venues.value.findIndex(venue => venue.id === data.id)
      if (index !== -1) {
        venues.value[index] = data
      }
      errorMessage.value = null
    }
  } catch (err) {
    errorMessage.value = 'Failed to update venue. Please try again.'
  }
}

async function deleteApiItem(venue) {
  try {
    const token = await getAccessTokenSilently()
    const { error } = await deleteVenue(venue.id, token)

    if (!error?.message) {
      const index = venues.value.findIndex(s => s.id === venue.id)
      if (index !== -1) {
        venues.value.splice(index, 1)
      }
      errorMessage.value = null
    } else {
      errorMessage.value = `Error deleting venue: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = 'Failed to delete venue. Please try again.'
  } finally {
    deleteDialog.value = false
  }
}
</script>
