import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavMaintenance from '@/components/sidebar/NavMaintenance.vue'
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

describe('NavMaintenance.vue', () => {
  const createWrapper = async (userRoles = []) => {
    const wrapper = mount({
      components: { NavMaintenance, VList },
      template: '<v-list :opened="[\'maintenance\']"><NavMaintenance /></v-list>',
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

  it('shows all items when user is admin', async () => {
    const wrapper = await createWrapper(['Administrator'])

    expect(wrapper.find('[data-test="nav-item-association"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-season"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-venue"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-user"]').exists()).toBe(true)
  })

  it('shows association and season items when user is league rep', async () => {
    const wrapper = await createWrapper(['League Rep'])

    expect(wrapper.find('[data-test="nav-item-association"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-season"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-venue"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-user"]').exists()).toBe(false)
  })

  it('shows only venue item when user is association rep', async () => {
    const wrapper = await createWrapper(['Association Rep'])

    expect(wrapper.find('[data-test="nav-item-association"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-season"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-venue"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-user"]').exists()).toBe(false)
  })

  it('shows no items when user has no roles', async () => {
    const wrapper = await createWrapper([])

    expect(wrapper.find('[data-test="nav-item-association"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-season"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-venue"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-user"]').exists()).toBe(false)
  })
})
