// Test per la logica di stima preventivo
describe('🤖 Stima Preventivo', () => {
  interface EstimateParams {
    projectType: string
    screens: number
    design: 'template' | 'custom' | 'premium'
    backend: 'none' | 'simple' | 'complex'
    auth: 'none' | 'basic' | 'social' | '2fa'
    payments: 'none' | 'paypal' | 'stripe' | 'both'
  }

  const calculateBaseHours = (params: EstimateParams): number => {
    const baseHoursMap: Record<string, number> = {
      'Landing Page': 15,
      'Sito Web': 35,
      Dashboard: 50,
      API: 45,
      'E-commerce': 65,
      'App Mobile': 80,
    }
    
    let hours = baseHoursMap[params.projectType] || 40
    
    // Design multiplier
    if (params.design === 'custom') hours *= 1.3
    if (params.design === 'premium') hours *= 1.6
    
    // Backend multiplier
    if (params.backend === 'simple') hours *= 1.2
    if (params.backend === 'complex') hours *= 1.5
    
    // Auth multiplier
    if (params.auth === 'basic') hours += 5
    if (params.auth === 'social') hours += 10
    if (params.auth === '2fa') hours += 15
    
    // Payments multiplier
    if (params.payments !== 'none') hours += 8
    
    // Pages multiplier
    hours += (params.screens - 1) * 2
    
    return Math.round(hours)
  }

  it('calcola ore base per tipologia', () => {
    expect(calculateBaseHours({
      projectType: 'Landing Page',
      screens: 1,
      design: 'template',
      backend: 'none',
      auth: 'none',
      payments: 'none',
    })).toBe(15)
    
    expect(calculateBaseHours({
      projectType: 'E-commerce',
      screens: 1,
      design: 'template',
      backend: 'none',
      auth: 'none',
      payments: 'none',
    })).toBe(65)
  })

  it('aumenta le ore con design custom', () => {
    const baseParams: Omit<EstimateParams, 'design'> = {
      projectType: 'Sito Web',
      screens: 1,
      backend: 'none',
      auth: 'none',
      payments: 'none',
    }
    
    const template = calculateBaseHours({ ...baseParams, design: 'template' })
    const custom = calculateBaseHours({ ...baseParams, design: 'custom' })
    
    expect(custom).toBeGreaterThan(template)
  })

  it('aumenta le ore con autenticazione', () => {
    const baseParams: Omit<EstimateParams, 'auth'> = {
      projectType: 'Sito Web',
      screens: 1,
      design: 'template',
      backend: 'none',
      payments: 'none',
    }
    
    const noAuth = calculateBaseHours({ ...baseParams, auth: 'none' })
    const withAuth = calculateBaseHours({ ...baseParams, auth: 'basic' })
    
    expect(withAuth).toBeGreaterThan(noAuth)
  })
})