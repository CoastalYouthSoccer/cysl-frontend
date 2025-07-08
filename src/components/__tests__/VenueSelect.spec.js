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

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token')
  })
}))

vi.mock('@/services/api.venue.js', () => ({
  fetchAssignrVenues: vi.fn()
}))

import { fetchAssignrVenues } from '@/services/api.venue.js'

describe('VenueSelect.vue', () => {
  it('renders v-select with venue options from API', async () => {
    fetchAssignrVenues.mockResolvedValueOnce({
      data: mockVenues,
      error: {}
    })

    const wrapper = mount(VenueSelect, {
      global: {
        stubs: ['v-progress-circular', 'v-select', 'v-dialog', 'v-divider', 'v-checkbox'],
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                user: {
                  permissions: ['read:venues'],
                },
              },
            }
          })
        ],
      }
    })
    await flushPromises()

    const select = wrapper.findComponent('[data-test="venue-select"]')
    expect(select.exists()).toBe(true)
    expect(select.props('items')).toEqual(mockVenues)
  })

  it('emits venueChange on selection', async () => {
    fetchAssignrVenues.mockResolvedValueOnce({
      data: mockVenues,
      error: {}
    })

    const wrapper = mount(VenueSelect, {
      global: {
        stubs: ['v-progress-circular', 'v-select', 'v-dialog', 'v-divider', 'v-checkbox'],
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                user: {
                  permissions: ['read:venues'],
                },
              },
            }
          })
        ],
      }
    })

    await flushPromises()

    wrapper.vm.venue = mockVenues[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().venueChange).toBeTruthy()
    expect(wrapper.emitted().venueChange[0]).toEqual([mockVenues[1]])
  })

  it('shows error if unable to load venues', async () => {
    fetchAssignrVenues.mockResolvedValueOnce({
      data: [],
      error: {message: 'error with venues'}
    })

    const wrapper = mount(VenueSelect, {
      global: {
        stubs: ['v-progress-circular', 'v-select', 'v-dialog', 'v-divider', 'v-checkbox'],
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                user: {
                  permissions: ['read:venues'],
                },
              },
            }
          })
        ],
      }
    })

    await flushPromises()

    const alert = wrapper.findComponent({ name: 'Alert' })
    expect(alert.exists()).toBe(true)
    expect(alert.props('msg')).toBe('Error fetching venues: error with venues')
  })

  it('displays loading spinner when isLoading is true', async () => {
    fetchAssignrVenues.mockResolvedValueOnce({
      data: [],
      error: {}
    })

    const wrapper = mount(VenueSelect, {
      global: {
        stubs: ['v-progress-circular', 'v-select', 'v-dialog', 'v-divider', 'v-checkbox'],
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                user: {
                  permissions: ['read:venues'],
                },
              },
            }
          })
        ],
      }
    })

    wrapper.vm.isLoading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[data-test="loading"]').exists()).toBe(true)
  })
})
