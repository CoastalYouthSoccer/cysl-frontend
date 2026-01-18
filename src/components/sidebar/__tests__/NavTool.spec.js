import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavTool from '@/components/sidebar/NavTool.vue'
import { vuetify } from '@/vuetify-setup'
import { VList } from 'vuetify/components'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'FieldCoordinator',
    path: '/field-coordinator',
    params: {},
    query: {},
    meta: {}
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  })
}))

describe('NavTool.vue', () => {
  const createWrapper = async (userRoles = []) => {
    const wrapper = mount({
      components: { NavTool, VList },
      template: '<v-list :opened="[\'tools\']"><NavTool /></v-list>',
    }, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
            stubActions: false,
            initialState: {
              user: {
                user: {
                  userRoles,
                },
              },
            },
          })
        ],
      },
    })

    await flushPromises()
    await wrapper.vm.$nextTick()

    return wrapper
  }

  it('renders Field Coordinator for assignor', async () => {
    const wrapper = await createWrapper(['Assignor'])

    expect(wrapper.find('[data-test="nav-item-field-coordinator"]').exists()).toBe(true)
  })

  it('renders Field Coordinator for admin', async () => {
    const wrapper = await createWrapper(['Administrator'])

    expect(wrapper.find('[data-test="nav-item-field-coordinator"]').exists()).toBe(true)
  })

  it('does not render Field Coordinator if not assignor or admin', async () => {
    const wrapper = await createWrapper(['Referee'])

    expect(wrapper.find('[data-test="nav-item-field-coordinator"]').exists()).toBe(false)
  })
})
