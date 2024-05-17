'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { createClient } from '@supabase/supabase-js'

export async function getSupabaseClient(token) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
}

export async function addAppointmentAction(
  clientId,
  userId,
  appointmentDate,
  startTime,
  endTime,
  location,
  status,
  type,
  sendEmail,
  sendSms,
  notes,
  token
) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      client_id: clientId,
      user_id: userId,
      appointment_date: appointmentDate,
      start_time: startTime,
      end_time: endTime,
      location,
      status,
      type,
      send_email: sendEmail,
      send_sms: sendSms,
      notes
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
