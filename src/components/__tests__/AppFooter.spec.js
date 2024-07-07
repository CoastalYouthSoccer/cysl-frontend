import { mount } from '@vue/test-utils'
import { expect, it, describe } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import AppFooter from './components/AppFooter.vue'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

describe("AppFooter", () =>{
  const wrapper = mount(AppFooter, {
    props: {},
    global: {
      plugins: [vuetify],
    }
  });
  it('displays message', () => {
    expect(wrapper.get('[data-test="copyright"]').text()).toContain('2024 — Hanover Soccer Referee')
  });

  it('display links', () => {
    expect(wrapper.findComponent('.v-btn').text()).toContain('Home')
  })
})
