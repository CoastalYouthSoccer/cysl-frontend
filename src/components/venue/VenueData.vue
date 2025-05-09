<template>
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-testid="venue-alert"/>
  <div v-if="isLoading" class="d-flex justify-center my-4" data-testid="venue-loading">
    <v-progress-circular indeterminate color="primary" />
  </div>
  <v-sheet border rounded v-if="!isLoading">
    <v-data-table
      :headers="headers"
      :hide-default-footer="formattedVenues.length < 11"
      :items="formattedVenues"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            Venues
          </v-toolbar-title>
          <v-btn v-if="allowEdit"
            color="green"
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add"
            border
            variant="flat"
            data-testid="add-venue-btn"
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.title="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-venue" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="medium-emphasis" icon="mdi-crosshairs" size="small" @click="loadSubVenues(item)" data-testid="edit-venue-btn"></v-icon>
          <v-icon v-if="allowEdit" color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item)" data-testid="edit-venue-btn"></v-icon>
          <v-icon v-if="allowDelete" color="medium-emphasis" icon="mdi-delete" size="small" @click="openDeleteDialog(item)" data-testid="delete-venue-btn"></v-icon>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn
          prepend-icon="mdi-backup-restore"
          rounded="lg"
          text="Reset data"
          variant="text"
          border
          @click="reset"
        ></v-btn>
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="modifyDialog" max-width="500">
    <v-card
      :title="`${isEditing ? 'Edit' : 'Add'} Venue`"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="record.name" label="Name" data-testid="input-name"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="record.address1" label="Address 1" data-testid="address1"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="record.address2" label="Address 2" data-testid="address2"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="record.city" label="City" data-testid="city"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="record.state" label="State" data-testid="state"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="record.association" label="Association" data-testid="association"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="modifyDialog = false" data-testid="modify-cancel-btn"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Save" prepend-icon="mdi-content-save" @click="save(record)" data-testid="modify-save-btn"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteDialog" max-width="500">
    <v-card
      color="red-lighten-1"
      prepend-icon="mdi-delete"
      title="Delete Venue"
      :text="`Are you sure you want to delete ${venueToDelete?.name || ''}?`"
    >
      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="deleteDialog = false" data-testid="delete-cancel-btn"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="Delete" prepend-icon="mdi-delete" @click="deleteItem(venueToDelete)" data-testid="delete-delete-btn"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
<script setup>
  import { onMounted, ref, shallowRef, computed } from 'vue'
  import { useDate } from 'vuetify'
  import { useAuth0 } from '@auth0/auth0-vue';

  import { useUserStore } from '@/stores/user'
  import { fetchVenues, deleteVenue, updateVenue, createVenue }
    from '@/services/api.venue.js'
  import { formatErrorMessage } from '@/utils/formatMessage.js';

  const adapter = useDate()
  const { getAccessTokenSilently } = useAuth0();

  const DEFAULT_RECORD = {
    name: '', address1: null, address2: null, city: null, state: null,
    zip_code: null, association: null
  }

  const venues = ref([])
  const venueToDelete = ref(null)
  const record = ref(DEFAULT_RECORD)
  const modifyDialog = shallowRef(false)
  const deleteDialog = shallowRef(false)
  const isEditing = shallowRef(false)
  const userStore = useUserStore()
  const allowEdit = computed(() => userStore.user.permissions.includes('write:venues'))
  const allowDelete = computed(() => userStore.user.permissions.includes('delete:venues'))
  const errorMessage = ref(null)
  const isLoading = ref(true)

  const headers = [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Address 1', key: 'address1' },
    { title: 'Address 2', key: 'address2' },
    { title: 'City', key: 'city' },
    { title: 'State', key: 'state' },
    { title: 'Association', key: 'association' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
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
    record.value = DEFAULT_RECORD
    getVenues()
  })

  function loadSubVenues() {
    console.log('log')
  }

  function openDeleteDialog(item) {
    venueToDelete.value = item
    deleteDialog.value = true
  }

  function add () {
    isEditing.value = false
    record.value = DEFAULT_RECORD
    modifyDialog.value = true
  }

  function edit (item) {
    isEditing.value = true
    record.value = { ...item }
    modifyDialog.value = true
  }

  function deleteItem (item) {
    deleteApiItem(item)
  }

  function save (item) {
    if (isEditing.value) {
      updateItem(item)
    } else {
      createItem(item)
    }

    modifyDialog.value = false
  }

  async function getVenues() {
    const token = await getAccessTokenSilently();
    const { data, error } = await fetchVenues(token);

    if (error?.message) {
      errorMessage.value = `Error fetching venues: ${formatErrorMessage(error.message)}`
      console.error(errorMessage.value)
    } else {
      venues.value = data
    }
    isLoading.value = false
    }

  async function createItem(item) {
    const token = await getAccessTokenSilently();
    const { data, error } = await createVenue(item, token);

    if (data) {
      venues.value.push(data);
    }


    if (error && error.message) {
      console.error('Error Creating venue:', error.message);
    }
  }

  async function updateItem(item) {
    const sendItem = inflateVenue(item);
    const token = await getAccessTokenSilently();
    const { data, error } = await updateVenue(sendItem, token);

    if (error?.message) {
      errorMessage.value = `Error updating venue: ${item.name}, ${formatErrorMessage(error.message)}`
      console.error(errorMessage.value)
    } else {
      const index = venues.value.findIndex(venue => venue.id === data.id);
      if (index !== -1) {
        venues.value[index] = data;
      }
    }
  }

  async function deleteApiItem(venue) {
    const token = await getAccessTokenSilently();
    const { data, error } = await deleteVenue(venue.id, token);

    if (error.message === null) {
      const index = venues.value.findIndex(s => s.id === venue.id);
      if (index !== -1) {
        venues.value.splice(index, 1);
      }
    }

    if (error && error.message) {
      console.error('Error Deleting venues:', error.message);
    }

    deleteDialog.value = false
  }
</script>
