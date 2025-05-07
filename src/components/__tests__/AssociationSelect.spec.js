import { mount } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import AssociationSelect from '@/components/association/AssociationSelect.vue';
import { fetchAssignrAssociations } from '@/services/api.association.js';
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@/services/api.association', () => ({
  fetchAssociations: vi.fn()
}))

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token')
  })
}))

const mockAssociations = [
  { id: 1, name: 'Main Association' },
  { id: 2, name: 'Secondary Association' },
]

describe('AssociationSelect.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches associations and displays them in v-select', async () => {
    fetchAssociations.mockResolvedValueOnce({
      data: mockAssociations,
      error: { message: null }
    })

    const wrapper = mount(AssociationSelect)

    await wrapper.vm.$nextTick()

    const select = wrapper.findComponent({ label: 'VSelect' })
    expect(select.exists()).toBe(true)

    // Check that the items prop includes our associations
    expect(select.props('items')).toEqual(mockAssociations)
  })

  it('emits associationChange on selection', async () => {
    fetchAssociations.mockResolvedValueOnce({
      data: mockAssociations,
      error: { message: null }
    })

    const wrapper = mount(AssociationSelect)

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    wrapper.vm.association = mockAssociations[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().associationChange).toBeTruthy()
    expect(wrapper.emitted().associationChange[0]).toEqual([mockAssociations[1]])
  })

  it('handles error in fetchAssociations gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchAssociations.mockResolvedValueOnce({
      data: null,
      error: { message: ['Error fetching associations:', 'Failed to fetch associations']}
    })

    mount(AssociationSelect)

    await Promise.resolve()

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching associations:',
      'Failed to fetch associations'
    )

    consoleSpy.mockRestore()
  })
})
