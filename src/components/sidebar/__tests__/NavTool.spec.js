import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavTools from '@/components/sidebar/NavTools.vue'

function mountWithRoles(roles) {
  return shallowMount(NavTools, {
    global: {
      plugins: [
        createTestingPinia({
          stubActions: false,
          initialState: {
            user: { ...roles }
          }
        })
      ]
    }
  })
}

describe('NavTools.vue', () => {
  it('renders Field Coordinator for assignor', () => {
    const wrapper = mountWithRoles({ isAssignor: true, isAdmin: false })
    expect(wrapper.find('[data-test="nav-item-field-coordinator"]').exists()).toBe(true)
  })

  it('renders Field Coordinator for admin', () => {
    const wrapper = mountWithRoles({ isAssignor: false, isAdmin: true })
    expect(wrapper.find('[data-test="nav-item-field-coordinator"]').exists()).toBe(true)
  })

  it('does not render Field Coordinator if not assignor or admin', () => {
    const wrapper = mountWithRoles({ isAssignor: false, isAdmin: false })
    expect(wrapper.find('[data-test="nav-item-field-coordinator"]').exists()).toBe(false)
  })
})
