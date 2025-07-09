import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import SubVenueSelect from '@/components/venue/SubVenueSelect.vue'
import { vuetify } from '@/vuetify-setup'
import { createTestingPinia } from '@pinia/testing'

global.ResizeObserver = require('resize-observer-polyfill')

const mockVenues = [
  { id: 1, name: 'Field A' },
  { id: 2, name: 'Field B' }
]
describe('SubVenueSelect.vue', () => {
  it('renders v-select with subvenue options from API', async () => {
    const wrapper = mount(SubVenueSelect, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              sharedStore: {
                subVenues: mockVenues
              }
            },
          })
        ],
      }
    })
    await flushPromises()

    const select = wrapper.get('[data-test="SubVenues-select"]')
    expect(select.exists()).toBe(true)
//    expect(select.props('items')).toEqual(mockVenues)
  })

  it('emits SubVenueChange on selection', async () => {
    const wrapper = mount(SubVenueSelect, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              sharedStore: {
                subVenues: mockVenues
              }
            },
          })
        ],
      }
    })

    await flushPromises()

    wrapper.vm.subVenue = mockVenues[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().SubVenueChange).toBeTruthy()
    expect(wrapper.emitted().SubVenueChange[0]).toEqual([mockVenues[1]])
  })
})
