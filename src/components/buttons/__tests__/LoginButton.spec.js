import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import LoginButtonComponent from '@/components/buttons/LoginButton.vue'
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

describe('LoginButtonComponent', () => {
  let loginWithRedirectMock;
  let wrapper;
  let button;

  beforeEach(() => {
    loginWithRedirectMock = vi.fn();
    useAuth0.mockReturnValue({
      loginWithRedirect: loginWithRedirectMock
    });
    wrapper = mount(LoginButtonComponent, {
      props: {},
      global: {
        plugins: [vuetify],
      }
    });
    wrapper.vm.$nextTick();
    button = wrapper.find('button[data-test="login-btn"]');
  });

  test('renders v-btn and v-tooltip correctly', () => {
    expect(button.exists()).toBe(true);

    const tooltip = wrapper.findComponent({ name: 'v-tooltip' });
    expect(tooltip.exists()).toBe(true);
  });

  test('calls loginWithRedirect on button click', async () => {
    const button = wrapper.find('button[data-test="login-btn"]');
    await button.trigger('click');

    expect(loginWithRedirectMock).toHaveBeenCalled();
  });
});
