import { mount, flushPromises } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import AssociationSelect from '@/components/association/AssociationSelect.vue';
import { vuetify } from '@/vuetify-setup'
import { createTestingPinia } from '@pinia/testing'

global.ResizeObserver = require('resize-observer-polyfill')

const mockAssociations = [
  { id: 1, name: 'Main Association' },
  { id: 2, name: 'Secondary Association' }
]

vi.mock('@/services/api.association.js', () => ({
  fetchAssociations: vi.fn(),
  createAssociation: vi.fn(),
  deleteAssociation: vi.fn(),
  updateAssociation: vi.fn(),
}))
import * as api from '@/services/api.association.js'

describe('AssociationSelect.vue', () => {
  let wrapper
  beforeEach(async () => {
    api.fetchAssociations.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Spring',
        },
      ],
      error: null,
    })

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
