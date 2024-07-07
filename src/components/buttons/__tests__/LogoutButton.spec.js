import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import LogoutButton from './components/buttons/LogoutButton.vue'
import { useAuth0 } from "@auth0/auth0-vue"

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

// Mock the useAuth0 function
vi.mock("@auth0/auth0-vue", () => ({
  useAuth0: vi.fn()
}))

describe('LogoutButton', () => {
  let logoutMock;
  let wrapper;
  let button;

  beforeEach(() => {
    logoutMock = vi.fn();
    useAuth0.mockReturnValue({
      logout: logoutMock
    });
    wrapper = mount(LogoutButton, {
      props: {},
      global: {
        plugins: [vuetify],
      }
    });
    wrapper.vm.$nextTick();
    button = wrapper.findComponent('button[data-test="logout-btn"]')
  });

  it('renders v-btn correctly', () => {
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Log Out');
  });

  it('calls logout on button click', async () => {
    await button.trigger('click');

    // Check if logout was called with the correct parameters
    expect(logoutMock).toHaveBeenCalledWith({
      returnTo: window.location.origin,
    });
  });
});
