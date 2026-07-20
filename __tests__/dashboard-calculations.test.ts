import { 
  getActiveProjectsCount, 
  getTotalClientsCount,
  getMonthlyRevenue,
  getUnbilledHours,
  getMonthlyChartData 
} from '../lib/dashboard-calculations'

describe('Dashboard calculations', () => {
  const mockProjects = [
    { id: 1, status: 'active', hours_worked: 10, hourly_rate: 50 },
    { id: 2, status: 'active', hours_worked: 5, hourly_rate: 30 },
    { id: 3, status: 'completed', hours_worked: 0, hourly_rate: 40 }
  ]

  const mockClients = [{ id: 1 }, { id: 2 }, { id: 3 }]

  const mockInvoices = [
    { total_amount: 500, status: 'paid', issued_date: new Date().toISOString() },
    { total_amount: 300, status: 'pending', issued_date: new Date().toISOString() },
    { total_amount: 200, status: 'paid', issued_date: new Date(Date.now() - 30*24*60*60*1000).toISOString() }
  ]

  it('conta progetti attivi', () => {
    expect(getActiveProjectsCount(mockProjects)).toBe(2)
  })

  it('conta clienti totali', () => {
    expect(getTotalClientsCount(mockClients)).toBe(3)
  })

  it('calcola fatturato mese corrente', () => {
    const result = getMonthlyRevenue(mockInvoices)
    expect(result).toBe(500)
  })

  it('calcola ore non fatturate', () => {
    expect(getUnbilledHours(mockProjects)).toBe(15)
  })

  it('genera dati per il grafico', () => {
    const result = getMonthlyChartData(mockInvoices)
    expect(result).toHaveLength(6)
    expect(result[0]).toHaveProperty('mese')
    expect(result[0]).toHaveProperty('entrate')
  })
})