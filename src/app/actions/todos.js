'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseClient } from './utils'

export async function addTodo(userId, title, token) {
  noStore()
  const supabase = await getSupabaseClient(token)
  const { data, error } = await supabase.from('todos').insert({ title, user_id: userId }).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function editTodo(id, title, token) {
  noStore()
  const supabase = await getSupabaseClient(token)
  const { data, error } = await supabase.from('todos').update({ title }).eq('id', id).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteTodo(id, token) {
  noStore()
  const supabase = await getSupabaseClient(token)
  const { error } = await supabase.from('todos').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return id
}

export async function loadTodosAction(token) {
  const supabase = await getSupabaseClient(token)
  const { data: todos, error } = await supabase.from('todos').select('*')

  if (error) {
    throw new Error(error.message)
  }

  return todos
}
