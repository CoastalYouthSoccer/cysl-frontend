import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import UserData from '@/components/user/UserData.vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { vuetify } from '@/vuetify-setup'
import * as api from '@/services/api.user.js'

global.ResizeObserver = require('resize-observer-polyfill')

const mockUsers = [
  {
    id: 1,
    name: 'User 1',
    roles: [{
      name: 'Referee',
      id: 1,
      description: 'Referee'
    }, {
      name: 'Coach',
      id: 2,
      description: 'Coach'
    }, {
      name: 'Assignor',
      id: 3,
      description: 'Assignor'
    }],
    associations: ['Test Association']
  }
]

const mockUpdatedUser = {
  id: 1,
  name: 'Updated User',
  roles: [{
    name: 'Referee',
    id: 1,
    description: 'Referee'
  }, {
    name: 'Coach',
    id: 2,
    description: 'Coach'
  }, {
    name: 'Assignor',
    id: 3,
    description: 'Assignor'
  }],
  associations: ['Test Association']
}

const mockRoles = [
  { id: '1', name: 'Admin', description: 'Full access' },
  { id: '2', name: 'Editor', description: 'Can edit content' }
]

vi.mock('@/services/api.user.js', () => ({
  fetchUsers: vi.fn(),
  fetchRoles: vi.fn(),
  updateUser: vi.fn(),
}))

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn(() => Promise.resolve('mock-token')),
  }),
}))

describe('UserData.vue', () => {
  let wrapper

  beforeEach(async () => {
    api.fetchUsers.mockResolvedValue({
      data: mockUsers,
      error: null,
    })
    api.fetchRoles.mockResolvedValue({
      data: mockRoles,
      error: null,
    })
    api.updateUser.mockResolvedValue({
      data: mockUsers[0],
      error: null,
    })
    wrapper = mount(UserData, {
      global: {
        stubs: ['v-icon', 'v-number-input'],
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
              share: {
                roles: mockRoles
              },
              user: {
                user: {
                  permissions: ['write:users'],
                  userRoles: [],
                  userAssociations: []
                }
              }
            }
          })
        ],
      },
    })

    await flushPromises()
  })

  it('displays initial user from API', () => {
    expect(wrapper.text()).toContain('User 1')
  })

  it('shows loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true
    await flushPromises()
    expect(wrapper.find('[data-test="userData-loading"]').exists()).toBe(true)
  })

  it('renders Alert when errorMessage is present', async () => {
    wrapper.vm.errorMessage = 'Fetch failed'
    await flushPromises()
    const alert = wrapper.find('[data-test="userData-alert"]')
    expect(alert.exists()).toBe(true)
  })

  it('renders data table when loading is false', async () => {
    wrapper.vm.isLoading = false
    wrapper.vm.users = [{ id: '1', name: 'John', roles: [], associations: [] }]
    await flushPromises()
    const sheet = wrapper.findComponent('[data-test="userData-table"]')
    expect(sheet.exists()).toBe(true)
  })

//  it('calls update function when save button is clicked', async () => {
//    const saveBtn = wrapper.find('[data-test="save-user-btn"]')
//    expect(saveBtn.exists()).toBe(true)

//    await saveBtn.trigger('click')

//    expect(wrapper.html()).toContain('Updated User')
//  })
})
