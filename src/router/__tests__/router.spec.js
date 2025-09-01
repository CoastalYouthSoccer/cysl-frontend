import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import routerDef from '@/router/index.js'

vi.mock('@auth0/auth0-vue', () => ({
  authGuard: vi.fn((to, from, next) => next())
}))

vi.mock('@/auth/authGuard', () => ({
  roleGuard: vi.fn((allowedRoles) => (to, from, next) => next())
}))

describe('Router Configuration', () => {
  it('should register expected routes with correct names and paths', () => {
    const routeNames = routerDef.getRoutes().map(route => route.name).filter(Boolean)
    expect(routeNames).toContain('Home')
    expect(routeNames).toContain('Profile')
    expect(routeNames).toContain('AssignrReferee')
    expect(routeNames).toContain('CYSLSpring2025Rules')
    expect(routeNames).toContain('AssignrDocumentation')
    expect(routeNames).toContain('FieldCoordinator')
    expect(routeNames).toContain('Association')
    expect(routeNames).toContain('Season')
    expect(routeNames).toContain('User')
    expect(routeNames).toContain('Venue')
    expect(routeNames).toContain('SubVenue')
  })

  it('should apply authGuard and roleGuard to admin routes', () => {
    const adminRoute = routerDef.options.routes.find(r => r.path === '/admin')
    expect(adminRoute.beforeEnter).toHaveLength(2)
  })

  it('should apply authGuard and roleGuard to assignor routes', () => {
    const assignorRoute = routerDef.options.routes.find(r => r.path === '/assignor')
    expect(assignorRoute.beforeEnter).toHaveLength(2)
  })

  it('should apply only authGuard to referee and profile routes', () => {
    const profileRoute = routerDef.options.routes.find(r => r.path === '/profile')
    expect(profileRoute.beforeEnter).toHaveLength(3)
  })

  it('should apply authGuard and roleGuard to /call route', () => {
    const callRoute = routerDef.options.routes.find(r => r.path === '/call')
    expect(callRoute.beforeEnter).toHaveLength(2)
  })

  it('navigates to known routes without error', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: routerDef.options.routes
    })

    await router.push('/')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('Home')
  })

  it('redirects to NotFound for unknown routes', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: routerDef.options.routes
    })

    await router.push('/nonexistent')
    await router.isReady()
    expect(router.currentRoute.value.matched[0].name).toBe('NotFound')
  })
})
