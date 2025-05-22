import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavMaintenance from '@/components/sidebar/NavMaintenance.vue'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

describe('NavMaintenance.vue', () => {
  it('shows all items when user is admin', () => {
    const wrapper = mount(NavMaintenance, {
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

    expect(wrapper.find('[data-test="nav-item-association"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-season"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-venue"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-user"]').exists()).toBe(true)
  })

  it('shows association and season items when user is league rep', () => {
    const wrapper = mount(NavMaintenance, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          initialState: {
            user: {
              user: {
                userRoles: ['League Rep'],
              },
            },
          },
        })],
      },
    })

    expect(wrapper.find('[data-test="nav-item-association"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-season"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-venue"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-user"]').exists()).toBe(false)
  })

  it('shows only venue item when user is association rep', () => {
    const wrapper = mount(NavMaintenance, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
          initialState: {
            user: {
              user: {
                userRoles: ['Association Rep'],
              },
            },
          },
        })],
      },
    })

    expect(wrapper.find('[data-test="nav-item-association"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-season"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-venue"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-item-user"]').exists()).toBe(false)
  })

  it('shows no items when user has no roles', () => {
    const wrapper = mount(NavMaintenance, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
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

    expect(wrapper.find('[data-test="nav-item-association"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-season"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-venue"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="nav-item-user"]').exists()).toBe(false)
  })
})
