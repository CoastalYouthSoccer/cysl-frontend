import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

const apiClientAuth = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '
  }
})

export default {
  fetchVenues() {
    return apiClient.get('/venues')
  },

  fetchGames(startDt, endDt, venue) {
    const params = {
      start_dt: startDt,
      end_dt: endDt,
      venue: venue
    }
    return apiClientAuth.get('/games', { params })
  }
}
