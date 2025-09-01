import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import VenueSelect from '@/components/venue/VenueSelect.vue'
import { vuetify } from '@/vuetify-setup'
import { createTestingPinia } from '@pinia/testing'

global.ResizeObserver = require('resize-observer-polyfill')

const mockVenues = [
  { id: 'a1', name: 'Stadium A', city: 'Townville' },
  { id: 'b2', name: 'Arena B', city: 'Cityplace' }
]

describe('VenueSelect.vue', () => {
  const mountComponent = (selected = null) => {
    return mount(VenueSelect, {
      props: { selected },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              sharedData: {
                getVenues: mockVenues
              }
            },
          }),
          vuetify
        ]
      }
    })
  }

  it('renders v-select with venues when loaded', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.findComponent({name: 'VSelect'}).exists()).toBe(true)
  })

  it('binds to selected venue ID', async () => {
    const wrapper = mountComponent('b2')
    await flushPromises()
    expect(wrapper.vm.venueId).toBe('b2')
  })

  it('emits venueChange when selection changes', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    wrapper.vm.venueId = mockVenues[1]
    await wrapper.vm.$nextTick()
    const venueChange = wrapper.emitted().venueChange
    expect(venueChange).toBeTruthy()
//    expect(venueChange).toEqual([mockVenues[1]])
  })

  it('updates internal venueId when prop changes', async () => {
    const wrapper = mountComponent('a1')
    await flushPromises()

    expect(wrapper.vm.venueId).toBe('a1')

    // simulate parent changing prop
    await wrapper.setProps({ selected: 'b2' })
    await flushPromises()

    expect(wrapper.vm.venueId).toBe('b2')
  })
})
