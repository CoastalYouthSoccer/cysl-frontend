import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavDocumentation from '@/components/sidebar/NavDocumentation.vue'
import { vuetify } from '@/vuetify-setup'
import { VList } from 'vuetify/components'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'AssignrReferee',
    path: '/assignr-referee',
    params: {},
    query: {},
    meta: {}
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  })
}))

describe('NavDocumentation.vue', () => {
  const createWrapper = async (userRoles = []) => {
    const wrapper = mount({
      components: { NavDocumentation, VList },
      template: '<v-list :opened="[\'documentation\']"><NavDocumentation /></v-list>',
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

  it('shows assignor items when user is assignor', async () => {
    const wrapper = await createWrapper(['Assignor'])

    expect(wrapper.find('[data-test="nav-item-assignor-documentation"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-referee-documentation"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-rule-documentation"]').exists()).toBe(true)
  })

  it('shows all items when user is admin', async () => {
    const wrapper = await createWrapper(['Administrator'])

    expect(wrapper.find('[data-test="nav-item-assignor-documentation"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-referee-documentation"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-rule-documentation"]').exists()).toBe(true)
  })

  it('shows nothing when user has no roles', async () => {
    const wrapper = await createWrapper([])

    expect(wrapper.find('[data-test="nav-item-assignor-documentation"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-referee-documentation"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-rule-documentation"]').exists()).toBe(false)
  })

  it('shows rule documentation when user is a coach', async () => {
    const wrapper = await createWrapper(['Coach'])

    expect(wrapper.find('[data-test="nav-item-rule-documentation"]').exists()).toBe(true)
  })
})
