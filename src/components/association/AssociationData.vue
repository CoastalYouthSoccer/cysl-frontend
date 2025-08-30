<template>
  <!-- Error Alert -->
  <v-alert
    v-if="errorMessage"
    :text="errorMessage"
    type="error"
    variant="tonal"
    closable
    class="mb-6"
    data-test="association-alert"
    @click:close="errorMessage = null"
  ></v-alert>


  <!-- Loading State -->
  <div v-if="isLoading" class="d-flex flex-column align-center justify-center my-12" data-test="association-loading">
    <v-progress-circular
      indeterminate
      color="primary"
      size="48"
      width="4"
    />
    <v-card-subtitle class="mt-4 text-medium-emphasis">
      Loading associations...
    </v-card-subtitle>
  </div>

  <!-- Main Content -->
  <v-card v-else elevation="2" rounded="lg">
    <v-data-table
      :headers="headers"
      :items="associations"
      :hide-default-footer="associations.length < 11"
      :loading="isLoading"
      item-value="id"
      class="elevation-0"
      hover
    >
      <!-- Header -->
      <template v-slot:top>
        <v-card-title class="d-flex align-center justify-space-between pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-domain" class="me-3" color="primary" size="28" />
            <div>
              <h2 class="text-h5 font-weight-medium">Associations</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Manage your organization
              </p>
            </div>
          </div>

          <v-btn
            v-if="allowEdit"
            color="primary"
            prepend-icon="mdi-plus"
            variant="elevated"
            rounded="lg"
            data-test="add-association-btn"
            @click="add"
          >
            Add Association
          </v-btn>
        </v-card-title>
        <v-divider />
      </template>

      <!-- Association Name Column -->
      <template v-slot:item.name="{ value }">
        <div class="d-flex align-center py-3">
          <v-avatar color="primary-lighten-2" size="32" class="me-3">
            <v-icon icon="mdi-domain" size="18" />
          </v-avatar>
          <div>
            <div class="text-body-1 font-weight-medium">{{ value }}</div>
          </div>
        </div>
      </template>

      <!-- Actions Column -->
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-tooltip text="Edit Association" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-if="allowEdit"
                v-bind="props"
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                data-test="edit-association-btn"
                @click="edit(item)"
              />
            </template>
          </v-tooltip>

          <v-tooltip text="Delete Association" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-if="allowDelete"
                v-bind="props"
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                data-test="delete-association-btn"
                @click="openDeleteDialog(item)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>

      <!-- Empty State -->
      <template v-slot:no-data>
        <div class="text-center py-12">
          <v-icon icon="mdi-domain-off" size="64" color="medium-emphasis" class="mb-4" />
          <h3 class="text-h6 mb-2">No associations found</h3>
          <p class="text-body-2 text-medium-emphasis mb-6">
            Get started by creating your first association
          </p>
          <v-btn
            v-if="allowEdit"
            prepend-icon="mdi-plus"
            variant="outlined"
            color="primary"
            @click="add"
          >
            Add Association
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
    max-width="500"
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
        <span class="text-h6">{{ isEditing ? 'Edit' : 'Add' }} Association</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="form" v-model="isFormValid" @submit.prevent="save(record)">
          <v-text-field
            v-model="record.name"
            label="Association Name"
            placeholder="Enter association name"
            variant="outlined"
            :rules="nameRules"
            prepend-inner-icon="mdi-domain"
            data-test="input-name"
            autofocus
            required
          />
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
        <span class="text-h6">Delete Association</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <p class="text-body-1 mb-4">
          Are you sure you want to delete
          <strong>"{{ associationToDelete?.name }}"</strong>?
        </p>
        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-0"
          :text=This action cannot be undone.
        ></v-alert>
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
          @click="deleteItem(associationToDelete)"
        >
          Delete
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
import { fetchAssociations, deleteAssociation, updateAssociation, createAssociation }
  from '@/services/api.association.js'
import Alert from '../Alert.vue'
import { formatDateToYYYYMMDD } from '@/utils/date'
import { formatErrorMessage } from '@/utils/formatMessage.js'

const adapter = useDate()
const { getAccessTokenSilently } = useAuth0()

const DEFAULT_RECORD = { name: '' }

// Reactive data
const associations = ref([])
const associationToDelete = ref(null)
const errorMessage = ref(null)
const record = ref({ ...DEFAULT_RECORD })
const modifyDialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const isEditing = shallowRef(false)
const isLoading = ref(true)
const isFormValid = ref(false)

// Store and permissions
const userStore = useUserStore()
const allowEdit = computed(() => userStore.user.permissions.includes('write:associations'))
const allowDelete = computed(() => userStore.user.permissions.includes('delete:associations'))

// Form validation
const nameRules = [
  v => !!v || 'Association name is required',
  v => v?.length >= 2 || 'Name must be at least 2 characters',
  v => v?.length <= 100 || 'Name must be less than 100 characters'
]

// Table configuration
const headers = [
  {
    title: 'Association Name',
    key: 'name',
    align: 'start',
    sortable: true
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
  modifyDialog.value = false
  record.value = { ...DEFAULT_RECORD }
  getAssociations()
})

function openDeleteDialog(item) {
  associationToDelete.value = item
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
  getAssociations()
}

async function getAssociations() {
  try {
    isLoading.value = true
    errorMessage.value = null

    const token = await getAccessTokenSilently()
    const { data, error } = await fetchAssociations(token)

    if (data) {
      associations.value = data
    }

    if (error?.message) {
      errorMessage.value = `Error loading associations: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = 'Failed to load associations. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function createItem(item) {
  try {
    const itemToCreate = { ...item }
    if (itemToCreate.start_dt) {
      itemToCreate.start_dt = formatDateToYYYYMMDD(itemToCreate.start_dt)
    }

    const token = await getAccessTokenSilently()
    const { data, error } = await createAssociation(itemToCreate, token)

    if (data) {
      associations.value.push(data)
      errorMessage.value = null
    }

    if (error?.message) {
      errorMessage.value = `Error creating association: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = 'Failed to create association. Please try again.'
  }
}

async function updateItem(item) {
  try {
    const token = await getAccessTokenSilently()
    const { data, error } = await updateAssociation(item, token)

    if (data) {
      const index = associations.value.findIndex(association => association.id === data.id)
      if (index !== -1) {
        associations.value[index] = data
      }
      errorMessage.value = null
    }

    if (error?.message) {
      errorMessage.value = `Error updating association: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = 'Failed to update association. Please try again.'
  }
}

async function deleteApiItem(association) {
  try {
    const token = await getAccessTokenSilently()
    const { error } = await deleteAssociation(association.id, token)

    if (!error?.message) {
      const index = associations.value.findIndex(s => s.id === association.id)
      if (index !== -1) {
        associations.value.splice(index, 1)
      }
      errorMessage.value = null
    } else {
      errorMessage.value = `Error deleting association: ${formatErrorMessage(error.message)}`
    }
  } catch (err) {
    errorMessage.value = 'Failed to delete association. Please try again.'
  } finally {
    deleteDialog.value = false
  }
}
</script>
