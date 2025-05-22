import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RoleChip from '@/components/user/RoleChip.vue'
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

const rolesMock = [
  { id: '1', name: 'Admin', description: 'Full access' },
  { id: '2', name: 'Editor', description: 'Can edit content' }
]

describe('RoleChip.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(RoleChip, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
              share: {
                roles: rolesMock
              }
            }
          }),
          vuetify
        ],
      },
      props: {
        assignedRoles: [{ id: '1', name: 'Admin', description: 'Full access' }],
      }
    })
  })

  it('renders all roles as chips', () => {
    const chips = wrapper.findAllComponents('.v-chip')
    expect(chips.length).toBe(2)
    expect(chips[0].text()).toContain('Admin')
    expect(chips[1].text()).toContain('Editor')
  })

  it('colors assigned roles as primary', async () => {
    const chips = wrapper.findAllComponents('.v-chip')
    expect(chips[0].props('color')).toBe('primary') // Admin is assigned
    expect(chips[1].props('color')).toBe('grey lighten-1') // Editor is not
  })

  it('toggles role selection on click and emits updated roles', async () => {
    const chips = wrapper.findAllComponents('.v-chip')

    // Click "Editor" to assign it
    await chips[1].trigger('click')
    await nextTick()

    const events = wrapper.emitted('update:assignedRoles')
    expect(events).toBeTruthy()
    const updated = events[0][0]
    expect(updated).toEqual([
      { id: '1', name: 'Admin', description: 'Full access' },
      { id: '2', name: 'Editor', description: 'Can edit content' }
    ])
  })
})
