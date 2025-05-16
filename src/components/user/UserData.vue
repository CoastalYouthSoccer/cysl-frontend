<template>
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-test="venue-alert"/>
  <div v-if="isLoading" class="d-flex justify-center my-4" data-test="venue-loading">
    <v-progress-circular indeterminate color="primary" />
  </div>
  <v-sheet border rounded v-if="!isLoading">
    <v-data-table
      :headers="headers"
      :hide-default-footer="users.length < 11"
      :items="users"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title color="primary">
            Users
          </v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item.roles="{ item }">
        <v-chip
          v-for="role in item.roles"
            :key="role.name"
            :text="role.name"
            prepend-icon="mdi-account-circle"
            color="primary"
        ></v-chip>
      </template>

      <template v-slot:item.associations="{ item }">
        <v-chip
          v-for="association in item.associations"
            :key="association"
            :text="association"
            prepend-icon="mdi-home"
            color="secondary"
        ></v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon v-if="allowEdit" color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item)" data-test="edit-user-btn"></v-icon>
          <v-icon v-if="allowDelete" color="medium-emphasis" icon="mdi-delete" size="small" @click="openDeleteDialog(item)" data-test="delete-user-btn"></v-icon>
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
      title="Edit User"
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
      title="Delete User"
      :text="`Are you sure you want to delete ${userToDelete?.name || ''}?`"
    >
      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="deleteDialog = false" data-test="delete-cancel-btn"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="Delete" prepend-icon="mdi-delete" @click="deleteItem(userToDelete)" data-test="delete-delete-btn"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
<script setup>
  import { onMounted, ref, shallowRef, computed } from 'vue'
  import { useDate } from 'vuetify'
  import { useAuth0 } from '@auth0/auth0-vue';

  import { useUserStore } from '@/stores/user'
  import { fetchUsers, deleteUser, updateUser, fetchRoles }
    from '@/services/api.user.js'
  import { fetchAssociations } from '@/services/api.association.js';
  import { formatErrorMessage } from '@/utils/formatMessage.js';

  const adapter = useDate()
  const { getAccessTokenSilently } = useAuth0();

  const DEFAULT_RECORD = { name: '' }

  const users = ref([])
  const roles = ref([])
  const associations = ref([])
  const userToDelete = ref(null)
  const record = ref(DEFAULT_RECORD)
  const modifyDialog = shallowRef(false)
  const deleteDialog = shallowRef(false)
  const userStore = useUserStore()
  const allowEdit = computed(() => userStore.user.permissions.includes('write:users'))
  const allowDelete = computed(() => userStore.user.permissions.includes('delete:users'))
  const errorMessage = ref(null)
  const isLoading = ref(true)

  const headers = [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Roles', key: 'roles'},
    { title: 'Associations', key: 'associations'},
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
  ]

  onMounted(() => {
    modifyDialog.value = false
    record.value = DEFAULT_RECORD
    getRoles()
    getAssociations()
    getUsers()
    isLoading.value = false
  })

  function openDeleteDialog(item) {
    userToDelete.value = item
    deleteDialog.value = true
  }

  function edit (item) {
    record.value = { ...item }
    modifyDialog.value = true
  }

  function deleteItem (item) {
    deleteApiItem(item)
  }

  function save (item) {
    updateItem(item)
    modifyDialog.value = false
  }

  async function getRoles() {
    const token = await getAccessTokenSilently();
    const { data, error } = await fetchRoles(token);

    if (error?.message) {
      errorMessage.value = `Error fetching roles: ${formatErrorMessage(error.message)}`
      console.error(errorMessage.value)
    } else {
      roles.value = data
    }
  }

  async function getAssociations() {
    const token = await getAccessTokenSilently();
    const { data, error } = await fetchAssociations(token);

    if (error?.message) {
      errorMessage.value = `Error fetching associations: ${formatErrorMessage(error.message)}`
      console.error(errorMessage.value)
    } else {
      associations.value = data
    }
  }

  async function getUsers() {
    const token = await getAccessTokenSilently();
    const { data, error } = await fetchUsers(token);

    if (error?.message) {
      errorMessage.value = `Error fetching users: ${formatErrorMessage(error.message)}`
      console.error(errorMessage.value)
    } else {
      users.value = data
    }
  }

  async function updateItem(item) {
    const token = await getAccessTokenSilently();
    const { data, error } = await updateUser(item, token);

    if (data) {
      const index = users.value.findIndex(user => user.id === data.id);
      if (index !== -1) {
        users.value[index] = data;
      }
    }

    if (error && error.message) {
      console.error('Error Updating user:', error.message);
    }
  }

  async function deleteApiItem(user) {
    const token = await getAccessTokenSilently();
    const { data, error } = await deleteUser(user.id, token);

    if (error.message === null) {
      const index = users.value.findIndex(s => s.id === user.id);
      if (index !== -1) {
        users.value.splice(index, 1);
      }
    }

    if (error && error.message) {
      console.error('Error Deleting user:', error.message);
    }

    deleteDialog.value = false
  }
</script>
