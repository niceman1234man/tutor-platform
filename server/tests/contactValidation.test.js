import { describe, it, expect } from 'vitest'

const VALID_PLATFORMS = [
  'phone','email','whatsapp','telegram','facebook',
  'instagram','twitter','linkedin','youtube','tiktok','website','other',
]

// Mirrors what the Contact model schema enforces server-side
function validateContactPayload(body) {
  const errors = []
  if (!body.platform || !VALID_PLATFORMS.includes(body.platform)) {
    errors.push('platform is required and must be a valid enum value')
  }
  if (!body.value || typeof body.value !== 'string' || !body.value.trim()) {
    errors.push('value is required')
  }
  return errors
}

function buildContactResponse(saved) {
  return {
    _id: saved._id || 'mock-id',
    platform: saved.platform,
    label: saved.label || '',
    value: saved.value,
    isActive: saved.isActive !== undefined ? saved.isActive : true,
    order: saved.order || 0,
  }
}

// ─────────────────────────────────────────────
describe('Server: Contact payload validation', () => {

  it('passes valid phone contact', () => {
    expect(validateContactPayload({ platform: 'phone', value: '+251900000000' })).toHaveLength(0)
  })

  it('passes valid email contact', () => {
    expect(validateContactPayload({ platform: 'email', value: 'admin@skillnest.com' })).toHaveLength(0)
  })

  it('passes valid social media contact', () => {
    expect(validateContactPayload({ platform: 'youtube', value: 'https://youtube.com/@skillnest' })).toHaveLength(0)
  })

  it('fails when platform is missing', () => {
    const errs = validateContactPayload({ value: '+251900000000' })
    expect(errs.some((e) => e.includes('platform'))).toBe(true)
  })

  it('fails when platform is not in allowed list', () => {
    const errs = validateContactPayload({ platform: 'snapchat', value: '@skillnest' })
    expect(errs.some((e) => e.includes('platform'))).toBe(true)
  })

  it('fails when value is missing', () => {
    const errs = validateContactPayload({ platform: 'facebook' })
    expect(errs.some((e) => e.includes('value'))).toBe(true)
  })

  it('fails when value is empty string', () => {
    const errs = validateContactPayload({ platform: 'linkedin', value: '   ' })
    expect(errs.some((e) => e.includes('value'))).toBe(true)
  })

  it('accepts all 12 valid platform types', () => {
    VALID_PLATFORMS.forEach((p) => {
      const errs = validateContactPayload({ platform: p, value: 'test' })
      expect(errs).toHaveLength(0)
    })
  })
})

describe('Server: Contact response shape', () => {

  it('builds correct response shape with defaults', () => {
    const result = buildContactResponse({ platform: 'email', value: 'hi@test.com' })
    expect(result).toHaveProperty('platform', 'email')
    expect(result).toHaveProperty('value', 'hi@test.com')
    expect(result).toHaveProperty('isActive', true)
    expect(result).toHaveProperty('order', 0)
    expect(result).toHaveProperty('label', '')
  })

  it('preserves isActive=false when explicitly set', () => {
    const result = buildContactResponse({ platform: 'phone', value: '123', isActive: false })
    expect(result.isActive).toBe(false)
  })

  it('preserves custom label and order', () => {
    const result = buildContactResponse({ platform: 'phone', value: '123', label: 'Support', order: 3 })
    expect(result.label).toBe('Support')
    expect(result.order).toBe(3)
  })
})
