import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import VenueSelect from '@/components/venue/VenueSelect.vue'
import * as venueApi from '@/services/api.venue.js'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token')
  })
}))

const mockVenues = [
  { id: 1, name: 'Stadium A', city: 'Townville' },
  { id: 2, name: 'Arena B', city: 'Cityplace' }
]

describe('VenueSelect.vue', () => {
  it('renders v-select with venue options from API', async () => {
    vi.spyOn(venueApi, 'fetchAssignrVenues').mockResolvedValue({
      data: mockVenues,
      error: { message: null }
    })

    const wrapper = mount(VenueSelect, {
      global: {
        plugins: [vuetify],
      },
    })

    await flushPromises()

    const select = wrapper.findComponent('[data-testid="venue-select"]')
    expect(select.exists()).toBe(true)
    expect(select.props('items')).toEqual(mockVenues)
  })

  it('emits venueChange on selection', async () => {
    vi.spyOn(venueApi, 'fetchAssignrVenues').mockResolvedValue({
      data: mockVenues,
      error: { message: null }
    })

    const wrapper = mount(VenueSelect, {
      global: {
        plugins: [vuetify],
      },
    })

    await flushPromises()

    wrapper.vm.venue = mockVenues[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().venueChange).toBeTruthy()
    expect(wrapper.emitted().venueChange[0]).toEqual([mockVenues[1]])
  })

//  it('handles error in fetchVenues gracefully', async () => {
//    vi.spyOn(venueApi, 'fetchAssignrVenues').mockResolvedValue({
//      data: null,
//      error: { message: 'Failed to fetch venues' }
//    })
//
//    const wrapper = mount(VenueSelect, {
//      global: {
//        plugins: [vuetify],
//      },
//    })
//
//    await flushPromises()
//
//    const alert = wrapper.findComponent('[data-testid="venue-alert"]')
//    expect(alert.exists()).toBe(true)
//    expect(alert.text()).toContain('Error fetching venues: Failed to fetch venues')
//
//    await Promise.resolve()
//  })
})
