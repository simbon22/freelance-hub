import { fetchInvoices, addInvoice, updateInvoice, deleteInvoice } from '../hooks/use-invoices'

jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            then: jest.fn()
          }))
        }))
      })),
      insert: jest.fn(() => ({
        then: jest.fn()
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          then: jest.fn()
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          then: jest.fn()
        }))
      }))
    }))
  }
}))

describe('useInvoices', () => {
  it('fetchInvoices è una funzione', () => {
    expect(typeof fetchInvoices).toBe('function')
  })

  it('addInvoice è una funzione', () => {
    expect(typeof addInvoice).toBe('function')
  })

  it('updateInvoice è una funzione', () => {
    expect(typeof updateInvoice).toBe('function')
  })

  it('deleteInvoice è una funzione', () => {
    expect(typeof deleteInvoice).toBe('function')
  })
})
