'use server'

import { createClient } from '@supabase/supabase-js'

export async function getSupabaseClient(token) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
}

export async function addTodoAction(userId, title, token) {
  const supabase = await getSupabaseClient(token)
  const { data, error } = await supabase.from('todos').insert({ title, user_id: userId }).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function editTodoAction(id, title, token) {
  const supabase = await getSupabaseClient(token)
  const { data, error } = await supabase.from('todos').update({ title }).eq('id', id).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteTodoAction(id, token) {
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
