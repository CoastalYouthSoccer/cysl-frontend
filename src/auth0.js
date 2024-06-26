// src/auth0.js
import { createAuth0 } from '@auth0/auth0-vue';

const auth0 = createAuth0({
  domain: 'hanover-referee.us.auth0.com',
  client_id: 'tJR9OaGGwTwobEAlzKNiJxhsEXR90Vbh',
  redirect_uri: window.location.origin,
  audience: 'https://coastal-backend',
  scope: 'openid email'
});

export default auth0;
