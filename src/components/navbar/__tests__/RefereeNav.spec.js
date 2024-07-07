import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import RefereeNav from '../RefereeNav.vue'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

describe('RefereeNav', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(RefereeNav, {
      props: {},
      global: {
        plugins: [vuetify],
      }
    });
    await wrapper.vm.$nextTick(); // Wait for Vue to render
  });

  it('renders the button and menu', () => {
    const button = wrapper.findComponent('[data-test="referee-btn"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Referee')

//    const menu = wrapper.findComponent('[data-test="assignor-activator"]')
//    expect(menu.exists()).toBe(true)

//    const listItems = wrapper.findAllComponents('.v-list-item')
//    expect(listItems.length).toBe(3)

//    const listItemTitles = listItems.map(item => item.findComponent({ name: 'v-list-item-title' }).text())
//    expect(listItemTitles).toEqual([
//      'Assignr Documentation',
//      'CYSL 2024 Spring Rules',
//      'Field Coordinator'
//    ])
  })

//  it('opens the menu on hover', async () => {
    // Trigger hover on the button
//    const button = wrapper.findComponent('[data-test="assignor-activator"]')
//    await button.trigger('mouseenter')

    // Check if the menu is open
//    const menu = wrapper.findComponent('.v-menu')
//    expect(menu.props().value).toBe(true)
//  })
})
