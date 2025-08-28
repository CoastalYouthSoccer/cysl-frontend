import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

import App from '@/App.vue'

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    isLoading: ref(false),
    isAuthenticated: ref(true),
    user: ref({
      name: 'Test User',
      email: 'test@example.com'
    }),
    getAccessTokenSilently: vi.fn(() =>
      Promise.resolve([
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9', // header
        btoa(JSON.stringify({
          user_roles: ['admin'],
          permissions: ['read:data'],
          associations: ['A1']
        })), // payload
        'signature'
      ].join('.'))
    )
  })
}))

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    RouterView: {
      name: 'RouterView',
      template: '<div data-test="router-view">RouterView Content</div>'
    }
  }
})

vi.mock('@/components/sidebar/NavDrawer.vue', () => ({
  default: { template: '<div>NavDrawer</div>' }
}))
vi.mock('@/components/AppFooter.vue', () => ({
  default: { template: '<div>AppFooter</div>' }
}))
vi.mock('vue-router', () => ({
  RouterView: { template: '<div>RouterView</div>' }
}))

describe('App.vue layout', () => {
  let setUser, setUserRoles, setPermissions, setUserAssociations, clearUser, setAssociations, setRoles

  beforeEach(() => {
    setUser = vi.fn()
    setUserRoles = vi.fn()
    setPermissions = vi.fn()
    setUserAssociations = vi.fn()
    clearUser = vi.fn()
    setAssociations = vi.fn()
    setRoles = vi.fn()
  })

  const wrapper = mount(App, {
    global: {
      plugins: [
        vuetify,
        createTestingPinia({
          stubActions: false,
          createSpy: () => vi.fn(),
          initialState: {
            user: {
              setUser,
              setUserRoles,
              setPermissions,
              setUserAssociations,
              clearUser
            },
            sharedData: {
              setAssociations,
              setRoles
            }
          }
        })
      ]
    }
  })

  it('mounts and renders the layout structure', async () => {
    await flushPromises()
    expect(wrapper.html()).toContain('NavDrawer')
    expect(wrapper.html()).toContain('AppFooter')
  })
})
