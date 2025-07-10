import { mount, flushPromises } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

import SeasonSelect from '@/components/season/SeasonSelect.vue';
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

describe('SeasonSelect.vue', () => {
  const mockSeasons = [
    { id: 1, name: 'Main Season' },
    { id: 2, name: 'Secondary Season' }
  ]
  let wrapper

  beforeEach(async () => {
    wrapper = mount(SeasonSelect, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              sharedData: {
                getSeasons: mockSeasons
              }
            },
            createSpy: vi.fn,
            stubActions: false,
          }),
          vuetify
        ]
      },
    })

    await flushPromises()
  })

  it('renders v-select with season options', async () => {
    expect(wrapper.findComponent({name: 'VSelect'}).exists()).toBe(true)
  })


  it('emits seasonChange on selection', async () => {
    wrapper.vm.season = mockSeasons[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().seasonChange).toBeTruthy()
    expect(wrapper.emitted().seasonChange[0]).toEqual([mockSeasons[1]])
  })
})
