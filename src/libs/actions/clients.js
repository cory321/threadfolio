'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { createClient } from '@supabase/supabase-js'

export async function getSupabaseClient(token) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
}

export async function addClientAction({ userId, fullName, email, phoneNumber, mailingAddress, notes, token }) {
  noStore()
  const supabase = await getSupabaseClient(token)
  const timestamp = new Date().toISOString()

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
