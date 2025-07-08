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

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token')
  })
}))

vi.mock('@/services/api.subvenue.js', () => ({
  fetchSubVenues: vi.fn()
}))

import { fetchSubVenues } from '@/services/api.subvenue.js'

describe('SubVenueSelect.vue', () => {
  it('renders v-select with subvenue options from API', async () => {
    fetchSubVenues.mockResolvedValueOnce({
      data: mockVenues,
      error: {}
    })

    const wrapper = mount(SubVenueSelect, {
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

    const select = wrapper.findComponent('[data-test="SubVenues-select"]')
    expect(select.exists()).toBe(true)
    expect(select.props('items')).toEqual(mockVenues)
  })

  it('emits SubVenueChange on selection', async () => {
    fetchSubVenues.mockResolvedValueOnce({
      data: mockVenues,
      error: {}
    })

    const wrapper = mount(SubVenueSelect, {
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

    wrapper.vm.SubVenue = mockVenues[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().SubVenueChange).toBeTruthy()
    expect(wrapper.emitted().SubVenueChange[0]).toEqual([mockVenues[1]])
  })

  it('shows error if unable to load SubVenues', async () => {
    fetchSubVenues.mockResolvedValueOnce({
      data: [],
      error: {message: 'error with SubVenues'}
    })

    const wrapper = mount(SubVenueSelect, {
      global: {
        stubs: ['v-progress-circular', 'v-select', 'v-dialog', 'v-checkbox'],
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
    expect(alert.props('msg')).toBe('Error fetching SubVenues: error with SubVenues')
  })

  it('displays loading spinner when isLoading is true', async () => {
    fetchSubVenues.mockResolvedValueOnce({
      data: [],
      error: {}
    })

    const wrapper = mount(SubVenueSelect, {
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
    expect(wrapper.find('v-progress-circular-stub').exists()).toBe(true)
  })
})
