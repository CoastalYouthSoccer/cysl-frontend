import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as subvenueApi from '../api.subvenue'
import { callApi } from '../api.service'

vi.mock('../api.service', () => ({
  callApi: vi.fn()
}))

const mockToken = 'mock-token'

describe('SubVenue API methods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchSubVenues calls callApi with query params', async () => {
    const mockData = [{ id: 1, name: 'Field A' }]
    callApi.mockResolvedValueOnce({ data: mockData, error: { message: null } })

    const result = await subvenueApi.fetchSubVenues(mockToken, { city: 'Springfield' })

    expect(callApi).toHaveBeenCalledWith(
      { url: 'sub-venues?city=Springfield', method: 'GET' },
      mockToken
    )
    expect(result.data).toEqual(mockData)
  })

  it('createVenue posts subvenue data', async () => {
    const newVenue = { name: 'New Park' }
    callApi.mockResolvedValueOnce({ data: newVenue, error: { message: null } })

    const result = await subvenueApi.createSubVenue(newVenue, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'sub-venue', method: 'POST', data: newVenue },
      mockToken
    )
    expect(result.data).toEqual(newVenue)
  })

  it('updateVenue patches subvenue data', async () => {
    const updatedVenue = { id: 1, name: 'Updated Park' }
    callApi.mockResolvedValueOnce({ data: updatedVenue, error: { message: null } })

    const result = await subvenueApi.updateSubVenue(updatedVenue, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'sub-venue', method: 'PATCH', data: updatedVenue },
      mockToken
    )
    expect(result.data).toEqual(updatedVenue)
  })

  it('deleteVenue sends DELETE request with ID', async () => {
    callApi.mockResolvedValueOnce({ data: { success: true }, error: { message: null } })

    const result = await subvenueApi.deleteSubVenue(5, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'sub-venue/5', method: 'DELETE' },
      mockToken
    )
    expect(result.data).toEqual({ success: true })
  })

  it('handles errors gracefully', async () => {
    callApi.mockResolvedValueOnce({ data: null, error: { message: 'Something went wrong' } })

    const result = await subvenueApi.fetchSubVenues(mockToken)

    expect(result.data).toBeNull()
    expect(result.error.message).toBe('Something went wrong')
  })
})
