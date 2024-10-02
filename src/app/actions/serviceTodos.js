'use server'

import { getSupabaseClient } from './utils'

// Add a new todo for a service
export async function addServiceTodo(userId, serviceId, title) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from('service_todos')
    .insert({ user_id: userId, service_id: serviceId, title })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Edit an existing todo
export async function editServiceTodo(userId, todoId, title) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from('service_todos')
    .update({ title })
    .eq('id', todoId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Delete a todo
export async function deleteServiceTodo(userId, todoId) {
  const supabase = await getSupabaseClient()

  const { error } = await supabase.from('service_todos').delete().eq('id', todoId).eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return todoId
}

// Fetch todos for a specific service (ensure 'completed' is selected)
export async function getServiceTodos(userId, serviceId) {
  const supabase = await getSupabaseClient()

  const { data: todos, error } = await supabase
    .from('service_todos')
    .select('*') // Make sure 'completed' is included
    .eq('service_id', serviceId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return todos
}

// Toggle completion status of a todo
export async function toggleCompleteServiceTodo(userId, todoId) {
  const supabase = await getSupabaseClient()

  // Fetch the current 'completed' status
  const { data: existingTodo, error: fetchError } = await supabase
    .from('service_todos')
    .select('completed')
    .eq('id', todoId)
    .eq('user_id', userId)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  // Toggle the 'completed' status
  const { data, error } = await supabase
    .from('service_todos')
    .update({ completed: !existingTodo.completed })
    .eq('id', todoId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
