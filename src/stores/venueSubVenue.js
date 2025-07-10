import { defineStore } from 'pinia'
import { fetchVenues } from '@/services/api.venue'
import { fetchSubVenues } from '@/services/api.subvenue'
import { formatErrorMessage } from '@/utils/formatMessage.js'

export const useVenueSubVenueStore = defineStore('venueStore', {
  state: () => ({
    venues: [],
    subVenues: []
  }),
  actions: {
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
    getVenues: (state) => state.venues,
    getSubVenues: (state) => state.subVenues,
        // Returns an object: { [venueId]: [subVenues...] }
    getSubVenuesByVenue: (state) => {
      return state.subVenues.reduce((map, subVenue) => {
        const key = subVenue.venue_id
        if (!map[key]) map[key] = []
        map[key].push(subVenue)
        return map
      }, {})
    },

    // Optional: get sub-venues by a specific venue ID
    subVenuesForVenue: (state) => {
      return (venueId) => {
        if (venueId) {
          return state.subVenues.filter(sv => sv.venue.id === venueId)
        }
        return state.subVenues
      }
    }
  }
});
