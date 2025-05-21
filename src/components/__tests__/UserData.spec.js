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

const mockRoles = [
  { id: '1', name: 'Admin', description: 'Full access' },
  { id: '2', name: 'Editor', description: 'Can edit content' }
]

vi.mock('@/services/api.user.js', () => ({
  fetchUsers: vi.fn(),
  fetchRoles: vi.fn(),
  deleteUser: vi.fn(),
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

//  it('edits existing user when isEditing = true', async () => {
//    // Simulate existing user
//    api.updateUser.mockResolvedValue({
//      data: { ...user, name: 'User Updated' },
//      error: null,
//    })
//
//    console.log(wrapper.html())
//
//    wrapper.vm.users.push(user)
//    await wrapper.vm.$nextTick()
//
//    wrapper.vm.isEditing = true
//    wrapper.vm.record = { ...wrapper.vm.users[0] }
//    wrapper.vm.modifyDialog = true
//    await wrapper.vm.$nextTick()
//
//    const nameInput = wrapper.findAllComponents('[data-test="input-name"]')
//    expect(nameInput.exists()).toBe(true)
//    await nameInput.setValue('User Updated')
//
//    const saveBtn = wrapper.findComponent('[data-test="modify-save-btn"]')
//    await saveBtn.trigger('click')
//
//    wrapper.vm.users[0] = { ...wrapper.vm.record }
//    await wrapper.vm.$nextTick()
//
//    expect(wrapper.vm.users[0].name).toBe('User Updated')
//  })
})
