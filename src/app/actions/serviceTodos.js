'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseClient } from './utils'

// Add a new todo for a service
export async function addServiceTodo(userId, serviceId, title, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

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
export async function editServiceTodo(userId, todoId, title, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

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
export async function deleteServiceTodo(userId, todoId, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { error } = await supabase.from('service_todos').delete().eq('id', todoId).eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return todoId
}

// Fetch todos for a specific service
export async function getServiceTodos(userId, serviceId, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { data: todos, error } = await supabase
    .from('service_todos')
    .select('*')
    .eq('service_id', serviceId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return todos
}
