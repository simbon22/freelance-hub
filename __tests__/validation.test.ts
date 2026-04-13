// Test per validazione form
describe('✅ Validazione Form', () => {
  interface ProjectForm {
    name: string
    client_id: string
    hourly_rate: number
  }

  const validateProjectForm = (data: ProjectForm): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Il nome del progetto deve avere almeno 3 caratteri')
    }
    if (!data.client_id) {
      errors.push('Seleziona un cliente')
    }
    if (!data.hourly_rate || data.hourly_rate <= 0) {
      errors.push('La tariffa oraria deve essere maggiore di 0')
    }
    
    return { valid: errors.length === 0, errors }
  }

  it('valida un progetto corretto', () => {
    const result = validateProjectForm({
      name: 'Sito Web Mario',
      client_id: 'client-123',
      hourly_rate: 50,
    })
    
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rigetta progetto senza nome', () => {
    const result = validateProjectForm({
      name: '',
      client_id: 'client-123',
      hourly_rate: 50,
    })
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Il nome del progetto deve avere almeno 3 caratteri')
  })

  it('rigetta progetto con tariffa zero', () => {
    const result = validateProjectForm({
      name: 'Test',
      client_id: 'client-123',
      hourly_rate: 0,
    })
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('La tariffa oraria deve essere maggiore di 0')
  })
})