import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavResource from '@/components/sidebar/NavResource.vue'
import { vuetify } from '@/vuetify-setup'
import { VList } from 'vuetify/components'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'MakeTheCall',
    path: '/make-the-call',
    params: {},
    query: {},
    meta: {}
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  })
}))

describe('NavResources.vue', () => {
  const createWrapper = async (userRoles = []) => {
    const wrapper = mount({
      components: { NavResource, VList },
      template: '<v-list :opened="[\'resources\']"><NavResource /></v-list>',
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

  it('shows "Make the Call" item for admin', async () => {
    const wrapper = await createWrapper(['Administrator'])

    expect(wrapper.find('[data-test="nav-item-make-call"]').exists()).toBe(true)
  })

  it('shows "Make the Call" item for assignor', async () => {
    const wrapper = await createWrapper(['Assignor'])

    expect(wrapper.find('[data-test="nav-item-make-call"]').exists()).toBe(true)
  })

  it('shows "Make the Call" item for referee', async () => {
    const wrapper = await createWrapper(['Referee'])

    expect(wrapper.find('[data-test="nav-item-make-call"]').exists()).toBe(true)
  })

  it('does not show "Make the Call" item if user has no valid role', async () => {
    const wrapper = await createWrapper([])

    expect(wrapper.find('[data-test="nav-item-make-call"]').exists()).toBe(false)
  })
})
