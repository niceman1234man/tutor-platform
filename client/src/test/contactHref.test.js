import { describe, it, expect } from 'vitest'

// Same helper used in Home.jsx
function contactHref(platform, value) {
  if (platform === 'email') return `mailto:${value}`
  if (platform === 'phone' || platform === 'whatsapp') return `tel:${value}`
  if (value.startsWith('http')) return value
  return `https://${value}`
}

// ─────────────────────────────────────────────
describe('contactHref()', () => {

  it('returns mailto: for email', () => {
    expect(contactHref('email', 'info@skillnest.com')).toBe('mailto:info@skillnest.com')
  })

  it('returns tel: for phone', () => {
    expect(contactHref('phone', '+251900000000')).toBe('tel:+251900000000')
  })

  it('returns tel: for whatsapp', () => {
    expect(contactHref('whatsapp', '+251900000000')).toBe('tel:+251900000000')
  })

  it('returns value as-is when it already starts with http', () => {
    expect(contactHref('facebook', 'https://facebook.com/skillnest')).toBe('https://facebook.com/skillnest')
    expect(contactHref('youtube', 'http://youtube.com/@skillnest')).toBe('http://youtube.com/@skillnest')
  })

  it('prepends https:// when value has no protocol', () => {
    expect(contactHref('linkedin', 'linkedin.com/in/skillnest')).toBe('https://linkedin.com/in/skillnest')
    expect(contactHref('tiktok', 'tiktok.com/@skillnest')).toBe('https://tiktok.com/@skillnest')
  })

  it('handles website platform', () => {
    expect(contactHref('website', 'www.skillnest.com')).toBe('https://www.skillnest.com')
  })
})
