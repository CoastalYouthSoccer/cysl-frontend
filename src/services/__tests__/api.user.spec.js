import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as userApi from '../api.user'
import { callApi } from '../api.service'

vi.mock('../api.service', () => ({
  callApi: vi.fn()
}))

const mockToken = 'mock-token'

describe('user API methods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchUsers calls callApi with query params', async () => {
    callApi.mockResolvedValueOnce({ data: [{ id: 1, name: 'Spring' }], error: { message: null } })

    const params = { year: 2024 }
    const result = await userApi.fetchUsers(mockToken, params)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'users?year=2024', method: 'GET' },
      mockToken
    )
    expect(result.data).toEqual([{ id: 1, name: 'Spring' }])
  })

  it('updateUser sends PATCH request with user data', async () => {
    const user = { id: 2, name: 'Fall', start_dt: '2025-09-01' }
    callApi.mockResolvedValueOnce({ data: user, error: { message: null } })

    const result = await userApi.updateUser(user, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'user', method: 'PATCH', data: user },
      mockToken
    )
    expect(result.data).toEqual(user)
  })

  it('deleteUser sends DELETE request with user id', async () => {
    callApi.mockResolvedValueOnce({ data: { success: true }, error: { message: null } })

    const result = await userApi.deleteUser(3, mockToken)

    expect(callApi).toHaveBeenCalledWith(
      { url: 'user/3', method: 'DELETE' },
      mockToken
    )
    expect(result.data).toEqual({ success: true })
  })

  it('handles API error responses gracefully', async () => {
    callApi.mockResolvedValueOnce({ data: null, error: { message: 'Server error' } })

    const result = await userApi.fetchUsers(mockToken)

    expect(result.data).toBeNull()
    expect(result.error.message).toBe('Server error')
  })
})
