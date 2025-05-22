import { defineStore } from 'pinia'
import { fetchAssociations } from '@/services/api.association.js'
import { fetchRoles } from '@/services/api.user.js'
import { formatErrorMessage } from '@/utils/formatMessage.js'

export const useShareStore = defineStore('share', {
  state: () => ({
    associations: [],
    roles: []
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
    }
  },
  getters: {
    getAssociations: (state) => state.associations,
    getRoles: (state) => state.roles
  }
});
