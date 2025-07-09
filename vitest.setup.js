// vitest.setup.js
import { vi } from 'vitest'

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
