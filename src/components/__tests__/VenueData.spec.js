import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import VenueData from '@/components/venue/VenueData.vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { vuetify } from '@/vuetify-setup'
import { VDateInput } from 'vuetify/components'

vi.mock('@/services/api.venue.js', () => ({
  fetchVenues: vi.fn(),
  createVenue: vi.fn(),
  deleteVenue: vi.fn(),
  updateVenue: vi.fn(),
}))
import * as api from '@/services/api.venue.js'

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn(() => Promise.resolve('mock-token')),
  }),
}))

describe('VenueData.vue', () => {
  let wrapper

  beforeEach(async () => {
    api.fetchVenues.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Spring',
          start_dt: '2025-03-01',
          venue_length: 90,
          holiday_dates: [],
        },
      ],
      error: null,
    })

    wrapper = mount(VenueData, {
      global: {
        stubs: ['v-icon', 'v-date-picker', 'v-number-input'],
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
    expect(wrapper.text()).toContain('Spring')
  })

  it('adds a new venue via createVenue', async () => {
    const newVenue = {
      id: 2,
      name: 'Summer',
      start_dt: '2025-06-01',
      venue_length: 90,
      holiday_dates: [],
    }

    api.createVenue.mockResolvedValue({ data: newVenue, error: null })

    // Open Add dialog
    const addBtn = wrapper.findComponent('[data-testid="add-venue-btn"]')
    await addBtn.trigger('click')

    const nameInput = wrapper.findComponent('[data-testid="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue('Summer')
    expect(wrapper.vm.record.name).toBe('Summer')

    // Save
    const saveBtn = wrapper.findComponent('[data-testid="modify-save-btn"]')
    await saveBtn.trigger('click')

    await flushPromises()

    expect(api.createVenue).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Summer')
  })

  it('edits existing venue when isEditing = true', async () => {
    const venue = {
      id: 2,
      name: 'Spring',
      start_dt: '2025-06-01',
      venue_length: 90,
      holiday_dates: [],
    }
    // Simulate existing venue
    api.updateVenue.mockResolvedValue({
      data: { ...venue, name: 'Spring Updated' },
      error: null,
    })

    wrapper.vm.venues.push(venue)
    await wrapper.vm.$nextTick()

    wrapper.vm.isEditing = true
    wrapper.vm.record = { ...wrapper.vm.venues[0] }
    wrapper.vm.modifyDialog = true
    await wrapper.vm.$nextTick()

    const nameInput = wrapper.findComponent('[data-testid="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue('Spring Updated')

    const saveBtn = wrapper.findComponent('[data-testid="modify-save-btn"]')
    await saveBtn.trigger('click')

    wrapper.vm.venues[0] = { ...wrapper.vm.record }
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.venues[0].name).toBe('Spring Updated')
  })

  it('deletes a venue via deleteVenue', async () => {
    api.deleteVenue.mockResolvedValue({ data: null, error: { message: null } })

    // Trigger delete icon (first delete button)
    const deleteIcon = wrapper.findComponent('[data-testid="delete-venue-btn"]')
    await deleteIcon.trigger('click')

    // Confirm delete in dialog
    const confirmBtn = wrapper.findComponent('[data-testid="delete-delete-btn"]')
    expect(confirmBtn.exists()).toBe(true)
    await confirmBtn.trigger('click')

    await flushPromises()

    expect(api.deleteVenue).toHaveBeenCalledWith(1, 'mock-token')
    expect(wrapper.text()).not.toContain('Spring')
  })
})
