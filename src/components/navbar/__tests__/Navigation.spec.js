import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Navigation from '@/components/navbar/Navigation.vue'
import * as auth0 from '@auth0/auth0-vue';

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@auth0/auth0-vue');

describe('Navigation', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount({
      template: '<v-layout><Navigation/></v-layout>'
    }, {
      props: {},
      global: {
        plugins: [vuetify],
        components: {
          Navigation,
        },
        stubs: ['router-link'],
      }
    });
//    wrapper.vm.$nextTick();
  });

  it('renders the button and app bar', async () => {
 //   const { isAuthenticated } = useAuth0();
 //   isAuthenticated.value = false;
    auth0.useAuth0 = vi.fn().mockReturnValue({
      isAuthenticated: false,
      isLoading: false
    })

//    expect(auth0.useAuth0).toHaveBeenCalled();
    const button = await wrapper.findComponent({ name: 'v-btn'} )
//    expect(button.exists()).toBe(true)
//    expect(button.text()).toBe('CYSL Referee Resources')

//    const appBar = wrapper.findComponent({ name: 'v-app-bar' })
//    expect(appBar.exists()).toBe(true)
  })

//  it('renders properly when not authenticated', () => {
//    const { isAuthenticated } = useAuth0();
//    isAuthenticated.value = false;

//    const loginButton = wrapper.findComponent({ name: 'LoginButton' })
//    expect(loginButton.exists()).toBe(true)

//    const profileNav = wrapper.findComponent({ name: 'ProfileNav' })
//    expect(profileNav.exists()).toBe(false)
//  })

//  it('renders ProfileNav when authenticated', async () => {
//    const { isAuthenticated } = useAuth0();
//    isAuthenticated.value = true;

//    const profileNav = await wrapper.findComponent({ name: 'ProfileNav' })
//    expect(profileNav.exists()).toBe(true)
//  })

//  it('renders AssignorNav when user is an assignor', async () => {
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
//  it('does not render AssignorNav when user is not an assignor', async () => {
//    const { user } = useAuth0()
//    user.value = { user_roles: [] }
//
//    // Check if AssignorNav is not rendered
//    const assignorNav = wrapper.findComponent({ name: 'AssignorNav' })
//    expect(assignorNav.exists()).toBe(false)
//  })
});
