'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { createClient } from '@supabase/supabase-js'

// Function to get Supabase client
export async function getSupabaseClient(token) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
}

// Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email)
}

// Function to validate phone number format
function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/

  return phoneRegex.test(phoneNumber)
}

// Fetch all clients from the clients table
export async function fetchClients(token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { data, error } = await supabase.from('clients').select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Fetch a client by ID from the clients table
export async function fetchClientById(id, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Main function to add a client
export async function addClientAction({ userId, fullName, email, phoneNumber, mailingAddress, notes, token }) {
  noStore()
  const supabase = await getSupabaseClient(token)
  const timestamp = new Date().toISOString()

  // Server-side validation
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

  // Insert data into the database
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
