import { describe, it, expect } from 'vitest'

const PLATFORMS = [
  'phone','email','whatsapp','telegram','facebook',
  'instagram','twitter','linkedin','youtube','tiktok','website','other',
]

// Mirrors the validation the admin Contact form enforces
function validateContact(form) {
  const errors = []
  if (!form.platform || !PLATFORMS.includes(form.platform)) {
    errors.push('Platform is required and must be a valid type.')
  }
  if (!form.value || !form.value.trim()) {
    errors.push('Value is required.')
  }
  if (form.platform === 'email' && form.value) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(form.value.trim())) {
      errors.push('Email address is not valid.')
    }
  }
  if ((form.platform === 'phone' || form.platform === 'whatsapp') && form.value) {
    if (!/^\+?\d[\d\s\-]{6,}$/.test(form.value.trim())) {
      errors.push('Phone number is not valid.')
    }
  }
  return errors
}

// ─────────────────────────────────────────────
describe('Contact form validation', () => {

  it('passes a valid phone contact', () => {
    expect(validateContact({ platform: 'phone', value: '+251911000000' })).toHaveLength(0)
  })

  it('passes a valid email contact', () => {
    expect(validateContact({ platform: 'email', value: 'info@skillnest.com' })).toHaveLength(0)
  })

  it('passes a valid facebook URL', () => {
    expect(validateContact({ platform: 'facebook', value: 'https://facebook.com/skillnest' })).toHaveLength(0)
  })

  it('fails when value is empty', () => {
    const errs = validateContact({ platform: 'phone', value: '' })
    expect(errs).toContain('Value is required.')
  })

  it('fails when platform is missing', () => {
    const errs = validateContact({ platform: '', value: '+251911000000' })
    expect(errs.some((e) => e.includes('Platform'))).toBe(true)
  })

  it('fails on invalid email format', () => {
    const errs = validateContact({ platform: 'email', value: 'not-an-email' })
    expect(errs.some((e) => e.includes('Email'))).toBe(true)
  })

  it('fails on invalid phone format', () => {
    const errs = validateContact({ platform: 'phone', value: 'abc' })
    expect(errs.some((e) => e.includes('Phone'))).toBe(true)
  })

  it('accepts all valid platform types', () => {
    PLATFORMS.forEach((p) => {
      const errs = validateContact({ platform: p, value: 'somevalue' })
      expect(errs.some((e) => e.includes('Platform'))).toBe(false)
    })
  })
})
