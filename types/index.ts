export type Client = {
  id: string
  name: string
  email: string
  phone: string
  user_id: string
  created_at: string
}

export type Project = {
  id: string
  name: string
  client_id: string
  hourly_rate: number
  estimated_hours: number | null
  hours_worked: number | null
  status: 'active' | 'paused' | 'completed'
  user_id: string
  created_at: string
  external_costs: number | null 
}

export type NewProject = Omit<Project, 'id' | 'created_at' | 'user_id'>


export type Invoice = {
  id: string
  project_id: string
  client_id: string
  user_id: string
  invoice_number: string
  hours_worked: number
  hourly_rate: number
  total_amount: number
  status: 'pending' | 'paid' | 'overdue'
  issued_date: string
  due_date: string
  paid_date: string | null
  notes: string | null
  created_at: string
}

export type NewInvoice = Omit<Invoice, 'id' | 'created_at' | 'user_id'>


