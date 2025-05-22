import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as associationApi from '../api.association';
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

    const result = await associationApi.fetchAssociations(mockToken);

    expect(callApi).toHaveBeenCalledWith(
      {url: 'associations', method: 'GET'},
      mockToken
    )

    expect(result.data).toEqual(mockResponse.data);
  });

  it('should return an error message on failure', async () => {
    callApi.mockResolvedValueOnce({ data: null, error: { message: 'Server error' } })

    const result = await associationApi.fetchAssociations(mockToken);

    expect(result.data).toBeNull()
    expect(result.error.message).toBe('Server error')
  });

    it('createAssociation posts data', async () => {
      const newAssociation = { name: 'New Park' }
      callApi.mockResolvedValueOnce({ data: newAssociation, error: { message: null } })

      const result = await associationApi.createAssociation(newAssociation, mockToken)

      expect(callApi).toHaveBeenCalledWith(
        { url: 'association', method: 'POST', data: newAssociation },
        mockToken
      )
      expect(result.data).toEqual(newAssociation)
    })

    it('updateAssociation patches association data', async () => {
      const updatedAssociation = { id: 1, name: 'Updated Association' }
      callApi.mockResolvedValueOnce({ data: updatedAssociation, error: { message: null } })

      const result = await associationApi.updateAssociation(updatedAssociation, mockToken)

      expect(callApi).toHaveBeenCalledWith(
        { url: 'association', method: 'PATCH', data: updatedAssociation },
        mockToken
      )
      expect(result.data).toEqual(updatedAssociation)
    })

    it('deleteAssociation sends DELETE request with ID', async () => {
      callApi.mockResolvedValueOnce({ data: { success: true }, error: { message: null } })

      const result = await associationApi.deleteAssociation(5, mockToken)

      expect(callApi).toHaveBeenCalledWith(
        { url: 'association/5', method: 'DELETE' },
        mockToken
      )
      expect(result.data).toEqual({ success: true })
    })
});
