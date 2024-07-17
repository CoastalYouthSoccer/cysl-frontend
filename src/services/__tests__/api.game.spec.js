import { describe, it, expect, vi } from 'vitest';
import { fetchGames } from '../api.game';
import { callApi } from '../api.service';

vi.mock('../api.service', () => ({
  callApi: vi.fn(),
}));

describe('fetchGames', () => {
  it('should call callApi with correct config and return data on success', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Game 1' }] };
    callApi.mockResolvedValueOnce(mockResponse);

    const accessToken = 'test-access-token';
    const params = { category: 'action' };
    const result = await fetchGames(accessToken, params);

    expect(callApi).toHaveBeenCalledWith({
      url: 'games',
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: params,
    });

    expect(result).toEqual({ data: mockResponse.data, error: undefined });
  });

  it('should return an error message on failure', async () => {
    const mockError = { error: { message: 'Request failed' } };
    callApi.mockResolvedValueOnce(mockError);

    const accessToken = 'test-access-token';
    const params = { category: 'action' };
    const result = await fetchGames(accessToken, params);

    expect(callApi).toHaveBeenCalledWith({
      url: 'games',
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: params,
    });

    expect(result).toEqual({ data: null, error: mockError.error });
  });
});
