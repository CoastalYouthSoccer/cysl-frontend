import { defineStore } from 'pinia'
import { fetchAssociations } from '@/services/api.association.js'
import { fetchRoles } from '@/services/api.user.js'
import { fetchSeasons } from '@/services/api.season'
import { formatErrorMessage } from '@/utils/formatMessage.js'

export const useShareStore = defineStore('sharedStore', {
  state: () => ({
    associations: [],
    roles: [],
    seasons: [],
    venues: [],
    subVenues: []
  }),
  actions: {
    async setAssociations(token) {
      const { data, error } = await fetchAssociations(token);
      if (error?.message) {
        const errorMessage = `Error fetching associations: ${formatErrorMessage(error.message)}`
        console.error(errorMessage)
        return
      }
      this.associations = data
    },
    async setSeasons(token) {
      const { data, error } = await fetchSeasons(token);
      if (error?.message) {
        const errorMessage = `Error fetching seasons: ${formatErrorMessage(error.message)}`
        console.error(errorMessage)
        return
      }
      this.seasons = data
    },
    async setRoles(token) {
      const { data, error } = await fetchRoles(token);

      if (error?.message) {
        const errorMessage = `Error fetching roles: ${formatErrorMessage(error.message)}`
        console.error(errorMessage)
        return
      }
      this.roles = data
    }
  },
  getters: {
    getAssociations: (state) => state.associations,
    getRoles: (state) => state.roles,
    getSeasons: (state) => state.seasons
  }
});
