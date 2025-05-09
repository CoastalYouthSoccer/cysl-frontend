<template>
  <v-sheet border rounded>
    <v-data-table
      :headers="headers"
      :hide-default-footer="associations.length < 11"
      :items="associations"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            Associations
          </v-toolbar-title>
          <v-btn v-if="allowEdit"
            color="green"
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add"
            border
            variant="flat"
            data-test="add-association-btn"
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.title="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-association" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon v-if="allowEdit" color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item)" data-test="edit-association-btn"></v-icon>
          <v-icon v-if="allowDelete" color="medium-emphasis" icon="mdi-delete" size="small" @click="openDeleteDialog(item)" data-test="delete-association-btn"></v-icon>
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
      :title="`${isEditing ? 'Edit' : 'Add'} Association`"
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
      title="Delete Association"
      :text="`Are you sure you want to delete ${associationToDelete?.name || ''}?`"
    >
      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="deleteDialog = false" data-test="delete-cancel-btn"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="Delete" prepend-icon="mdi-delete" @click="deleteItem(associationToDelete)" data-test="delete-delete-btn"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
<script setup>
  import { onMounted, ref, shallowRef, computed } from 'vue'
  import { useDate } from 'vuetify'
  import { useAuth0 } from '@auth0/auth0-vue';

  import { useUserStore } from '@/stores/user'
  import { fetchAssociations, deleteAssociation, updateAssociation, createAssociation }
    from '@/services/api.association.js'
  import { formatDateToYYYYMMDD } from '@/utils/date';

  const adapter = useDate()
  const { getAccessTokenSilently } = useAuth0();

  const DEFAULT_RECORD = { name: '' }

  const associations = ref([])
  const associationToDelete = ref(null)
  const record = ref(DEFAULT_RECORD)
  const modifyDialog = shallowRef(false)
  const deleteDialog = shallowRef(false)
  const isEditing = shallowRef(false)
  const userStore = useUserStore()
  const allowEdit = computed(() => userStore.user.permissions.includes('write:associations'))
  const allowDelete = computed(() => userStore.user.permissions.includes('delete:associations'))

  const headers = [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
  ]

  onMounted(() => {
    modifyDialog.value = false
    record.value = DEFAULT_RECORD
    getAssociations()
  })

  function openDeleteDialog(item) {
    associationToDelete.value = item
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

  async function getAssociations() {
    const token = await getAccessTokenSilently();
    const { data, error } = await fetchAssociations(token);

    if (data) {
      associations.value = data;
    }

    if (error && error.message) {
      console.error('Error fetching associations:', error.message);
    }
  }

  async function createItem(item) {
    item.start_dt = formatDateToYYYYMMDD(item.start_dt);
    const token = await getAccessTokenSilently();
    const { data, error } = await createAssociation(item, token);

    if (data) {
      associations.value.push(data);
    }


    if (error && error.message) {
      console.error('Error Creating association:', error.message);
    }
  }

  async function updateItem(item) {
    const token = await getAccessTokenSilently();
    const { data, error } = await updateAssociation(item, token);

    if (data) {
      const index = associations.value.findIndex(association => association.id === data.id);
      if (index !== -1) {
        associations.value[index] = data;
      }
    }

    if (error && error.message) {
      console.error('Error Updating association:', error.message);
    }
  }

  async function deleteApiItem(association) {
    const token = await getAccessTokenSilently();
    const { data, error } = await deleteAssociation(association.id, token);

    if (error.message === null) {
      const index = associations.value.findIndex(s => s.id === association.id);
      if (index !== -1) {
        associations.value.splice(index, 1);
      }
    }

    if (error && error.message) {
      console.error('Error Deleting associations:', error.message);
    }

    deleteDialog.value = false
  }
</script>
