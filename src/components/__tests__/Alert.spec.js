import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@/vuetify-setup'
import Alert from '@/components/Alert.vue'

global.ResizeObserver = require('resize-observer-polyfill')

describe('Alert', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Alert, {
      props: {
        msg: 'Test message',
        color: 'primary'
      },
      global: {
        plugins: [vuetify],
      }
    });
    wrapper.vm.$nextTick();
  });


  it('closes the alert when close button is clicked', async () => {
    expect(wrapper.vm.snackbar).toBe(true);

    const button = wrapper.findComponent('[data-test="alert-btn"]');
    await button.trigger('click');

    expect(wrapper.vm.snackbar).toBe(false);
  });
});
