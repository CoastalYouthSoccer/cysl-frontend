import { describe, it, expect } from 'vitest'
import { formatDateToYYYYMMDD } from '@/utils/date.js'

describe('formatDateToYYYYMMDD', () => {
  it('formats a standard Date string correctly', () => {
    expect(formatDateToYYYYMMDD('2023-05-09T12:00:00Z')).toBe('2023-05-09')
  })

  it('formats a Date object correctly', () => {
    const date = new Date(2024, 0, 5) // Jan 5, 2024
    expect(formatDateToYYYYMMDD(date)).toBe('2024-01-05')
  })

  it('pads month and day correctly', () => {
    const date = '3/4/2024'
    expect(formatDateToYYYYMMDD(date)).toBe('2024-03-04')
  })

  it('handles single-digit months and days', () => {
    const date = new Date(2024, 8, 3) // September 3
    expect(formatDateToYYYYMMDD(date)).toBe('2024-09-03')
  })

  it('returns Invalid Date for malformed input', () => {
    expect(formatDateToYYYYMMDD('invalid-date')).toBe('NaN-NaN-NaN')
  })
})
