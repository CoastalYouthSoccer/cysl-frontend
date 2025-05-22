import TheCall from '@/views/TheCall.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

describe('TheCall.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TheCall, {
      global: {
        plugins: [
          vuetify
        ],
      }
    })
  })

  it('renders section headings', () => {
    expect(wrapper.text()).toContain("What's The Call?")
    expect(wrapper.text()).toContain("IFAB App Q&A")
  })

  it('expands a scenario panel and shows the expected answer', async () => {
    const panelTitles = wrapper.findAllComponents({ name: 'VExpansionPanelTitle' })

    const firstTitle = panelTitles[0]
    await firstTitle.trigger('click')

    const panelText = wrapper.findComponent({ name: 'VExpansionPanelText' })
    expect(panelText.text()).toContain("Earrings need to be removed")
  })

  it('shows IFAB panel result when clicked', async () => {
    const ifabTitle = wrapper
      .findAllComponents({ name: 'VExpansionPanelTitle' })
      .find(title => title.text().includes('Attacker is in an offside position'))

    expect(ifabTitle).toBeTruthy()

    await ifabTitle.trigger('click')

    const texts = wrapper.findAllComponents({ name: 'VExpansionPanelText' })
    const match = texts.find(text => text.text().includes('Penalty'))

    expect(match).toBeTruthy()
  })
})
