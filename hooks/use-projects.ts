import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Project, NewProject } from '@/types'

// Fetch tutti i progetti dell'utente
const fetchProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as (Project & { clients: { name: string } })[]
}

// Aggiungi progetto
const addProject = async (project: NewProject & { user_id: string }) => {
  const { error } = await supabase.from('projects').insert([project])
  if (error) throw new Error(error.message)
}

// Aggiorna progetto
const updateProject = async (id: string, updates: Partial<Project>) => {
  const { error } = await supabase.from('projects').update(updates).eq('id', id)
  if (error) throw new Error(error.message)
}

// Elimina progetto
const deleteProject = async (id: string) => {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export function useProjects(userId: string | undefined) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['projects', userId],
    queryFn: () => fetchProjects(userId!),
    enabled: !!userId,
  })

  const addMutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) =>
      updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] })
    },
  })

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addProject: addMutation.mutate,
    isAdding: addMutation.isPending,
    updateProject: updateMutation.mutate,
    deleteProject: deleteMutation.mutate,
  }
}