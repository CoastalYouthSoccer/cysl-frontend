import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@/vuetify-setup'
import AssignrAssignor from '@/views/AssignrAssignor.vue'

vi.mock('vue-pdf-embed', () => ({
  default: {
    name: 'VuePdfEmbed',
    template: '<div data-test="pdf-viewer" />',
    props: ['source']
  }
}))

vi.mock('@/assets/assignr/assignor.pdf', () => ({
  default: 'mock-pdf-url.pdf'
}))

describe('AssignrAssignor', () => {
  it('renders PDF viewer with correct source', () => {
    const wrapper = mount(AssignrAssignor,
      {
        global: {
          plugins: [vuetify]
        }
    })

    // Assert that the heading renders
    expect(wrapper.text()).toContain('Assignr')

    // Assert that the PDF viewer is rendered
    const pdfViewer = wrapper.get('[data-test="pdf-viewer"]')
    expect(pdfViewer.exists()).toBe(true)

    // Optional: check props passed to stub
    const pdfProps = wrapper.findComponent({ name: 'VuePdfEmbed' }).props()
    expect(pdfProps.source).toBe('mock-pdf-url.pdf')
  })
})
