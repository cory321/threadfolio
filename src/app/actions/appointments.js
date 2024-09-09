'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseClient } from './utils'
import { adjustEndTimeIfNeeded } from '@/utils/dateTimeUtils'

const transformAppointment = appointment => {
  let appointmentTitle = 'Appointment'

  switch (appointment.type) {
    case 'order pickup':
      appointmentTitle = 'Order Pickup'
      break
    case 'general':
      appointmentTitle = 'General Appointment'
      break
    case 'initial consultation':
      appointmentTitle = 'Initial Consultation'
      break
  }

  const clientName = appointment.clients ? appointment.clients.full_name : 'Unknown Client'

  return {
    id: appointment.id,
    title: `${appointmentTitle} - ${clientName}`,
    start: new Date(appointment.start_time),
    end: new Date(appointment.end_time),
    allDay: false,
    extendedProps: {
      location: appointment.location,
      status: appointment.status,
      type: appointment.type,
      sendEmail: appointment.send_email,
      sendSms: appointment.send_sms,
      notes: appointment.notes,
      clientName: clientName
    }
  }
}

const fetchAppointments = async (supabase, query) => {
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(
      `
      *,
      clients (
        id,
        full_name
      )
    `
    )
    .match(query)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw new Error(error.message)

  return appointments.map(transformAppointment)
}

export async function addAppointment(
  clientId,
  userId,
  startTime,
  endTime,
  location,
  status,
  type,
  notes,
  sendEmail,
  sendSms,
  token
) {
  noStore()

  try {
    console.log('Token received:', token ? 'Yes' : 'No')
    const supabase = await getSupabaseClient(token)

    console.log('Supabase client initialized')

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_id: clientId,
        user_id: userId,
        start_time: startTime,
        end_time: endTime,
        location,
        status,
        type,
        notes,
        send_email: sendEmail,
        send_sms: sendSms
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Failed to add appointment: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error in addAppointment:', error)
    throw error
  }
}

export async function getAppointments(userId, token, start, end) {
  noStore()
  const supabase = await getSupabaseClient(token)

  let query = supabase
    .from('appointments')
    .select(
      `
      *,
      clients (
        id,
        full_name
      )
    `
    )
    .eq('user_id', userId)
    .order('start_time', { ascending: true })

  if (start) {
    query = query.gte('start_time', start)
  }

  if (end) {
    query = query.lte('start_time', end)
  }

  const { data: appointments, error } = await query

  if (error) throw new Error(error.message)

  return appointments.map(transformAppointment)
}

export async function getClientAppointments(
  userId,
  clientId,
  token,
  page = 1,
  pageSize = 10,
  isPastAppointments = false
) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const now = new Date().toISOString()

  let query = supabase
    .from('appointments')
    .select(
      `
      *,
      clients (
        id,
        full_name
      )
    `,
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .eq('client_id', clientId)

  if (isPastAppointments) {
    query = query.lt('start_time', now).order('start_time', { ascending: false })
  } else {
    query = query.gte('start_time', now).order('start_time', { ascending: true })
  }

  const { data: appointments, error, count } = await query.range((page - 1) * pageSize, page * pageSize - 1)

  if (error) throw new Error(error.message)

  return {
    appointments: appointments.map(transformAppointment),
    totalCount: count
  }
}
