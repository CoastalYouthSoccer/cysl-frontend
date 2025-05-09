import { mount, flushPromises } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import AssociationSelect from '@/components/association/AssociationSelect.vue';
import * as associationApi from '@/services/api.association.js'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token')
  })
}))

const mockAssociations = [
  { id: 1, name: 'Main Association' },
  { id: 2, name: 'Secondary Association' }
]

describe('AssociationSelect.vue', () => {
  let wrapper
  beforeEach(async () => {
    vi.spyOn(associationApi, 'fetchAssociations').mockResolvedValue({
      data: mockAssociations,
      error: { message: null }
    })

    wrapper = mount(AssociationSelect, {
      global: {
        plugins: [vuetify],
    },
  })

    await flushPromises()
  })

  it('renders v-select with association options from API', async () => {
    const select = wrapper.findComponent('[data-test="association-select"]')
    expect(select.exists()).toBe(true)
    expect(select.props('items')).toEqual(mockAssociations)
  })

  it('emits associationChange on selection', async () => {
    wrapper.vm.association = mockAssociations[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().associationChange).toBeTruthy()
    expect(wrapper.emitted().associationChange[0]).toEqual([mockAssociations[1]])
  })

//  it('handles error in fetchAssociations gracefully', async () => {
//    vi.mock('@/services/api.association.js', () => ({
//      fetchAssociations: vi.fn().mockResolvedValue({
//        data: null,
//        error: { message: ['Failed to fetch associations']}
//      })
//    }))
//
//    const alert = wrapper.findComponent('[data-test="association-alert"]')
//    expect(alert.exists()).toBe(true)
//    expect(alert.text()).toContain('Error fetching associations: Failed to fetch associations')
//
//    await Promise.resolve()
//
//  })
})
