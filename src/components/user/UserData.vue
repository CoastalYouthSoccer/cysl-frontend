<template>
  <Alert v-if="errorMessage" :msg=errorMessage color="red" data-test="userData-alert"/>
  <div v-if="isLoading" class="d-flex justify-center my-4" data-test="userData-loading">
    <v-progress-circular indeterminate color="primary" size="small"/>
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
        <RoleChip
          v-model:assignedRoles="item.roles"
        ></RoleChip>
      </template>

      <template v-slot:item.associations="{ item }">
        <AssociationChip
          v-model:assignedAssociations="item.associations"
        ></AssociationChip>
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
          @click="save(item)"
        >
          <v-icon icon="mdi-content-save"></v-icon>
        </v-btn>

        <v-btn
          icon
          color="grey"
          size="x-small"
          @click="reset"
        >
          <v-icon icon="mdi-undo"></v-icon>
        </v-btn>
      </div>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { useDate } from 'vuetify'
  import { useAuth0 } from '@auth0/auth0-vue';

  import { useUserStore } from '@/stores/user'
  import { fetchUsers, updateUser } from '@/services/api.user.js'
  import { formatErrorMessage } from '@/utils/formatMessage.js';

  const adapter = useDate()
  const { getAccessTokenSilently } = useAuth0();

  const DEFAULT_RECORD = { name: '' }

  const users = ref([])
  const record = ref(DEFAULT_RECORD)
  const userStore = useUserStore()
  const allowEdit = computed(() => userStore.user.permissions.includes('write:users'))
  const errorMessage = ref(null)
  const isLoading = ref(true)

  const headers = [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Roles', key: 'roles'},
    { title: 'Associations', key: 'associations'},
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
  ]

  onMounted(() => {
    record.value = DEFAULT_RECORD
    getUsers()
    isLoading.value = false
  })

  function save (item) {
    updateItem(item)
  }

  async function getUsers() {
    const token = await getAccessTokenSilently();
    const { data, error } = await fetchUsers(token);

    if (error?.message) {
      errorMessage.value = `Error Fetching Users: ${formatErrorMessage(error.message)}`
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

    if (error?.message) {
      errorMessage.value = `Error Updating User: ${formatErrorMessage(error.message)}`
    }
  }
</script>
