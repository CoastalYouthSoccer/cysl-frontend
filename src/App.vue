<template>
  <v-app>
    <NavDrawer app/>
    <v-main>
      <v-container fluid>
        <RouterView/>
      </v-container>
    </v-main>
    <AppFooter/>
  </v-app>
</template>

<script setup>
  import { watch } from 'vue'
  import { useAuth0 } from '@auth0/auth0-vue'
  import { useUserStore } from '@/stores/user'
  import { useShareStore } from '@/stores/sharedData'
  import { useVenueSubVenueStore } from './stores/venueSubVenue'

  import NavDrawer from "@/components/sidebar/NavDrawer.vue";
  import Navigation from '@/components/navbar/Navigation.vue';
  import AppFooter from "@/components/AppFooter.vue";

  const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const userStore = useUserStore()
  const shareStore = useShareStore()
  const venueSubVenueStore = useVenueSubVenueStore()

  watch(
  () => ({ loading: isLoading.value, authed: isAuthenticated.value }),
  async ({ loading, authed }) => {
    if (!loading && authed && user.value) {
      userStore.setUser(user.value)
      try {
        const token = await getAccessTokenSilently()
        if (!token) throw new Error('No token returned')
        const base64Url = token.split('.')[1]
        if (!base64Url) throw new Error('Malformed JWT: no payload')
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
        )

        const payload = JSON.parse(jsonPayload)
        const roles = payload['user_roles'] || []
        const permissions = payload['permissions'] || []
        const associations = payload['associations'] || []

        userStore.setUserRoles(roles)
        userStore.setPermissions(permissions)
        userStore.setUserAssociations(associations)
        shareStore.setAssociations(token)
        shareStore.setRoles(token)
        shareStore.setSeasons(token)
        venueSubVenueStore.setSubVenues(token)
        venueSubVenueStore.setVenues(token)

      } catch (err) {
        console.error('Error loading access token claims:', err)
      }
    } else if (!loading && !authed) {
      userStore.clearUser()
    }
  },
  { immediate: true }
)
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
