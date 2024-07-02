import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import { flushPromises, mount } from '@vue/test-utils'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Navigation from '@/components/navbar/Navigation.vue'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    isAuthenticated: ref(false),
    user: ref(null),
    logout: vi.fn(),
    loginWithRedirect: vi.fn(),
  }),
}));

describe('Navigation', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount({
      template: '<v-layout><Navigation/></v-layout>'
    }, {
      props: {},
      global: {
        plugins: [vuetify],
        components: {
          Navigation,
        }
      }
    });
    wrapper.vm.$nextTick();
  });

  test('renders the button and app bar', () => {
    const button = wrapper.findComponent('.v-btn')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('CYSL Referee Resources')

    const appBar = wrapper.findComponent({ name: 'v-app-bar' })
    expect(appBar.exists()).toBe(true)
  })

//  test('renders LoginButton when not authenticated', () => {
//    vi.spyOn(auth0, 'useAuth0').mockReturnValue({
//      isAuthenticated: false,
//      isLoading: false,
//    });
//    const loginButton = wrapper.findComponent({ name: 'LoginButton' })
//    expect(loginButton.exists()).toBe(true)
//  })
//
//  test('renders ProfileNav when authenticated', async () => {
//    vi.spyOn(auth0, 'useAuth0').mockReturnValue({
//      isAuthenticated: true,
//      isLoading: false
//    });
//
//    const  wrapper = mount(Navigation, {
//      props: {},
//      global: {
//        plugins: [vuetify],
//      }
//    });
//    await wrapper.vm.$nextTick();
//
//    const profileNav = wrapper.findComponent({ name: 'ProfileNav' })
//    expect(profileNav.exists()).toBe(true)
//  })

//  test('renders AssignorNav when user is an assignor', async () => {
//    const { user } = useAuth0()
//    user.value = { user_roles: ['assignor'] }
//
//    const  wrapper = mount(Navigation, {
//      props: {},
//      global: {
//        plugins: [vuetify],
//      }
//    });
//    await wrapper.vm.$nextTick();
//    // Check if AssignorNav is rendered
//    const assignorNav = wrapper.findComponent({ name: 'AssignorNav' })
//    expect(assignorNav.exists()).toBe(true)
//  })
//
//  test('does not render AssignorNav when user is not an assignor', async () => {
//    const { user } = useAuth0()
//    user.value = { user_roles: [] }
//
//    // Check if AssignorNav is not rendered
//    const assignorNav = wrapper.findComponent({ name: 'AssignorNav' })
//    expect(assignorNav.exists()).toBe(false)
//  })
});
