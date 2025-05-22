import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiAssociation from '../api.association';
import { callApi } from '../api.service';

vi.mock('../api.service', () => ({
  callApi: vi.fn()
}))

const mockToken = 'mock-token'

describe('Associations API Methods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call callApi with correct config and return data on success', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Association 1' }] };

    callApi.mockResolvedValueOnce({ data: mockResponse.data, error: { message: null } })

    const result = await apiAssociation.fetchAssociations(mockToken);

    expect(callApi).toHaveBeenCalledWith(
      {url: 'associations', method: 'GET'},
      mockToken
    )

    expect(result.data).toEqual(mockResponse.data);
  });

  it('should return an error message on failure', async () => {
    callApi.mockResolvedValueOnce({ data: null, error: { message: 'Server error' } })

    const result = await apiAssociation.fetchAssociations(mockToken);

    expect(result.data).toBeNull()
    expect(result.error.message).toBe('Server error')
  });
});
