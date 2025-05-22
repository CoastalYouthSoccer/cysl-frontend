import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useShareStore } from '@/stores/sharedData'

import { fetchAssociations } from '@/services/api.association.js'
import { fetchRoles } from '@/services/api.user.js'

vi.mock('@/services/api.association.js', () => ({
  fetchAssociations: vi.fn()
}))
vi.mock('@/services/api.user.js', () => ({
  fetchRoles: vi.fn()
}))

describe('useShareStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets associations correctly on success', async () => {
    fetchAssociations.mockResolvedValue({
      data: [
        { id: '1', name: 'Alpha' },
        { id: '2', name: 'Beta' }
      ],
      error: null
    })

    const store = useShareStore()
    await store.setAssociations('mock-token')

    expect(store.associations).toEqual(['Alpha', 'Beta'])
  })

  it('does not update associations on error', async () => {
    fetchAssociations.mockResolvedValue({
      data: null,
      error: { message: 'Failed to fetch' }
    })

    const store = useShareStore()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await store.setAssociations('mock-token')

    expect(store.associations).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching associations'))
    consoleSpy.mockRestore()
  })

  it('sets roles correctly on success', async () => {
    fetchRoles.mockResolvedValue({
      data: [{ id: '1', name: 'Admin' }],
      error: null
    })

    const store = useShareStore()
    await store.setRoles('mock-token')

    expect(store.roles).toEqual([{ id: '1', name: 'Admin' }])
  })

  it('does not update roles on error', async () => {
    fetchRoles.mockResolvedValue({
      data: null,
      error: { message: 'Unauthorized' }
    })

    const store = useShareStore()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await store.setRoles('mock-token')

    expect(store.roles).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching roles'))
    consoleSpy.mockRestore()
  })
})
