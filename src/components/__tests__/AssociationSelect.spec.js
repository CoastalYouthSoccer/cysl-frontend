import { mount, flushPromises } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import AssociationSelect from '@/components/association/AssociationSelect.vue';
import Alert from '@/components/Alert.vue'
import { vuetify } from '@/vuetify-setup'
import { createTestingPinia } from '@pinia/testing'

global.ResizeObserver = require('resize-observer-polyfill')

const mockAssociations = [
  { id: 1, name: 'Main Association' },
  { id: 2, name: 'Secondary Association' }
]

describe('AssociationSelect.vue', () => {
  let wrapper
  beforeEach(async () => {
    wrapper = mount(AssociationSelect, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
              share: {
                associations: mockAssociations
              }
            }
          }),
          vuetify
        ],
    },
  })

    await flushPromises()
  })

  it('renders v-select with association options from API', async () => {
    const select = wrapper.findComponent('[data-test="association-select"]')
    expect(select.exists()).toBe(true)
    expect(select.props('items')).toEqual(mockAssociations)
  })

  it('emits associationChange on selection', async () => {
    wrapper.vm.association = mockAssociations[1]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().associationChange).toBeTruthy()
    expect(wrapper.emitted().associationChange[0]).toEqual([mockAssociations[1]])
  })
})
