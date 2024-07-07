import { describe, it, expect, vi } from 'vitest';
import { fetchVenues } from '../api.venue'; // Adjust the import to your actual file
import { callApi } from '../api.service';

vi.mock('./api.service', () => ({
  callApi: vi.fn(),
}));

describe('fetchVenues', () => {
  it('should call callApi with correct config and return data on success', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Venue 1' }] };
    callApi.mockResolvedValueOnce(mockResponse);

    const result = await fetchVenues();

    expect(callApi).toHaveBeenCalledWith({
      url: 'venues',
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });

    expect(result).toEqual({ data: mockResponse.data, error: null });
  });

  it('should return an error message on failure', async () => {
    const mockError = { error: { message: 'Request failed' } };
    callApi.mockResolvedValueOnce(mockError);

    const result = await fetchVenues();

    expect(callApi).toHaveBeenCalledWith({
      url: 'venues',
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });

    expect(result).toEqual({ data: null, error: mockError.error });
  });
});
