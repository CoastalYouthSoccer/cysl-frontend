import { mount, flushPromises } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import AssociationSelect from '@/components/association/AssociationSelect.vue';
import { vuetify } from '@/vuetify-setup'

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token')
  })
}))

const mockAssociations = [
  { id: 1, name: 'Main Association' },
  { id: 2, name: 'Secondary Association' }
]

describe('AssociationSelect.vue', () => {
  let wrapper
  beforeEach(async () => {
    vi.mock('@/services/api.association.js', () => ({
      fetchAssociations: vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Main Association' },
          { id: 2, name: 'Secondary Association' },
        ],
        error: { message: null }
      })
    }))

    wrapper = mount(AssociationSelect, {
      global: {
        plugins: [
          vuetify,
      ]},
    })
    await flushPromises()
  })

  it('fetches associations and displays them in v-select', async () => {
    const select = wrapper.findComponent('[data-testid="association-select"]')
    expect(select.exists()).toBe(true)

    // Check that the items prop includes our associations
    expect(select.props('items')).toEqual(mockAssociations)
  })

  it('emits associationChange on selection', async () => {
    wrapper.vm.association = mockAssociations[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().associationChange).toBeTruthy()
    expect(wrapper.emitted().associationChange[0]).toEqual([mockAssociations[1]])
  })

  it('handles error in fetchAssociations gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mock('@/services/api.association.js', () => ({
      fetchAssociations: vi.fn().mockResolvedValue({
        data: null,
        error: { message: ['Failed to fetch associations']}
      })
    }))

    await Promise.resolve()

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching associations: Failed to fetch associations'
    )

    consoleSpy.mockRestore()
  })
})
