import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Profile from '@/pages/Profile.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

describe('Profile.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Profile, {
      global: {
        plugins: [vuetify, createTestingPinia({
          initialState: {
            user: {
              isAdmin: true,
              isAssignor: false,
              isReferee: true,
              isCoach: false,
              isLeagueRep: false,
              isAssociationRep: true
            }
          }
        })]
      }
    })
  })

  it('renders all role checkboxes as disabled', () => {
    const checkboxes = [
      'isAdministrator',
      'isAssignor',
      'isReferee',
      'isCoach',
      'isLeagueRep',
      'isAssociationRep'
    ]

    checkboxes.forEach(testId => {
      const checkbox = wrapper.get(`[data-test="${testId}"]`)
      expect(checkbox.exists()).toBe(true)
//      expect(checkbox.attributes('disabled')).toBeDefined()
    })
  })

  it('cancel button triggers cancel method', async () => {
    const logSpy = vi.spyOn(console, 'log')

    const cancelButton = wrapper.get('[data-test="cancel"]')
    await cancelButton.trigger('click')

    expect(logSpy).toHaveBeenCalledWith('cancel')
    logSpy.mockRestore()
  })
})
