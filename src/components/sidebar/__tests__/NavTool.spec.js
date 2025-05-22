import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavTool from '@/components/sidebar/NavTool.vue'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

describe('NavTool.vue', () => {
  it('renders Field Coordinator for assignor', () => {
    const wrapper = mount(NavTool, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
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
    expect(wrapper.find('[data-test="nav-item-field-coordinator"]').exists()).toBe(true)
  })

  it('renders Field Coordinator for admin', () => {
    const wrapper = mount(NavTool, {
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
    expect(wrapper.find('[data-test="nav-item-field-coordinator"]').exists()).toBe(true)
  })

  it('does not render Field Coordinator if not assignor or admin', () => {
    const wrapper = mount(NavTool, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
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
    expect(wrapper.find('[data-test="nav-item-field-coordinator"]').exists()).toBe(false)
  })
})
