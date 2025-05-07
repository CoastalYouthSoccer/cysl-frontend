import { mount } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import VenueSelect from '@/components/venue/VenueSelect.vue';
import { fetchAssignrVenues } from '@/services/api.venue.js';
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@/services/api.venue', () => ({
  fetchAssignrVenues: vi.fn()
}))

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token')
  })
}))

const mockVenues = [
  { id: 1, name: 'Main Field', city: 'Springfield' },
  { id: 2, name: 'Secondary Field', city: 'Shelbyville' },
]

describe('VenueSelect.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches venues and displays them in v-select', async () => {
    fetchAssignrVenues.mockResolvedValueOnce({
      data: mockVenues,
      error: { message: null }
    })

    const wrapper = mount(VenueSelect)

    await wrapper.vm.$nextTick()

    const select = wrapper.findComponent({ label: 'VSelect' })
    expect(select.exists()).toBe(true)

    // Check that the items prop includes our venues
    expect(select.props('items')).toEqual(mockVenues)
  })

  it('emits venueChange on selection', async () => {
    fetchAssignrVenues.mockResolvedValueOnce({
      data: mockVenues,
      error: { message: null }
    })

    const wrapper = mount(VenueSelect)

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    wrapper.vm.venue = mockVenues[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().venueChange).toBeTruthy()
    expect(wrapper.emitted().venueChange[0]).toEqual([mockVenues[1]])
  })

  it('handles error in fetchAssignrVenues gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchAssignrVenues.mockResolvedValueOnce({
      data: null,
      error: { message: ['Error fetching venues:', 'Failed to fetch venues']}
    })

    mount(VenueSelect)

    await Promise.resolve()

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching venues:',
      'Failed to fetch venues'
    )

    consoleSpy.mockRestore()
  })
})
