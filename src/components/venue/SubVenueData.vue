<template>
  {{ isLoading }}
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-test="subVenues-alert"/>
<!--  <div v-if="isLoading" class="d-flex justify-center my-4" data-test="subVenues-loading">
    <v-progress-circular indeterminate color="primary" />
  </div> -->
  <v-sheet border rounded v-if="!isLoading">
    <v-data-table
      :headers="headers"
      :hide-default-footer="subVenues.length < 11"
      :items="subVenues"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            SubVenues - {{ venueName }}
          </v-toolbar-title>
          <v-btn v-if="allowEdit"
            color="green"
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add"
            border
            variant="flat"
            data-test="add-subVenues-btn"
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.title="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-subVenues" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon v-if="allowEdit" color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item)" data-test="edit-subVenues-btn"></v-icon>
          <v-icon v-if="allowDelete" color="medium-emphasis" icon="mdi-delete" size="small" @click="openDeleteDialog(item)" data-test="delete-subVenues-btn"></v-icon>
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
      :title="`${isEditing ? 'Edit' : 'Add'} SubVenues`"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="record.name" label="Name" data-test="input-name"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="modifyDialog = false" data-test="modify-cancel-btn"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Save" prepend-icon="mdi-content-save" @click="save(record)" data-test="modify-save-btn"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteDialog" max-width="500">
    <v-card
      color="red-lighten-1"
      prepend-icon="mdi-delete"
      title="Delete SubVenues"
      :text="`Are you sure you want to delete ${subVenuesToDelete?.name || ''}?`"
    >
      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="deleteDialog = false" data-test="delete-cancel-btn"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="Delete" prepend-icon="mdi-delete" @click="deleteItem(subVenuesToDelete)" data-test="delete-delete-btn"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
<script setup>
  import { onMounted, ref, shallowRef, computed } from 'vue'
  import { useDate } from 'vuetify'
  import { useAuth0 } from '@auth0/auth0-vue';

  import { useUserStore } from '@/stores/user'
  import { fetchSubVenues, deleteSubVenue, updateSubVenue, createSubVenue }
    from '@/services/api.subvenue.js'
  import { formatErrorMessage } from '@/utils/formatMessage.js';

  const adapter = useDate()
  const { getAccessTokenSilently } = useAuth0();

  const DEFAULT_RECORD = {name: ''}

  const props = defineProps({
    venueId: String,
    venueName: String
  })

  const subVenues = ref([])
  const subVenuesToDelete = ref(null)
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
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
  ]

  onMounted(async() => {
    console.log(props.venueId, props.venueName)
    modifyDialog.value = false
    record.value = DEFAULT_RECORD
    const token = await getAccessTokenSilently();
    const { data, error } = await fetchSubVenues(token, {"venue_id": props.venueId});

    if (error?.message) {
      errorMessage.value = `Error fetching subVenues: ${formatErrorMessage(error.message)}`
      console.error(errorMessage.value)
    } else {
      subVenues.value = data
    }

    isLoading.value = false
  })

  function openDeleteDialog(item) {
    subVenuesToDelete.value = item
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

  async function createItem(item) {
    const token = await getAccessTokenSilently();
    item.venue_id = props.venueId
    const { data, error } = await createSubVenue(item, token);

    if (data) {
      subVenues.value.push(data);
    }


    if (error && error.message) {
      console.error('Error Creating subVenues:', error.message);
    }
  }

  async function updateItem(item) {
    const token = await getAccessTokenSilently();
    item.venue_id = props.venueId
    const { data, error } = await updateSubVenue(item, token);

    if (error?.message) {
      errorMessage.value = `Error updating subVenues: ${item.name}, ${formatErrorMessage(error.message)}`
      console.error(errorMessage.value)
    } else {
      const index = subVenues.value.findIndex(subVenues => subVenues.id === data.id);
      if (index !== -1) {
        subVenues.value[index] = data;
      }
    }
  }

  async function deleteApiItem(subVenues) {
    const token = await getAccessTokenSilently();
    const { data, error } = await deleteSubVenue(subVenues.id, token);

    if (error.message === null) {
      const index = subVenues.value.findIndex(s => s.id === subVenues.id);
      if (index !== -1) {
        subVenues.value.splice(index, 1);
      }
    }

    if (error && error.message) {
      console.error('Error Deleting subVenues:', error.message);
    }

    deleteDialog.value = false
  }
</script>
