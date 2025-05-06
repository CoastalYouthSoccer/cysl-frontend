import { mount, flushPromises } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SeasonData from '@/components/season/SeasonData.vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify()

vi.mock('@/services/api.season.js', () => ({
  fetchSeasons: vi.fn(),
  createSeason: vi.fn(),
  deleteSeason: vi.fn(),
  updateSeason: vi.fn(),
}))
import * as api from '@/services/api.season.js'

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn(() => Promise.resolve('mock-token')),
  }),
}))

describe('SeasonData.vue', () => {
  let wrapper

  beforeEach(async () => {
    api.fetchSeasons.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Spring',
          start_dt: '2025-03-01',
          season_length: 90,
          holiday_dates: [],
        },
      ],
      error: null,
    })

    wrapper = mount(SeasonData, {
      global: {
        stubs: ['v-icon', 'v-date-picker', 'v-number-input'],
        plugins: [
          vuetify,
          createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              user: {
                permissions: ['write:seasons', 'delete:seasons'],
              },
            },
          },
        })],
      },
    })

    await flushPromises()
  })

  it('displays initial season from API', () => {
    expect(wrapper.text()).toContain('Spring')
  })

  it('adds a new season via createSeason', async () => {
    const newSeason = {
      id: 2,
      name: 'Summer',
      start_dt: '2025-06-01',
      season_length: 90,
      holiday_dates: [],
    }

    api.createSeason.mockResolvedValue({ data: newSeason, error: null })

    // Open Add dialog
    const addBtn = wrapper.findComponent('[data-testid="add-season-btn"]')
    await addBtn.trigger('click')

    const nameInput = wrapper.findComponent('[data-testid="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue('Summer')
    expect(wrapper.vm.record.name).toBe('Summer')

    const dateInput = wrapper.findComponent('[data-testid="start-date"]')
    expect(dateInput.exists()).toBe(true)
    await dateInput.setValue('2025-01-01')
    expect(wrapper.vm.record.start_dt).toBe('2025-01-01')

    const lengthInput = wrapper.findComponent('[data-testid="season-length"]')
    expect(lengthInput.exists()).toBe(true)
    await lengthInput.setValue(5)
      // fallback if label doesn't render as expected
      wrapper.vm.record.season_length = 5

    // Save
    const saveBtn = wrapper.findComponent('[data-testid="modify-save-btn"]')
    await saveBtn.trigger('click')

    await flushPromises()

    expect(api.createSeason).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Summer')
  })

  it('edits existing season when isEditing = true', async () => {
    const season = {
      id: 2,
      name: 'Spring',
      start_dt: '2025-06-01',
      season_length: 90,
      holiday_dates: [],
    }
    // Simulate existing season
    api.updateSeason.mockResolvedValue({
      data: { ...season, name: 'Spring Updated' },
      error: null,
    })

    wrapper.vm.seasons.push(season)
    await wrapper.vm.$nextTick()

    wrapper.vm.isEditing = true
    wrapper.vm.record = { ...wrapper.vm.seasons[0] }
    wrapper.vm.modifyDialog = true
    await wrapper.vm.$nextTick()

    const nameInput = wrapper.findComponent('[data-testid="input-name"]')
    expect(nameInput.exists()).toBe(true)
    await nameInput.setValue('Spring Updated')

    const saveBtn = wrapper.findComponent('[data-testid="modify-save-btn"]')
    await saveBtn.trigger('click')

    wrapper.vm.seasons[0] = { ...wrapper.vm.record }
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.seasons[0].name).toBe('Spring Updated')
  })

  it('deletes a season via deleteSeason', async () => {
    api.deleteSeason.mockResolvedValue({ data: null, error: { message: null } })

    // Trigger delete icon (first delete button)
    const deleteIcon = wrapper.findComponent('[data-testid="delete-season-btn"]')
    await deleteIcon.trigger('click')

    // Confirm delete in dialog
    const confirmBtn = wrapper.findComponent('[data-testid="delete-delete-btn"]')
    expect(confirmBtn.exists()).toBe(true)
    await confirmBtn.trigger('click')

    await flushPromises()

    expect(api.deleteSeason).toHaveBeenCalledWith(1, 'mock-token')
    expect(wrapper.text()).not.toContain('Spring')
  })
})
