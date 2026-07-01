import { describe, it, expect } from 'vitest'

// Mirrors the filter logic used in the student Payments.jsx
function filterPayments(payments, filter) {
  if (filter === 'All') return payments
  return payments.filter((p) => p.status === filter.toLowerCase())
}

// Mirrors the status badge text logic
function statusLabel(status) {
  if (status === 'approved') return 'Approved'
  if (status === 'pending')  return 'Pending'
  return 'Rejected'
}

const SAMPLE_PAYMENTS = [
  { _id: '1', amount: 500,  status: 'approved', method: 'Telebirr' },
  { _id: '2', amount: 200,  status: 'pending',  method: 'Bank Transfer' },
  { _id: '3', amount: 300,  status: 'rejected', method: 'Telebirr' },
  { _id: '4', amount: 150,  status: 'approved', method: 'Bank Transfer' },
  { _id: '5', amount: 1000, status: 'pending',  method: 'Telebirr' },
]

// ─────────────────────────────────────────────
describe('Payment filter logic', () => {

  it('returns all payments for "All" filter', () => {
    expect(filterPayments(SAMPLE_PAYMENTS, 'All')).toHaveLength(5)
  })

  it('filters to approved only', () => {
    const result = filterPayments(SAMPLE_PAYMENTS, 'Approved')
    expect(result).toHaveLength(2)
    result.forEach((p) => expect(p.status).toBe('approved'))
  })

  it('filters to pending only', () => {
    const result = filterPayments(SAMPLE_PAYMENTS, 'Pending')
    expect(result).toHaveLength(2)
    result.forEach((p) => expect(p.status).toBe('pending'))
  })

  it('filters to rejected only', () => {
    const result = filterPayments(SAMPLE_PAYMENTS, 'Rejected')
    expect(result).toHaveLength(1)
    expect(result[0]._id).toBe('3')
  })

  it('returns empty array when no payments match filter', () => {
    expect(filterPayments([], 'Approved')).toHaveLength(0)
  })
})

describe('Payment status label', () => {
  it('returns "Approved" for approved', () => expect(statusLabel('approved')).toBe('Approved'))
  it('returns "Pending" for pending',   () => expect(statusLabel('pending')).toBe('Pending'))
  it('returns "Rejected" for rejected', () => expect(statusLabel('rejected')).toBe('Rejected'))
  it('returns "Rejected" for unknown',  () => expect(statusLabel('unknown')).toBe('Rejected'))
})
