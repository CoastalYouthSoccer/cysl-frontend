import { defineStore } from 'pinia'
import APIService from '@/services/APIService.js'


export const useVenueStore = defineStore('Venue', {
  state: () => ({
    venues: []
  }),
  actions: {
    async loadVenues() {
      await APIService.fetchVenues()
        .then((response) => {
          this.venues = response.data
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
        })
    },
  }
})
