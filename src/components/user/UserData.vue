<template>
  <!-- Error Alert -->
  <v-alert
    v-if="errorMessage"
    :text="errorMessage"
    type="error"
    variant="tonal"
    closable
    class="mb-6"
    data-test="userData-alert"
    @click:close="errorMessage = null"
  ></v-alert>

  <!-- Loading State -->
  <div v-if="isLoading" class="d-flex flex-column align-center justify-center my-12" data-test="userData-loading">
    <v-progress-circular
      indeterminate
      color="primary"
      size="48"
      width="4"
    />
    <v-card-subtitle class="mt-4 text-medium-emphasis">
      Loading users...
    </v-card-subtitle>
  </div>

  <!-- Main Content -->
  <v-card v-else elevation="2" rounded="lg">
    <v-data-table
      :headers="headers"
      :items="users"
      :hide-default-footer="users.length < 11"
      :loading="isLoading"
      item-value="id"
      class="elevation-0"
      hover
      data-test="userData-table"
    >
      <!-- Header -->
      <template v-slot:top>
        <v-card-title class="d-flex align-center justify-space-between pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-group" class="me-3" color="primary" size="28" />
            <div>
              <h2 class="text-h5 font-weight-medium">User Management</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Manage user roles and association assignments
              </p>
            </div>
          </div>

          <v-chip
            color="info"
            variant="tonal"
            prepend-icon="mdi-information"
            size="small"
          >
            {{ users.length }} {{ users.length === 1 ? 'User' : 'Users' }}
          </v-chip>
        </v-card-title>
        <v-divider />
      </template>

      <!-- User Name Column -->
      <template v-slot:item.name="{ value, item }">
        <div class="d-flex align-center py-3">
          <v-avatar color="primary-lighten-2" size="36" class="me-3">
            <v-icon icon="mdi-account" size="20" />
          </v-avatar>
          <div>
            <div class="text-body-1 font-weight-medium">{{ value }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ item.email || 'No email provided' }}
            </div>
          </div>

          <!-- Status Indicators -->
          <div class="ms-auto d-flex align-center ga-2">
            <v-tooltip v-if="item.dirty" text="Unsaved changes" location="top">
              <template v-slot:activator="{ props }">
                <v-chip
                  v-bind="props"
                  color="warning"
                  size="x-small"
                  variant="tonal"
                  prepend-icon="mdi-pencil"
                >
                  Modified
                </v-chip>
              </template>
            </v-tooltip>

            <v-tooltip v-else-if="item.justSaved" text="Recently saved" location="top">
              <template v-slot:activator="{ props }">
                <v-chip
                  v-bind="props"
                  color="success"
                  size="x-small"
                  variant="tonal"
                  prepend-icon="mdi-check"
                >
                  Saved
                </v-chip>
              </template>
            </v-tooltip>
          </div>
        </div>
      </template>

      <!-- Roles Column -->
      <template v-slot:item.roles="{ item }">
        <div class="py-2">
          <RoleChip
            v-model:assignedRoles="item.roles"
            @update:assignedRoles="markDirty(item)"
          />
        </div>
      </template>

      <!-- Associations Column -->
      <template v-slot:item.associations="{ item }">
        <div class="py-2">
          <AssociationChip
            v-model:assignedAssociations="item.associations"
            @update:assignedAssociations="markDirty(item)"
          />
        </div>
      </template>

      <!-- Actions Column -->
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-1 justify-end">
          <v-tooltip text="Save Changes" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-content-save"
                variant="text"
                size="small"
                :color="item.dirty ? 'success' : 'medium-emphasis'"
                :disabled="!item.dirty || isSaving"
                :loading="item.saving"
                data-test="save-user-btn"
                @click="save(item)"
              />
            </template>
          </v-tooltip>

          <v-tooltip text="Reset Changes" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-undo"
                variant="text"
                size="small"
                color="medium-emphasis"
                :disabled="!item.dirty"
                data-test="reset-user-btn"
                @click="resetUser(item)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>

      <!-- Empty State -->
      <template v-slot:no-data>
        <div class="text-center py-12">
          <v-icon icon="mdi-account-off" size="64" color="medium-emphasis" class="mb-4" />
          <h3 class="text-h6 mb-2">No users found</h3>
          <p class="text-body-2 text-medium-emphasis mb-6">
            No users are currently available for management
          </p>
          <v-btn
            prepend-icon="mdi-refresh"
            variant="outlined"
            color="primary"
            @click="refresh"
          >
            Refresh Users
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>

  <!-- Bulk Actions Bar (appears when users have unsaved changes) -->
  <v-expand-transition>
    <v-card
      v-if="hasUnsavedChanges"
      elevation="4"
      rounded="lg"
      class="mt-4"
      color="warning-lighten-5"
    >
      <v-card-text class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-alert-circle" color="warning" class="me-3" />
          <div>
            <div class="text-body-1 font-weight-medium">
              {{ unsavedCount }} {{ unsavedCount === 1 ? 'user has' : 'users have' }} unsaved changes
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Don't forget to save your changes
            </div>
          </div>
        </div>

        <div class="d-flex ga-2">
          <v-btn
            variant="text"
            color="warning"
            prepend-icon="mdi-undo"
            @click="resetAllUsers"
          >
            Reset All
          </v-btn>
          <v-btn
            color="success"
            variant="elevated"
            prepend-icon="mdi-content-save-all"
            :loading="isBulkSaving"
            @click="saveAllUsers"
          >
            Save All
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-expand-transition>

  <!-- Success Snackbar -->
  <v-snackbar
    v-model="showSuccessSnackbar"
    color="success"
    timeout="3000"
    location="bottom right"
  >
    <v-icon icon="mdi-check-circle" class="me-2" />
    {{ successMessage }}
  </v-snackbar>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useDate } from 'vuetify'
import { useAuth0 } from '@auth0/auth0-vue'

import { useUserStore } from '@/stores/user'
import { fetchUsers, updateUser } from '@/services/api.user.js'
import { formatErrorMessage } from '@/utils/formatMessage.js'
import RoleChip from '@/components/user/RoleChip.vue'
import AssociationChip from '@/components/user/AssociationChip.vue'

const adapter = useDate()
const { getAccessTokenSilently } = useAuth0()

const DEFAULT_RECORD = { name: '' }

// Reactive data
const users = ref([])
const record = ref({ ...DEFAULT_RECORD })
const errorMessage = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const isBulkSaving = ref(false)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')
const originalUsers = ref([])

// Store and permissions
const userStore = useUserStore()
const allowEdit = computed(() => userStore.user.permissions.includes('write:users'))

// Computed properties for bulk actions
const hasUnsavedChanges = computed(() =>
  users.value.some(user => user.dirty)
)

const unsavedCount = computed(() =>
  users.value.filter(user => user.dirty).length
)

// Table configuration
const headers = [
  {
    title: 'User',
    key: 'name',
    align: 'start',
    sortable: true,
    width: '300px'
  },
  {
    title: 'Roles',
    key: 'roles',
    sortable: false,
    width: '250px'
  },
  {
    title: 'Associations',
    key: 'associations',
    sortable: false,
    width: '250px'
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'end',
    sortable: false,
    width: '120px'
  }
]

onMounted(() => {
  record.value = { ...DEFAULT_RECORD }
  getUsers()
})

function markDirty(item) {
  item.dirty = true
  item.justSaved = false
}

function markSaved(item) {
  item.dirty = false
  item.justSaved = true

  // Clear the "just saved" indicator after 3 seconds
  setTimeout(() => {
    item.justSaved = false
  }, 3000)
}

function resetUser(item) {
  // Find original user data and restore it
  const originalUser = originalUsers.value.find(u => u.id === item.id)
  if (originalUser) {
    Object.assign(item, JSON.parse(JSON.stringify(originalUser)))
    item.dirty = false
    item.justSaved = false
  }
}

function resetAllUsers() {
  users.value.forEach(user => {
    if (user.dirty) {
      resetUser(user)
    }
  })
}

async function save(item) {
  await updateItem(item)
}

async function saveAllUsers() {
  isBulkSaving.value = true
  const unsavedUsers = users.value.filter(user => user.dirty)

  try {
    for (const user of unsavedUsers) {
      await updateItem(user)
    }

    successMessage.value = `Successfully saved ${unsavedUsers.length} ${unsavedUsers.length === 1 ? 'user' : 'users'}`
    showSuccessSnackbar.value = true
  } catch (error) {
    // Individual errors are handled in updateItem
  } finally {
    isBulkSaving.value = false
  }
}

function refresh() {
  getUsers()
}

async function getUsers() {
  try {
    isLoading.value = true
    errorMessage.value = null

    const token = await getAccessTokenSilently()
    const { data, error } = await fetchUsers(token)

    if (error?.message) {
      errorMessage.value = `Error loading users: ${formatErrorMessage(error.message)}`
    } else {
      users.value = (data || []).map(user => ({
        ...user,
        dirty: false,
        justSaved: false,
        saving: false
      }))

      // Store original data for reset functionality
      originalUsers.value = JSON.parse(JSON.stringify(users.value))
    }
  } catch (err) {
    errorMessage.value = 'Failed to load users. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function updateItem(item) {
  try {
    item.saving = true
    const token = await getAccessTokenSilently()
    const { data, error } = await updateUser(item, token)

    if (data) {
      const index = users.value.findIndex(user => user.id === data.id)
      if (index !== -1) {
        // Preserve UI state while updating data
        const uiState = {
          dirty: false,
          justSaved: true,
          saving: false
        }
        users.value[index] = { ...data, ...uiState }

        // Update original users for reset functionality
        const originalIndex = originalUsers.value.findIndex(u => u.id === data.id)
        if (originalIndex !== -1) {
          originalUsers.value[originalIndex] = JSON.parse(JSON.stringify(data))
        }

        markSaved(users.value[index])
      }
      errorMessage.value = null
    }

    if (error?.message) {
      errorMessage.value = `Error updating user: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = 'Failed to update user. Please try again.'
  } finally {
    item.saving = false
  }
}
</script>
