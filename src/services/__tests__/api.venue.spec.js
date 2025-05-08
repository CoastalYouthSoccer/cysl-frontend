import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as venueApi from '../api.venue' // Adjust path
import { callApi } from '../api.service' // Adjust path

vi.mock('../api.service', () => ({
  callApi: vi.fn()
}))

const mockToken = 'mock-token'

describe('Venue API methods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchVenues calls callApi with query params', async () => {
    const mockData = [{ id: 1, name: 'Field A' }]
    callApi.mockResolvedValueOnce({ data: mockData, error: { message: null } })

    const result = await venueApi.fetchVenues(mockToken, { city: 'Springfield' })

    expect(callApi).toHaveBeenCalledWith(
      { url: 'venues?city=Springfield', method: 'GET' },
      mockToken
    )
    expect(result.data).toEqual(mockData)
  })

  it('fetchAssignrVenues calls callApi correctly', async () => {
    const mockData = [{ id: 'ext-venue-1', name: 'Assignr Venue' }]
    callApi.mockResolvedValueOnce({ data: mockData, error: { message: null } })

    const result = await venueApi.fetchAssignrVenues(mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'assignr-venues', method: 'GET' },
      mockToken
    )
    expect(result.data).toEqual(mockData)
  })

  it('createVenue posts venue data', async () => {
    const newVenue = { name: 'New Park' }
    callApi.mockResolvedValueOnce({ data: newVenue, error: { message: null } })

    const result = await venueApi.createVenue(newVenue, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'venue', method: 'POST', data: newVenue },
      mockToken
    )
    expect(result.data).toEqual(newVenue)
  })

  it('updateVenue patches venue data', async () => {
    const updatedVenue = { id: 1, name: 'Updated Park' }
    callApi.mockResolvedValueOnce({ data: updatedVenue, error: { message: null } })

    const result = await venueApi.updateVenue(updatedVenue, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'venue', method: 'PATCH', data: updatedVenue },
      mockToken
    )
    expect(result.data).toEqual(updatedVenue)
  })

  it('deleteVenue sends DELETE request with ID', async () => {
    callApi.mockResolvedValueOnce({ data: { success: true }, error: { message: null } })

    const result = await venueApi.deleteVenue(5, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'venue/5', method: 'DELETE' },
      mockToken
    )
    expect(result.data).toEqual({ success: true })
  })

  it('handles errors gracefully', async () => {
    callApi.mockResolvedValueOnce({ data: null, error: { message: 'Something went wrong' } })

    const result = await venueApi.fetchVenues(mockToken)

    expect(result.data).toBeNull()
    expect(result.error.message).toBe('Something went wrong')
  })
})
