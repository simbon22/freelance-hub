type Project = {
  status: string
  hours_worked?: number
  hourly_rate?: number
}

type Client = {
  id: string | number
}

type Invoice = {
  total_amount: number
  status: string
  issued_date: string
}

export const getActiveProjectsCount = (projects: Project[]) => {
  return projects.filter(p => p.status === 'active').length
}

export const getTotalClientsCount = (clients: Client[]) => {
  return clients.length
}

export const getMonthlyRevenue = (invoices: Invoice[]) => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return invoices
    .filter(inv => {
      const date = new Date(inv.issued_date)
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
             inv.status === 'paid'
    })
    .reduce((sum, inv) => sum + inv.total_amount, 0)
}

export const getUnbilledHours = (projects: Project[]) => {
  return projects
    .filter(p => p.status === 'active' && (p.hours_worked || 0) > 0)
    .reduce((sum, p) => sum + (p.hours_worked || 0), 0)
}

export const getMonthlyChartData = (invoices: Invoice[]) => {
  const months = []
  const now = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleString('it-IT', { month: 'short' })
    const year = date.getFullYear()
    
    const revenue = invoices
      .filter(inv => {
        const invDate = new Date(inv.issued_date)
        return invDate.getMonth() === date.getMonth() && 
               invDate.getFullYear() === year && 
               inv.status === 'paid'
      })
      .reduce((sum, inv) => sum + inv.total_amount, 0)
    
    months.push({
      mese: `${monthName} ${year}`,
      entrate: revenue
    })
  }
  return months
}