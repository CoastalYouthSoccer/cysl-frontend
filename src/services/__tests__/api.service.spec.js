import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { callApi } from '../api.service'

// Mock axios
vi.mock('axios')

describe('callApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls API with https domain when no port', async () => {
    // Mock location.host
    Object.defineProperty(globalThis, 'location', {
      value: { host: 'example.com' },
      writable: true,
    })

    axios.mockResolvedValueOnce({ data: { result: 'success' } })

    const result = await callApi({ url: 'test', method: 'GET' })

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://example.com/api/test',
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      })
    )
    expect(result).toEqual({ data: { result: 'success' }, error: { message: null } })
  })

  it('calls API with localhost override', async () => {
    Object.defineProperty(globalThis, 'location', {
      value: { host: 'localhost:5173' },
      writable: true,
    })

    axios.mockResolvedValueOnce({ data: { foo: 'bar' } })

    const result = await callApi({ url: 'data', method: 'POST' }, 'mytoken')

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'http://localhost:8000/data',
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer mytoken',
        }),
      })
    )
    expect(result.data).toEqual({ foo: 'bar' })
  })

  it('returns error on failure', async () => {
    Object.defineProperty(globalThis, 'location', {
      value: { host: 'example.com' },
      writable: true,
    })

    axios.mockRejectedValueOnce({
      response: {
        data: { message: 'Not Found' },
        statusText: '404 Not Found',
      },
      message: 'Request failed',
      isAxiosError: true,
    })

    const result = await callApi({ url: 'bad-endpoint', method: 'GET' })

    expect(result).toEqual({
      data: null,
      error: { message: 'Request failed' },
    })
  })
})
