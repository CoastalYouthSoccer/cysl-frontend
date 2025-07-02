import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { VApp } from 'vuetify/components'

import vuetify from '@/plugins/vuetify'

global.ResizeObserver = require('resize-observer-polyfill')

describe('Vuetify Plugin Configuration', () => {
  it('should export a Vuetify instance', () => {
    expect(vuetify).toBeDefined()
    expect(typeof vuetify.install).toBe('function') // Vuetify plugin should have an install method
  })

  it('can mount a component using VDateInput', () => {
    const TestComponent = defineComponent({
      template: `<v-date-input label="Date" />`
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [vuetify]
      }
    })

    expect(wrapper.text()).toContain('Date')
  })

  it('applies the light theme class', () => {
    const TestComponent = defineComponent({
      render() {
        return h(VApp, null, 'Hello world')
      }
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [vuetify]
      },
      attachTo: document.body
    })

    expect(wrapper.element.className).toContain('v-theme--light')

    // Cleanup
    wrapper.unmount()
  })
})
