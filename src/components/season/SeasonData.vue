<template>
  <v-sheet border rounded>
    <v-data-table
      :headers="headers"
      :hide-default-footer="seasons.length < 11"
      :items="seasons"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            Seasons
          </v-toolbar-title>
          <v-btn v-if="allowEdit"
            color="green"
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add Season"
            border
            variant="flat"
            data-testid="add-season-btn"
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.title="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-season" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon v-if="allowEdit" color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item)" data-testid="edit-season-btn"></v-icon>
          <v-icon v-if="allowDelete" color="medium-emphasis" icon="mdi-delete" size="small" @click="openDeleteDialog(item)" data-testid="delete-season-btn"></v-icon>
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
      :title="`${isEditing ? 'Edit' : 'Add'} Season`"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="record.name" label="Name" data-testid="input-name"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-date-input v-model="record.start_dt" label="Start Date" data-testid="start-date"></v-date-input>
          </v-col>

          <v-col cols="12" md="6">
            <v-number-input v-model="record.season_length" label="Length" data-testid="season-length"></v-number-input>
          </v-col>

          <v-col cols="12" md="6">
            <v-date-input v-model="record.holiday_dates" label="Holiday Dates" multiple data-testid="holiday-dates"></v-date-input>
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
      title="Delete Season"
      :text="`Are you sure you want to delete ${seasonToDelete?.name || ''}?`"
    >
      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="deleteDialog = false" data-testid="delete-cancel-btn"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="Delete" prepend-icon="mdi-delete" @click="deleteItem(seasonToDelete)" data-testid="delete-delete-btn"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
<script setup>
  import { onMounted, ref, shallowRef, computed } from 'vue'
  import { useDate } from 'vuetify'
  import { useAuth0 } from '@auth0/auth0-vue';

  import { useUserStore } from '@/stores/user'
  import { fetchSeasons, deleteSeason, updateSeason, createSeason }
    from '@/services/api.season.js'
  import { formatDateToYYYYMMDD } from '@/utils/date';

  const adapter = useDate()
  const { getAccessTokenSilently } = useAuth0();

  const DEFAULT_RECORD = { name: '', start_dt: null, season_length: 0, holiday_dates: null}

  const seasons = ref([])
  const seasonToDelete = ref(null)
  const record = ref(DEFAULT_RECORD)
  const modifyDialog = shallowRef(false)
  const deleteDialog = shallowRef(false)
  const isEditing = shallowRef(false)
  const userStore = useUserStore()
  const allowEdit = computed(() => userStore.user.permissions.includes('write:seasons'))
  const allowDelete = computed(() => userStore.user.permissions.includes('delete:seasons'))

  const headers = [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Start Date', key: 'start_dt' },
    { title: 'Length', key: 'season_length', align: 'end' },
    { title: 'Holiday Dates', key: 'holiday_dates' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
  ]

  onMounted(() => {
    modifyDialog.value = false
    record.value = DEFAULT_RECORD
    getSeasons()
  })

  function openDeleteDialog(item) {
    seasonToDelete.value = item
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

  async function getSeasons() {
    const token = await getAccessTokenSilently();
    const { data, error } = await fetchSeasons(token);

    if (data) {
      seasons.value = data;
    }

    if (error && error.message) {
      console.error('Error fetching seasons:', error.message);
    }
  }

  async function createItem(item) {
    item.start_dt = formatDateToYYYYMMDD(item.start_dt);
    const token = await getAccessTokenSilently();
    const { data, error } = await createSeason(item, token);

    if (data) {
      seasons.value.push(data);
    }


    if (error && error.message) {
      console.error('Error Creating season:', error.message);
    }
  }

  async function updateItem(item) {
    const token = await getAccessTokenSilently();
    const { data, error } = await updateSeason(item, token);

    if (data) {
      const index = seasons.value.findIndex(season => season.id === data.id);
      if (index !== -1) {
        seasons.value[index] = data;
      }
    }

    if (error && error.message) {
      console.error('Error Updating season:', error.message);
    }
  }

  async function deleteApiItem(season) {
    const token = await getAccessTokenSilently();
    const { data, error } = await deleteSeason(season.id, token);

    if (error.message === null) {
      const index = seasons.value.findIndex(s => s.id === season.id);
      if (index !== -1) {
        seasons.value.splice(index, 1);
      }
    }

    if (error && error.message) {
      console.error('Error Deleting seasons:', error.message);
    }

    deleteDialog.value = false
  }
</script>
