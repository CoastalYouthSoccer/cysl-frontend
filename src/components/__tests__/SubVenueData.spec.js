import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SubVenueData from '@/components/venue/SubVenueData.vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { vuetify } from '@/vuetify-setup'
import * as api from '@/services/api.subvenue.js'

global.ResizeObserver = require('resize-observer-polyfill')

const mockSubVenues = [
  {
    id: 1,
    name: 'SubVenue 1'
  }
]

vi.mock('@/services/api.subvenue.js', () => ({
  fetchSubVenues: vi.fn(),
  createSubVenue: vi.fn(),
  deleteSubVenue: vi.fn(),
  updateSubVenue: vi.fn(),
}))

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn(() => Promise.resolve('mock-token')),
  }),
}))

describe('SubVenueData.vue', () => {
  let wrapper

  beforeEach(async () => {
    api.fetchSubVenues.mockResolvedValue({
      data: mockSubVenues,
      error: null,
    })

    wrapper = mount(SubVenueData, {
      global: {
        stubs: ['v-icon', 'v-number-input'],
        plugins: [
          vuetify,
          createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              user: {
                permissions: ['write:venues', 'delete:venues'],
              },
            },
          },
        })],
      },
    })

    await flushPromises()
  })

  it('displays initial SubVenue from API', async () => {
    expect(wrapper.text()).toContain('SubVenue 1')
  })

  it('adds a new SubVenue via createSubVenue', async () => {
    const newSubVenue = {name: 'SubVenue 2'}
    api.createSubVenue.mockResolvedValue({ data: newSubVenue, error: null })

    const addBtn = wrapper.findComponent('[data-test="add-subVenue-btn"]')
    await addBtn.trigger('click')
    const nameInput = wrapper.findComponent('[data-test="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue(newSubVenue.name)

    const saveBtn = wrapper.findComponent('[data-test="modify-save-btn"]')
    await saveBtn.trigger('click')

    await flushPromises()

    expect(api.createSubVenue).toHaveBeenCalled()
    expect(wrapper.vm.record.name).toBe(newSubVenue.name)
  })

  it('edits existing SubVenue when isEditing = true', async () => {
    const SubVenue = {
      id: 1,
      name: 'SubVenue 1'
    }
    // Simulate existing SubVenue
    api.updateSubVenue.mockResolvedValue({
      data: { ...SubVenue, name: 'SubVenue Updated' },
      error: null,
    })

    wrapper.vm.subVenues.push(SubVenue)
    await wrapper.vm.$nextTick()

    wrapper.vm.isEditing = true
    wrapper.vm.record = { ...wrapper.vm.subVenues[0] }
    wrapper.vm.modifyDialog = true
    await wrapper.vm.$nextTick()

    const nameInput = wrapper.findComponent('[data-test="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue('SubVenue Updated')

    const saveBtn = wrapper.findComponent('[data-test="modify-save-btn"]')
    await saveBtn.trigger('click')

    wrapper.vm.subVenues[0] = { ...wrapper.vm.record }
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.subVenues[0].name).toBe('SubVenue Updated')
  })

  it('deletes a SubVenue via deleteSubVenue', async () => {
    api.deleteSubVenue.mockResolvedValue({ data: null, error: { message: null } })

    const deleteIcon = wrapper.findComponent('[data-test="delete-subVenue-btn"]')
    await deleteIcon.trigger('click')

    expect(wrapper.findComponent('[data-test="delete-cancel-btn"]').exists()).toBe(true)
    const confirmBtn = wrapper.findComponent('[data-test="delete-delete-btn"]')
    expect(confirmBtn.exists()).toBe(true)
    await confirmBtn.trigger('click')

    await flushPromises()

    expect(api.deleteSubVenue).toHaveBeenCalledWith(1, 'mock-token')
  })

  it('shows loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-test="subVenues-loading"]').exists()).toBe(true)
  })

  it('shows error alert when errorMessage is set', async () => {
    api.fetchSubVenues.mockResolvedValueOnce({
      data: [],
      error: {message: 'error with subVenues'}
    })

    const wrapper = mount(SubVenueData, {
      global: {
        stubs: ['v-progress-circular', 'v-select', 'v-dialog', 'v-divider', 'v-checkbox'],
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                user: {
                  permissions: ['read:venues'],
                },
              },
            }
          })
        ],
      }
    })

    await flushPromises()

    const alert = wrapper.findComponent({ name: 'Alert' })
    expect(alert.exists()).toBe(true)
    expect(alert.props('msg')).toBe('Error fetching subVenues: error with subVenues')
  })

  it('renders the data table when isLoading is false', () => {
    expect(wrapper.findComponent({ name: 'VDataTable' }).exists()).toBe(true)
  })

  it('shows add button if allowEdit is true', () => {
    expect(wrapper.get('[data-test="add-subVenue-btn"]').exists()).toBe(true)
  })
})
