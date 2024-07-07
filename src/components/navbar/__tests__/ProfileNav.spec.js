import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ProfileNav from '../ProfileNav.vue'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    user: ref({ name: 'John Doe', given_name: 'John', family_name: 'Doe' }),
    logout: vi.fn()
  })
}))

describe('ProfileNav', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(ProfileNav, {
      props: {},
      global: {
        plugins: [vuetify],
      }
    });
    await wrapper.vm.$nextTick(); // Wait for Vue to render
  });

  it('renders the button and menu', () => {
    const button = wrapper.findComponent('[data-test="profile-btn"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('John Doe')

    const menu = wrapper.findComponent({ name: 'v-menu' })
    expect(menu.exists()).toBe(true)
  })

//  it('renders the menu items correctly', () => {
//    const listItems = wrapper.findAllComponents('[data-test="list-item"]')
//    expect(listItems.length).toBe(1)
//    expect(listItems[0].text()).toBe('Profile')
//  })

//  it('calls logout function on clicking logout', async () => {
//    const { logout } = useAuth0()
//    const logoutItem = wrapper.findAllComponents('[ata-test="list-item"]').at(1)
//    await logoutItem.trigger('click')

//    expect(logout).toHaveBeenCalled()
//  })

//  it('opens the menu on hover', async () => {
//    const button = wrapper.findComponent({ name: '#profile-activator' })
//    await button.trigger('mouseenter')

//    const menu = wrapper.findComponent({ name: 'v-menu' })
//    expect(menu.vm.isActive).toBe(true)
//  })
})
