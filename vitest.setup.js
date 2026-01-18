// vitest.setup.js
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Disable Vue DevTools in tests
config.global.config.devtools = false

// Mock Auth0 globally for all tests
vi.mock('@/plugins/auth0', () => ({
  default: {
    isAuthenticated: { value: true },
    user: { value: { sub: 'test-user' } },
    getAccessTokenSilently: vi.fn(),
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
  }
}))


// Mock localStorage before anything else tries to use it
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value?.toString() || '';
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

global.localStorage = localStorageMock;

beforeEach(() => {
  localStorage.clear();
});

// Example: mock date or console
vi.stubGlobal('console', {
  ...console,
  warn: vi.fn(),
})

if (typeof window.visualViewport === 'undefined') {
  window.visualViewport = {
    width: 0,
    height: 0,
    scale: 1,
    addEventListener: () => {},
    removeEventListener: () => {},
  }
}
