import { describe, it, expect, vi, beforeEach } from 'vitest'
import { roleGuard } from '@/auth/authGuard'
import { useAuth0 } from '@auth0/auth0-vue'
import { useUserStore } from '@/stores/user'

vi.mock('@auth0/auth0-vue')
vi.mock('@/stores/user')

describe('roleGuard', () => {
  let next

  beforeEach(() => {
    next = vi.fn()
  })

  it('blocks navigation if not authenticated', () => {
    useAuth0.mockReturnValue({ isAuthenticated: { value: false } })
    useUserStore.mockReturnValue({ user: { userRoles: ['Admin'] } })

    const guard = roleGuard(['Admin'])
    guard({}, {}, next)

    expect(next).toHaveBeenCalledWith(false)
  })

  it('allows access when user has a required role', () => {
    useAuth0.mockReturnValue({ isAuthenticated: { value: true } })
    useUserStore.mockReturnValue({ user: { userRoles: ['Admin', 'Editor'] } })

    const guard = roleGuard(['Admin'])
    guard({}, {}, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('blocks access and redirects when user lacks the required role', () => {
    useAuth0.mockReturnValue({ isAuthenticated: { value: true } })
    useUserStore.mockReturnValue({ user: { userRoles: ['Viewer'] } })

    const guard = roleGuard(['Admin', 'Editor'])
    guard({}, {}, next)

    expect(next).toHaveBeenCalledWith({ name: 'Home' })
  })

  it('redirects to Home if no userRoles are set', () => {
    useAuth0.mockReturnValue({ isAuthenticated: { value: true } })
    useUserStore.mockReturnValue({ user: {} })

    const guard = roleGuard(['Admin'])
    guard({}, {}, next)

    expect(next).toHaveBeenCalledWith({ name: 'Home' })
  })

  it('allows access if allowedRoles is empty', () => {
    useAuth0.mockReturnValue({ isAuthenticated: { value: true } })
    useUserStore.mockReturnValue({ user: { userRoles: ['Anything'] } })

    const guard = roleGuard([]) // Empty means no restriction
    guard({}, {}, next)

    expect(next).toHaveBeenCalledWith({ name: 'Home' })
  })
})
