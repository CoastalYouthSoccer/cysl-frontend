import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import VenueSelect from '@/components/venue/VenueSelect.vue'
import { vuetify } from '@/vuetify-setup'
import { createTestingPinia } from '@pinia/testing'

global.ResizeObserver = require('resize-observer-polyfill')

const mockVenues = [
  { id: 1, name: 'Stadium A', city: 'Townville' },
  { id: 2, name: 'Arena B', city: 'Cityplace' }
]

describe('VenueSelect.vue', () => {
  const factory = (selected = null) => {
    return mount(VenueSelect, {
      global: {
        plugins: [createTestingPinia({
          stubActions: false,
          createSpy: vi.fn,
          initialState: {
            sharedStore: {
              venues: [],
              isLoading: false,
              errorMessage: null
            }
          }
        })],
      },
      props: { selected }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders v-select with venues when loaded', async () => {
    const wrapper = mount(VenueSelect, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          initialState: {
            sharedStore: {
              venues: mockVenues
            }
          }
        })],
      }
    })

    await flushPromises()
    const select = wrapper.get('[data-test="venue-select"]')
    expect(select.exists()).toBe(true)
  })

  it('pre-fills selected venue when provided', async () => {
    const selected = mockVenues[1]
    const wrapper = mount(VenueSelect, {
      props: { selected },
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          initialState: {
            sharedStore: {
              venues: mockVenues
            }
          }
        })]
      }
    })

    await flushPromises()
    const select = wrapper.get('[data-test="venue-select"]')
    expect(select.exists()).toBe(true)
    expect(wrapper.vm.venue).toEqual(selected)
  })

  it('emits venueChange when venue is updated', async () => {
    const wrapper = mount(VenueSelect, {
      props: { selected: null },
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          stubActions: false,
          initialState: {
            sharedStore: {
              venues: mockVenues
            }
          }
        })]
      }
    })

    await flushPromises()
    wrapper.vm.venue = mockVenues[0]
    await flushPromises()

    expect(wrapper.emitted('venueChange')).toBeTruthy()
    expect(wrapper.emitted('venueChange')[0]).toEqual([mockVenues[0]])
  })
})
