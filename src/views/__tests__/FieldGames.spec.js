import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { vuetify } from '@/vuetify-setup'
import FieldGames from '@/views/FieldGames.vue'
import { createTestingPinia } from '@pinia/testing'

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@/components/venue/VenueSelect.vue', () => ({
  default: {
    name: 'VenueSelect',
    template: '<div data-test="venue-select-mock" />'
  }
}))

// Mock Auth0
vi.mock("@auth0/auth0-vue", () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token')
  }),
}));

vi.mock('@/services/api.game.js', () => ({
  fetchAssignrGames: vi.fn().mockResolvedValue({
    data: {
      "Field 1": {
        "10:00 AM": {
          officials: [
            { accepted: true, first_name: "Homer", last_name: "Simpson" },
            { accepted: false, first_name: "Bart", last_name: "Simpson" }
          ],
          home_team: "Team A",
          away_team: "Team B",
          age_group: "U10",
          gender: "Boys",
          report: {
            author: "Homer",
            misconducts: true,
            ejections: false,
            no_show: false,
            home_score: 2,
            away_score: 1
          }
        }
      }
    },
    error: {}
  })
}))

describe('FieldGames.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(FieldGames, {
      global: {
        stubs: ['v-progress-circular', 'v-sheet', 'v-dialog', 'v-divider', 'v-checkbox'],
        plugins: [
          vuetify,
          createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              user: {
                permissions: ['read:games'],
              },
            },
          },
        })],
      }
    })
  })

  it('renders the page title', () => {
    expect(wrapper.text()).toContain('Field Coordinator Screen')
  })

  it('shows error if date is missing on submit', async () => {
    const submitBtn = wrapper.findComponent('[data-test="submit-btn"]')
    await submitBtn.trigger('click')
    await flushPromises()
    await wrapper.vm.$nextTick()

    const alert = wrapper.findComponent({ name: 'Alert' })
    expect(alert.exists()).toBe(true)
    expect(alert.props('msg')).toBe('Date must be provided')
  })

  it('shows error if venue is missing on submit', async () => {
    wrapper.vm.gameDate = 'Fri May 30 2025 00:00:00 GMT-0400 (Eastern Daylight Time)'
    const submitBtn = wrapper.findComponent('[data-test="submit-btn"]')
    await submitBtn.trigger('click')
    await flushPromises()
    await wrapper.vm.$nextTick()

    const alert = wrapper.findComponent({ name: 'Alert' })
    expect(alert.exists()).toBe(true)
    expect(alert.props('msg')).toBe('Venue must be provided')
  })

  it('renders Header', async() => {
    wrapper.vm.venue = 'Test Venue'
    wrapper.vm.gameDate = 'Fri May 30 2025 00:00:00 GMT-0400 (Eastern Daylight Time)'
    wrapper.vm.games = {
        "Field 1": {
          "10:00 AM": {
              "officials": [
                  {
                      "accepted": true,
                      "position": "Referee",
                      "first_name": "Homer",
                      "last_name": "Simpson"
                  },
                  {
                      "accepted": true,
                      "position": "Asst. Referee",
                      "first_name": "Marge",
                      "last_name": "Simpson"
                  },
                  {
                      "accepted": false,
                      "position": "Asst. Referee",
                      "first_name": "Bart",
                      "last_name": "Simpson"
                  }
              ],
              "home_team": "Springfield-1",
              "away_team": "Springfield-2",
              "age_group": "U12",
              "gender": "Boys",
              "report": {
                  "author": "Homer Simpson",
                  "misconducts": true,
                  "ejections": false,
                  "no_show": false,
                  "home_score": 0,
                  "away_score": 2
              }
          }
        }
      }
    const submitBtn = wrapper.findComponent('[data-test="submit-btn"]')
    await submitBtn.trigger('click')
    await flushPromises()
    const header = wrapper.get('[data-test="header"]')
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain('Test Venue - 05/30/2025')
  })

  it('displays loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true

    await wrapper.vm.$nextTick()

    const loadingDiv = wrapper.find('[data-test="game-loading"]')
    expect(loadingDiv.exists()).toBe(true)
    expect(wrapper.find('v-progress-circular-stub').exists()).toBe(true)
  })
//  it('displays game data table and chips', async () => {
//    wrapper.vm.venue = 'Test Venue'
//    wrapper.vm.gameDate = '2025-06-01'
//
//    await wrapper.find('[data-test="submit-btn"]').trigger('click')
//    await flushPromises()
//
//    expect(wrapper.html()).toContain('Springfield-1')
//    expect(wrapper.html()).toContain('Springfield-2')
//    expect(wrapper.html()).toContain('10:00 AM')
//    expect(wrapper.findAll('td')).toHaveLength(8) // 8 columns in one row
//    expect(wrapper.findAll('v-chip-stub')).toHaveLength(2) // 2 referees
//  })

//  it('opens and displays dialog with report data', async () => {
//    wrapper.vm.viewReport({
//      author: "Homer",
//      misconducts: true,
//      ejections: false,
//      no_show: true
//    })
//    await wrapper.vm.$nextTick()

//   expect(wrapper.get('[data-test="input-author"]').element.value).toBe('Homer')
//   expect(wrapper.get('[data-test="box-misconducts"]').element.checked).toBe(true)
//   expect(wrapper.get('[data-test="box-ejections"]').element.checked).toBe(false)
//   expect(wrapper.get('[data-test="box-no-show"]').element.checked).toBe(true)
// })

//  it('closes dialog on close button click', async () => {
//    wrapper.vm.viewDialog = true
//    await wrapper.vm.$nextTick()
//
//    await wrapper.get('[data-test="close-btn"]').trigger('click')
//    expect(wrapper.vm.viewDialog).toBe(false)
//  })
})
