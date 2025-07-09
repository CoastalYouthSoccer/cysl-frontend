import { mount, flushPromises } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

import SeasonSelect from '@/components/season/SeasonSelect.vue';
import * as api from '@/services/api.season.js'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token')
  })
}))

const mockSeasons = [
  { id: 1, name: 'Main Season' },
  { id: 2, name: 'Secondary Season' }
]

describe('SeasonSelect.vue', () => {
  let wrapper
  beforeEach(async () => {
    vi.spyOn(api, 'fetchSeasons').mockResolvedValue({
      data: mockSeasons,
      error: { message: null }
    })

    wrapper = mount(SeasonSelect, {
      global: {
        plugins: [vuetify],
    },
  })

    await flushPromises()
  })

  it('renders v-select with season options from API', async () => {
    const select = wrapper.findComponent('[data-test="season-select"]')
    expect(select.exists()).toBe(true)
    expect(select.props('items')).toEqual(mockSeasons)
  })

  it('emits seasonChange on selection', async () => {
    wrapper.vm.season = mockSeasons[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().seasonChange).toBeTruthy()
    expect(wrapper.emitted().seasonChange[0]).toEqual([mockSeasons[1]])
  })

  it('shows loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[data-test="loading"]').exists()).toBe(true)
  })

  it('shows error alert when errorMessage is set', async () => {
    api.fetchSeasons.mockResolvedValueOnce({
      data: [],
      error: {message: 'error with Seasons'}
    })

    const wrapper = mount(SeasonSelect, {
      global: {
        stubs: ['v-progress-circular', 'v-select', 'v-dialog', 'v-divider', 'v-checkbox'],
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                user: {
                  permissions: ['read:seasons'],
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
    expect(alert.props('msg')).toBe('Error Fetching Seasons: error with Seasons')
  })
})
