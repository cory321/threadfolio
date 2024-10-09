'use server'

import { auth } from '@clerk/nextjs/server'

import { getSupabaseClient, isValidEmail, isValidPhoneNumber } from './utils'

export async function searchClients(query) {
  const supabase = await getSupabaseClient()
  const { userId } = auth()

  const { data, error } = await supabase
    .from('clients')
    .select('id, full_name, email, phone_number')
    .ilike('full_name', `%${query}%`)
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  // Ensure phone_number is null if it's not present
  const clients = data.map(client => ({
    ...client,
    phone_number: client.phone_number || null
  }))

  return clients
}

export async function fetchClients(page = 1, pageSize = 10, orderBy = 'full_name', order = 'asc') {
  const supabase = await getSupabaseClient()
  const { userId } = auth()

  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  const { data, count, error } = await supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order(orderBy, { ascending: order === 'asc' })
    .range(start, end)

  if (error) {
    throw new Error(error.message)
  }

  return { clients: data, totalCount: count }
}

export async function fetchClientById(id) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()

  if (error && error.code === 'PGRST116') {
    // Assuming 'PGRST116' is the code for no rows found
    throw new Error('Client not found')
  } else if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function addClient({ userId, fullName, email, phoneNumber, mailingAddress, notes }) {
  const supabase = await getSupabaseClient()
  const timestamp = new Date().toISOString()

  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID.')
  }

  if (!fullName || typeof fullName !== 'string' || fullName.length > 100) {
    throw new Error('Full name is required and should be less than 100 characters.')
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('A valid email address is required.')
  }

  if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
    throw new Error('A valid phone number is required.')
  }

  if (mailingAddress && typeof mailingAddress !== 'string') {
    throw new Error('Mailing address should be a string.')
  }

  if (notes && typeof notes !== 'string') {
    throw new Error('Notes should be a string.')
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({
      user_id: userId,
      full_name: fullName,
      email: email,
      phone_number: phoneNumber,
      mailing_address: mailingAddress,
      notes: notes,
      updated_at: timestamp
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateClient(id, clientData) {
  const supabase = await getSupabaseClient()
  const timestamp = new Date().toISOString()

  // Include updated_at in the clientData
  const updateData = {
    ...clientData,
    updated_at: timestamp
  }

  const { data, error } = await supabase.from('clients').update(updateData).eq('id', id).select().maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('Client not found')
  }

  return data
}
