import { describe, it, expect, vi } from 'vitest';
import { fetchVenues } from '../api.venue';
import * as apiService from '../api.service';

describe('fetchVenues', () => {
  it('should call callApi with correct config and return data on success', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Venue 1' }] };
    const callApiSpy = vi.spyOn(apiService, 'callApi').mockResolvedValueOnce(mockResponse);

    const result = await fetchVenues();

    expect(callApiSpy).toHaveBeenCalledWith({
      url: 'cysl/venues',
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });

    expect(result).toEqual({ data: mockResponse.data, error: undefined });

    callApiSpy.mockRestore(); // Clean up the spy after the test
  });

  it('should return an error message on failure', async () => {
    const mockError = { error: { message: 'Request failed' } };
    const callApiSpy = vi.spyOn(apiService, 'callApi').mockResolvedValueOnce(mockError);

    const result = await fetchVenues();

    expect(callApiSpy).toHaveBeenCalledWith({
      url: 'cysl/venues',
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });

    expect(result).toEqual({ data: null, error: mockError.error });

    callApiSpy.mockRestore(); // Clean up the spy after the test
  });
});
