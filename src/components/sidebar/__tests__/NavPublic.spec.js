import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavPublic from '@/components/sidebar/NavPublic.vue'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

describe('NavPublic.vue (Vue Test Utils)', () => {
  it('shows everything when user has no roles', () => {
    const wrapper = mount(NavPublic, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              user: {
                userRoles: [],
              },
            },
          },
        })],
      },
    })

    expect(wrapper.find('[data-test="nav-item-home"]').exists()).toBe(true)
  })
})
