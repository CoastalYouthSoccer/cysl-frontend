import { describe, it, expect } from 'vitest'
import { formatErrorMessage } from '@/utils/formatMessage.js'

describe('formatErrorMessage', () => {
  it('returns joined string for array input', () => {
    const result = formatErrorMessage(['Error 1', 'Error 2'])
    expect(result).toBe('Error 1, Error 2')
  })

  it('returns the message if it is a string', () => {
    const result = formatErrorMessage('Something went wrong')
    expect(result).toBe('Something went wrong')
  })

  it('returns "Unknown error" for other types', () => {
    expect(formatErrorMessage({})).toBe('Unknown error')
    expect(formatErrorMessage(null)).toBe('Unknown error')
    expect(formatErrorMessage(42)).toBe('Unknown error')
  })
})
