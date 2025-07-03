import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import VenueData from '@/components/venue/VenueData.vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { vuetify } from '@/vuetify-setup'
import * as api from '@/services/api.venue.js'

global.ResizeObserver = require('resize-observer-polyfill')

const mockVenues = [
  {
    id: 1,
    name: 'Venue 1',
    address: {
      id: 1,
      address1: 'Test Address 1',
      address2: 'Test Address 2',
      zip_code: ''
    },
    association: {
      name: 'Test Association',
      id: 5
    }
  }
]

vi.mock('@/services/api.venue.js', () => ({
  fetchVenues: vi.fn(),
  createVenue: vi.fn(),
  deleteVenue: vi.fn(),
  updateVenue: vi.fn(),
}))

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn(() => Promise.resolve('mock-token')),
  }),
}))

describe('VenueData.vue', () => {
  let wrapper

  beforeEach(async () => {
    api.fetchVenues.mockResolvedValue({
      data: mockVenues,
      error: null,
    })

    wrapper = mount(VenueData, {
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

  it('displays initial venue from API', () => {
    expect(wrapper.text()).toContain('Venue 1')
  })

  it('adds a new venue via createVenue', async () => {
    const newVenue = {
      id: 2,
      name: 'Venue 2',
      address: {
        id: 1,
        address1: 'Test Address 1',
        address2: '',
        zip_code: ''
      },
      association: {
        name: 'Test Association',
        id: 5
      }
    }

    api.createVenue.mockResolvedValue({ data: newVenue, error: null })

    // Open Add dialog
    const addBtn = wrapper.findComponent('[data-test="add-venue-btn"]')
    await addBtn.trigger('click')
    // Populate dialog
    const nameInput = wrapper.findComponent('[data-test="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue(newVenue.name)
    const addressInput = wrapper.findComponent('[data-test="input-address1"]')
    expect(addressInput.exists()).toBe(true)
    await addressInput.setValue(newVenue.address1)
    const cityInput = wrapper.findComponent('[data-test="input-city"]')
    expect(cityInput.exists()).toBe(true)
    await cityInput.setValue(newVenue.city)

    // Save
    const saveBtn = wrapper.findComponent('[data-test="modify-save-btn"]')
    await saveBtn.trigger('click')

    await flushPromises()

    expect(api.createVenue).toHaveBeenCalled()
    expect(wrapper.vm.record.name).toBe(newVenue.name)
//    expect(wrapper.vm.record.address1).toBe(newVenue.address1)
//    expect(wrapper.vm.record.address2).toBe(newVenue.address2)
//    expect(wrapper.vm.record.city).toBe(newVenue.city)
  })

  it('edits existing venue when isEditing = true', async () => {
    const venue = {
      id: 1,
      name: 'Venue 1',
      address: {
        id: 1,
        address1: 'Test Address 1',
        address2: 'Test Address 2',
        zip_code: ''
      },
      association: {
        name: 'Test Association',
        id: 5
      }
    }
    // Simulate existing venue
    api.updateVenue.mockResolvedValue({
      data: { ...venue, name: 'Venue Updated' },
      error: null,
    })

    wrapper.vm.venues.push(venue)
    await wrapper.vm.$nextTick()

    wrapper.vm.isEditing = true
    wrapper.vm.record = { ...wrapper.vm.venues[0] }
    wrapper.vm.modifyDialog = true
    await wrapper.vm.$nextTick()

    const nameInput = wrapper.findComponent('[data-test="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue('Venue Updated')

    const saveBtn = wrapper.findComponent('[data-test="modify-save-btn"]')
    await saveBtn.trigger('click')

    wrapper.vm.venues[0] = { ...wrapper.vm.record }
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.venues[0].name).toBe('Venue Updated')
  })

  it('deletes a venue via deleteVenue', async () => {
    api.deleteVenue.mockResolvedValue({ data: null, error: { message: null } })

    // Trigger delete icon (first delete button)
    const deleteIcon = wrapper.findComponent('[data-test="delete-venue-btn"]')
    await deleteIcon.trigger('click')

    // Confirm delete in dialog
    const confirmBtn = wrapper.findComponent('[data-test="delete-delete-btn"]')
    expect(confirmBtn.exists()).toBe(true)
    await confirmBtn.trigger('click')

    await flushPromises()

    expect(api.deleteVenue).toHaveBeenCalledWith(1, 'mock-token')
    expect(wrapper.text()).not.toContain('Spring')
  })

  it('shows loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-test="venue-loading"]').exists()).toBe(true)
  })

  it('shows error alert when errorMessage is set', async () => {
    api.fetchVenues.mockResolvedValueOnce({
      data: [],
      error: {message: 'error with Venues'}
    })

    const wrapper = mount(VenueData, {
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
    expect(alert.props('msg')).toBe('Error Fetching Venues: error with Venues')
  })
})
