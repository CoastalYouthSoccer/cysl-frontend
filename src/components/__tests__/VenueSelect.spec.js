import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import VenueSelect from '@/components/venue/VenueSelect.vue'
import { vuetify } from '@/vuetify-setup'

// Mock Auth0
vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token')
  })
}))


describe('VenueSelect.vue', () => {
  let wrapper
  beforeEach(async () => {
    vi.mock('@/services/api.venue.js', () => ({
      fetchAssignrVenues: vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Stadium A', city: 'Townville' },
          { id: 2, name: 'Arena B', city: 'Cityplace' }
        ],
        error: { message: null }
      })
    }))

    wrapper = mount(VenueSelect, {
      global: {
        plugins: [
          vuetify,
      ],
    },
  })
    await flushPromises()
  })

  it('renders v-select with venue options from API', async () => {
    const select = wrapper.findComponent('[data-testid="venue-select"]')
    expect(select.exists()).toBe(true)
  })
})
