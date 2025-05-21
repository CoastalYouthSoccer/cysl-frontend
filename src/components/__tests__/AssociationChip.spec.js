import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AssociationChip from '@/components/user/AssociationChip.vue'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'

// Mock Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

const associationsMock = ['Main Association', 'Secondary Association']

describe('AssociationChip.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(AssociationChip, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
              share: {
                associations: associationsMock
              }
            }
          }),
          vuetify
        ],
      },
      props: {
        assignedAssociations: ['Main Association'],
      }
    })
  })

  it('renders all associations as chips', () => {
    const chips = wrapper.findAllComponents('.v-chip')
    expect(chips.length).toBe(2)
    expect(chips[0].text()).toContain('Main Association')
    expect(chips[1].text()).toContain('Secondary Association')
  })

  it('colors assigned associations as primary', async () => {
    const chips = wrapper.findAllComponents('.v-chip')
    console.log(wrapper.html())
    expect(chips[0].props('color')).toBe('primary')
    expect(chips[1].props('color')).toBe('grey lighten-1')
  })

  it('toggles association selection on click and emits updated associations', async () => {
    const chips = wrapper.findAllComponents('.v-chip')

    await chips[1].trigger('click')
    await nextTick()

    const events = wrapper.emitted('update:assignedAssociations')
    expect(events).toBeTruthy()
    const updated = events[0][0]
    expect(updated).toEqual(['Main Association','Secondary Association'])
  })
})

