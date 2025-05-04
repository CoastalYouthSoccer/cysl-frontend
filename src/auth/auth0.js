import { createAuth0 } from '@auth0/auth0-vue';

const auth0 = createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    scope: import.meta.env.VITE_AUTH0_SCOPE,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
  onRedirectCallback: () => {
      // Push to /callback so we can run logic there
      router.push('/callback')
  },
});

export default auth0;
