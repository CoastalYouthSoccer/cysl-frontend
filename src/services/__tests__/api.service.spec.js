import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { callApi } from '../api.service';

vi.mock('axios');

describe('callApi', () => {
  it('should call the correct URL and return data on success', async () => {
    const mockResponse = { data: { message: 'success' } };
    axios.mockResolvedValueOnce(mockResponse);

    const options = { url: 'test-endpoint', method: 'GET' };
    const result = await callApi(options);

    expect(axios).toHaveBeenCalledWith({ url: 'http://localhost:8000/test-endpoint', method: 'GET' });
    expect(result).toEqual({ data: { message: 'success' }, error: { message: null }});
  });

  it('should return an error message on failure', async () => {
    const mockError = {
      response: { statusText: 'Not Found', data: { message: 'Not Found' } },
      message: 'Request failed',
      isAxiosError: true,
    };
    axios.mockRejectedValueOnce(mockError);

    const options = { url: 'test-endpoint', method: 'GET' };
    const result = await callApi(options);

    expect(axios).toHaveBeenCalledWith({ url: 'http://localhost:8000/test-endpoint', method: 'GET' });
    expect(result).toEqual({ data: null, error: { message: 'Request failed' } });
  });

  it('should handle non-Axios errors', async () => {
    const mockError = new Error('Network Error');
    axios.mockRejectedValueOnce(mockError);

    const options = { url: 'test-endpoint', method: 'GET' };
    const result = await callApi(options);

    expect(axios).toHaveBeenCalledWith({ url: 'http://localhost:8000/test-endpoint', method: 'GET' });
    expect(result).toEqual({ data: null, error: { message: 'Network Error' } });
  });
});
