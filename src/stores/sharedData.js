import { defineStore } from 'pinia'
import { fetchAssociations } from '@/services/api.association.js'
import { fetchRoles } from '@/services/api.user.js'
import { fetchVenues } from '@/services/api.venue'
import { fetchSubVenues } from '@/services/api.subvenue'
import { formatErrorMessage } from '@/utils/formatMessage.js'

export const useShareStore = defineStore('sharedStore', {
  state: () => ({
    associations: [],
    roles: [],
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
      const temp = data.reduce((acc, data) => {
        acc.push(data.name)
        return acc
      }, [])
      this.associations = temp
    },
    async setRoles(token) {
      const { data, error } = await fetchRoles(token);

      if (error?.message) {
        const errorMessage = `Error fetching roles: ${formatErrorMessage(error.message)}`
        console.error(errorMessage)
        return
      }
      this.roles = data
    },
    async setVenues(token) {
      const { data, error } = await fetchVenues(token);

      if (error?.message) {
        const errorMessage = `Error fetching venues: ${formatErrorMessage(error.message)}`
        console.error(errorMessage)
        return
      }
      this.venues = data
    },
    async setSubVenues(token) {
      const { data, error } = await fetchSubVenues(token);

      if (error?.message) {
        const errorMessage = `Error fetching sub-venues: ${formatErrorMessage(error.message)}`
        console.error(errorMessage)
        return
      }
      this.subVenues = data
    }
  },
  getters: {
    getAssociations: (state) => state.associations,
    getRoles: (state) => state.roles,
    getVenues: (state) => state.venues,
    getSubVenues: (state) => state.subVenues
  }
});
