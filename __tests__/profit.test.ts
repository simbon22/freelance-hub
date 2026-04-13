// Test puramente logici - nessuna dipendenza da React
describe('📊 Calcolo Profitto', () => {
  describe('calculateRevenue', () => {
    const calculateRevenue = (hours: number, rate: number) => hours * rate
    
    it('calcola il ricavo correttamente', () => {
      expect(calculateRevenue(40, 50)).toBe(2000)
      expect(calculateRevenue(0, 50)).toBe(0)
      expect(calculateRevenue(40, 0)).toBe(0)
    })
  })

  describe('calculateProfit', () => {
    const calculateProfit = (revenue: number, costs: number) => revenue - costs
    
    it('calcola il profitto netto', () => {
      expect(calculateProfit(2000, 200)).toBe(1800)
      expect(calculateProfit(2000, 0)).toBe(2000)
      expect(calculateProfit(0, 200)).toBe(-200)
    })
  })

  describe('calculateMargin', () => {
    const calculateMargin = (profit: number, revenue: number) => 
      revenue > 0 ? (profit / revenue) * 100 : 0
    
    it('calcola la percentuale di margine', () => {
      expect(calculateMargin(1800, 2000)).toBe(90)
      expect(calculateMargin(0, 2000)).toBe(0)
      expect(calculateMargin(1000, 2000)).toBe(50)
    })
  })
})