import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavDocumentation from '@/components/sidebar/NavDocumentation.vue'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

describe('NavDocumentation.vue (Vue Test Utils)', () => {
  it('shows only assignor item when user is assignor', () => {
    const wrapper = mount(NavDocumentation, {
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

    expect(wrapper.find('[data-test="nav-item-assignor-documentation"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-referee-documentation"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-rule-documentation"]').exists()).toBe(true)
  })

  it('shows all items when user is admin', () => {
    const wrapper = mount(NavDocumentation, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          createSpy: vi.fn,
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

    expect(wrapper.find('[data-test="nav-item-assignor-documentation"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-referee-documentation"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-rule-documentation"]').exists()).toBe(true)
  })

  it('shows nothing when user has no roles', () => {
    const wrapper = mount(NavDocumentation, {
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

    expect(wrapper.find('[data-test="nav-item-assignor-documentation"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-referee-documentation"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-rule-documentation"]').exists()).toBe(false)
  })

  it('shows rule documentation when user is a coach', () => {
    const wrapper = mount(NavDocumentation, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              user: {
                userRoles: ['Coach'],
              },
            },
          },
        })],
      },
    })

    expect(wrapper.find('[data-test="nav-item-rule-documentation"]').exists()).toBe(true)
  })
})
