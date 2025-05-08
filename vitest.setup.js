// vitest.setup.js
import { vi } from 'vitest'

// Example: mock date or console
vi.stubGlobal('console', {
  ...console,
  warn: vi.fn(),
})
