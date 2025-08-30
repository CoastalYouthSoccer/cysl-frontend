import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AssociationData from '@/components/association/AssociationData.vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@/services/api.association.js', () => ({
  fetchAssociations: vi.fn(),
  createAssociation: vi.fn(),
  deleteAssociation: vi.fn(),
  updateAssociation: vi.fn(),
}))
import * as api from '@/services/api.association.js'

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn(() => Promise.resolve('mock-token')),
  }),
}))

describe('AssociationData.vue', () => {
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

    wrapper = mount(AssociationData, {
      global: {
        stubs: ['v-icon', 'v-number-input'],
        plugins: [
          vuetify,
          createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              user: {
                permissions: ['write:associations', 'delete:associations'],
              },
            },
          },
        })],
      },
    })

    await flushPromises()
  })

  it('displays initial association from API', () => {
    expect(wrapper.text()).toContain('Spring')
  })

  it('adds a new association via createAssociation', async () => {
    const newAssociation = {
      id: 2,
      name: 'New Association',
    }

    api.createAssociation.mockResolvedValue({ data: newAssociation, error: null })

    // Open Add dialog
    const addBtn = wrapper.findComponent('[data-test="add-association-btn"]')
    await addBtn.trigger('click')

    const nameInput = wrapper.findComponent('[data-test="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue('New Association')
    expect(wrapper.vm.record.name).toBe('New Association')

    // Save
    const saveBtn = wrapper.findComponent('[data-test="modify-save-btn"]')
    await saveBtn.trigger('click')

    await flushPromises()

    expect(api.createAssociation).toHaveBeenCalled()
    expect(wrapper.text()).toContain('New Association')
  })

  it('edits existing association when isEditing = true', async () => {
    const association = {
      id: 2,
      name: 'Another Association',
    }
    // Simulate existing association
    api.updateAssociation.mockResolvedValue({
      data: { ...association, name: 'Another Association Updated' },
      error: null,
    })

    wrapper.vm.associations.push(association)
    await wrapper.vm.$nextTick()

    wrapper.vm.isEditing = true
    wrapper.vm.record = { ...wrapper.vm.associations[0] }
    wrapper.vm.modifyDialog = true
    await wrapper.vm.$nextTick()

    const nameInput = wrapper.findComponent('[data-test="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue('Another Association Updated')

    const saveBtn = wrapper.findComponent('[data-test="modify-save-btn"]')
    await saveBtn.trigger('click')

    wrapper.vm.associations[0] = { ...wrapper.vm.record }
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.associations[0].name).toBe('Another Association Updated')
  })

  it('deletes a association via deleteAssociation', async () => {
    api.deleteAssociation.mockResolvedValue({ data: null, error: { message: null } })

    // Trigger delete icon (first delete button)
    const deleteIcon = wrapper.findComponent('[data-test="delete-association-btn"]')
    await deleteIcon.trigger('click')

    // Confirm delete in dialog
    const confirmBtn = wrapper.findComponent('[data-test="delete-delete-btn"]')
    expect(confirmBtn.exists()).toBe(true)
    await confirmBtn.trigger('click')

    await flushPromises()

    expect(api.deleteAssociation).toHaveBeenCalledWith(1, 'mock-token')
    expect(wrapper.text()).not.toContain('Another Association')
  })

  it('shows loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-test="association-loading"]').exists()).toBe(true)
  })

  it('shows error alert when errorMessage is set', async () => {
    api.fetchAssociations.mockResolvedValueOnce({
      data: [],
      error: {message: 'error with Associations'}
    })

    const wrapper = mount(AssociationData, {
      global: {
        stubs: ['v-progress-circular', 'v-select', 'v-dialog', 'v-divider', 'v-checkbox'],
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                user: {
                  permissions: ['read:associations'],
                },
              },
            }
          })
        ],
      }
    })

    await flushPromises()

    const alert = wrapper.findComponent('[data-test="association-alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.props('text')).toBe('Error loading associations: error with Associations')
  })
})
