import { useDashboardStore } from '../store/dashboard-store'

describe('dashboard-store', () => {
  it('sidebarOpen iniziale è true', () => {
    const state = useDashboardStore.getState()
    expect(state.sidebarOpen).toBe(true)
  })

  it('toggleSidebar cambia lo stato', () => {
    const { toggleSidebar } = useDashboardStore.getState()
    
    expect(useDashboardStore.getState().sidebarOpen).toBe(true)
    toggleSidebar()
    expect(useDashboardStore.getState().sidebarOpen).toBe(false)
    toggleSidebar()
    expect(useDashboardStore.getState().sidebarOpen).toBe(true)
  })

  it('setSidebarOpen imposta il valore', () => {
    const { setSidebarOpen } = useDashboardStore.getState()
    
    setSidebarOpen(false)
    expect(useDashboardStore.getState().sidebarOpen).toBe(false)
    
    setSidebarOpen(true)
    expect(useDashboardStore.getState().sidebarOpen).toBe(true)
  })
})
