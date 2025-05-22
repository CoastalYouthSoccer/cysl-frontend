import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

describe('useUserStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useUserStore()
  })

  it('initializes with default state', () => {
    expect(store.user.firstName).toBe("")
    expect(store.user.userRoles).toEqual([])
    expect(store.fullName).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })

  it('sets user roles and permissions', () => {
    store.setUserRoles(['Administrator', 'Coach'])
    expect(store.user.userRoles).toEqual(['Administrator', 'Coach'])

    store.setPermissions(['read:users'])
    expect(store.user.permissions).toEqual(['read:users'])

    expect(store.isAdmin).toBe(true)
    expect(store.isCoach).toBe(true)
    expect(store.isReferee).toBe(false)
  })

  it('sets user associations', () => {
    const associations = ['A1', 'A2']
    store.setUserAssociations(associations)
    expect(store.user.userAssociations).toEqual(associations)
  })

  it('sets full user info correctly', () => {
    store.setUser({
      given_name: 'Jane',
      family_name: 'Doe',
      email: 'jane@example.com',
      phone: '555-1234',
      sub: 'auth0|abc123'
    })

    expect(store.fullName).toBe('Jane Doe')
    expect(store.email).toBe('jane@example.com')
    expect(store.phone).toBe('555-1234')
    expect(store.userId).toBe('auth0|abc123')
    expect(store.isAuthenticated).toBe(true)
  })

  it('handles user with only one name', () => {
    store.setUser({
      given_name: 'OnlyFirst',
      sub: 'auth0|xyz'
    })

    expect(store.fullName).toBe('OnlyFirst')
  })

  it('clears user properly', () => {
    store.setUser({
      given_name: 'First',
      family_name: 'Last',
      sub: 'auth0|test'
    })
    store.setUserRoles(['Referee'])
    store.setPermissions(['read:users'])
    store.setUserAssociations(['X'])

    store.clearUser()

    expect(store.user).toStrictEqual({
      courierId: null,
      email: "",
      emailEnabled: false,
      firstName: "",
      lastName: "",
      permissions: [],
      phone: "",
      smsEnabled: false,
      socialLogin: false,
      userAssociations: [],
      userId: null,
      userRoles: [],
    })
    expect(store.isAuthenticated).toBe(false)
    expect(store.isReferee).toBe(false)
  })
})
