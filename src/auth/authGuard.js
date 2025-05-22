// src/auth/roleGuard.js
import { useAuth0 } from '@auth0/auth0-vue'
import { useUserStore } from '@/stores/user'

export function roleGuard(allowedRoles = []) {
  return (to, from, next) => {
    const { isAuthenticated } = useAuth0()
    const userStore = useUserStore()

    if (!isAuthenticated.value) {
      // Let authGuard handle redirect
      return next(false)
    }

    const userRoles = userStore.user.userRoles || []
    const hasAccess = allowedRoles.some(role => userRoles.includes(role))

    if (hasAccess) {
      next()
    } else {
      // Optionally redirect or show forbidden page
      next({ name: 'Home' }) // or to a 403 page
    }
  }
}
