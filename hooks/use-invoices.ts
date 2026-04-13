import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Invoice, NewInvoice } from '@/types'

const fetchInvoices = async (userId: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, projects(name), clients(name)')
    .eq('user_id', userId)
    .order('issued_date', { ascending: false })

  if (error) throw new Error(error.message)
  return data as (Invoice & { projects: { name: string }, clients: { name: string } })[]
}

const addInvoice = async (invoice: NewInvoice & { user_id: string }) => {
  const { error } = await supabase.from('invoices').insert([invoice])
  if (error) throw new Error(error.message)
}

const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
  const { error } = await supabase.from('invoices').update(updates).eq('id', id)
  if (error) throw new Error(error.message)
}

const deleteInvoice = async (id: string) => {
  const { error } = await supabase.from('invoices').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export function useInvoices(userId: string | undefined) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['invoices', userId],
    queryFn: () => fetchInvoices(userId!),
    enabled: !!userId,
  })

  const addMutation = useMutation({
    mutationFn: addInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Invoice> }) =>
      updateInvoice(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', userId] })
    },
  })

  return {
    invoices: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addInvoice: addMutation.mutate,
    isAdding: addMutation.isPending,
    updateInvoice: updateMutation.mutate,
    deleteInvoice: deleteMutation.mutate,
  }
}