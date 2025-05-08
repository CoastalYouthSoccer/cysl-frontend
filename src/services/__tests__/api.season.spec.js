import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as seasonApi from '../api.season' // adjust path
import { callApi } from '../api.service'   // adjust path

vi.mock('../api.service', () => ({
  callApi: vi.fn()
}))

const mockToken = 'mock-token'

describe('season API methods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchSeasons calls callApi with query params', async () => {
    callApi.mockResolvedValueOnce({ data: [{ id: 1, name: 'Spring' }], error: { message: null } })

    const params = { year: 2024 }
    const result = await seasonApi.fetchSeasons(mockToken, params)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'seasons?year=2024', method: 'GET' },
      mockToken
    )
    expect(result.data).toEqual([{ id: 1, name: 'Spring' }])
  })

  it('createSeason sends POST request with season data', async () => {
    const season = { name: 'Summer', start_dt: '2025-06-01' }
    callApi.mockResolvedValueOnce({ data: season, error: { message: null } })

    const result = await seasonApi.createSeason(season, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'season', method: 'POST', data: season },
      mockToken
    )
    expect(result.data).toEqual(season)
  })

  it('updateSeason sends PATCH request with season data', async () => {
    const season = { id: 2, name: 'Fall', start_dt: '2025-09-01' }
    callApi.mockResolvedValueOnce({ data: season, error: { message: null } })

    const result = await seasonApi.updateSeason(season, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'season', method: 'PATCH', data: season },
      mockToken
    )
    expect(result.data).toEqual(season)
  })

  it('deleteSeason sends DELETE request with season id', async () => {
    callApi.mockResolvedValueOnce({ data: { success: true }, error: { message: null } })

    const result = await seasonApi.deleteSeason(3, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'season/3', method: 'DELETE' },
      mockToken
    )
    expect(result.data).toEqual({ success: true })
  })

  it('handles API error responses gracefully', async () => {
    callApi.mockResolvedValueOnce({ data: null, error: { message: 'Server error' } })

    const result = await seasonApi.fetchSeasons(mockToken)

    expect(result.data).toBeNull()
    expect(result.error.message).toBe('Server error')
  })
})
