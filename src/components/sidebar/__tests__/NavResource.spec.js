import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavResource from '@/components/sidebar/NavResource.vue'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

describe('NavResources.vue', () => {
  it('shows "Make the Call" item for admin', () => {
    const wrapper = mount(NavResource, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          initialState: {
            user: {
              user: {
                userRoles: ['Administrator'],
              },
            },
          },
        })],
      },
    })
    expect(wrapper.findComponent('[data-test="nav-item-make-call"]').exists()).toBe(true)
  })

  it('shows "Make the Call" item for assignor', () => {
    const wrapper = mount(NavResource, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              user: {
                userRoles: ['Assignor'],
              },
            },
          },
        })],
      },
    })
    expect(wrapper.find('[data-test="nav-item-make-call"]').exists()).toBe(true)
  })

  it('shows "Make the Call" item for referee', () => {
    const wrapper = mount(NavResource, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              user: {
                userRoles: ['Referee'],
              },
            },
          },
        })],
      },
    })
    expect(wrapper.find('[data-test="nav-item-make-call"]').exists()).toBe(true)
  })

  it('does not show "Make the Call" item if user has no valid role', () => {
    const wrapper = mount(NavResource, {
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
    expect(wrapper.find('[data-test="nav-item-make-call"]').exists()).toBe(false)
  })
})
