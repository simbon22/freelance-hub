import { fetchProjects, addProject, updateProject, deleteProject } from '../hooks/use-projects'

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

describe('useProjects', () => {
  it('fetchProjects è una funzione', () => {
    expect(typeof fetchProjects).toBe('function')
  })

  it('addProject è una funzione', () => {
    expect(typeof addProject).toBe('function')
  })

  it('updateProject è una funzione', () => {
    expect(typeof updateProject).toBe('function')
  })

  it('deleteProject è una funzione', () => {
    expect(typeof deleteProject).toBe('function')
  })
})
