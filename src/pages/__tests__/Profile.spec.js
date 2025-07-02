import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Profile from '@/pages/Profile.vue'
import { useUserStore } from '@/stores/user'
import { vuetify } from '@/vuetify-setup'

global.ResizeObserver = require('resize-observer-polyfill')

describe('Profile.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Profile, {
      global: {
        plugins: [vuetify, createTestingPinia({
          stubActions: false,
          createSpy: vi.fn
        })]
      }
    })
  })

  it('cancel button triggers cancel method', async () => {
    const logSpy = vi.spyOn(console, 'log')

    const cancelButton = wrapper.findComponent('[data-test="cancel"]')
    await cancelButton.trigger('click')

    expect(logSpy).toHaveBeenCalledWith('cancel')
    logSpy.mockRestore()
  })

  it('renders all checkboxes with correct labels and data bindings', () => {
    const checkboxes = [
      { test: 'isAdministrator', label: 'Administrator?' },
      { test: 'isAssignor', label: 'Assignor?' },
      { test: 'isReferee', label: 'Referee?' },
      { test: 'isCoach', label: 'Coach?' },
      { test: 'isLeagueRep', label: 'League Rep?' },
      { test: 'isAssociationRep', label: 'Association Rep?' }
    ]

    checkboxes.forEach(({ test, label }) => {
      const cb = wrapper.findComponent(`[data-test="${test}"]`)
      expect(cb.exists()).toBe(true)
      expect(cb.text()).toContain(label)
      expect(cb.attributes('class')).toContain('v-input--disabled')

    })
  })
})
