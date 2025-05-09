import { mount, flushPromises } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import SeasonSelect from '@/components/season/SeasonSelect.vue';
import * as seasonApi from '@/services/api.season.js'
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
    vi.spyOn(seasonApi, 'fetchSeasons').mockResolvedValue({
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

//  it('handles error in fetchSeasons gracefully', async () => {
//    vi.mock('@/services/api.season.js', () => ({
//      fetchSeasons: vi.fn().mockResolvedValue({
//        data: null,
//        error: { message: ['Failed to fetch seasons']}
//      })
//    }))
//
//    const alert = wrapper.findComponent('[data-test="season-alert"]')
//    expect(alert.exists()).toBe(true)
//    expect(alert.text()).toContain('Error fetching seasons: Failed to fetch seasons')
//
//    await Promise.resolve()
//
//  })
})
