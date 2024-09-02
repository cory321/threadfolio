'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseClient } from './utils'
import { adjustEndTimeIfNeeded } from '@/utils/dateTimeUtils'

const transformAppointment = appointment => {
  const startDate = new Date(`${appointment.appointment_date}T${appointment.start_time}`)
  let endDate = new Date(`${appointment.appointment_date}T${appointment.end_time}`)

  endDate = adjustEndTimeIfNeeded(startDate, endDate)

  let appointmentTitle = 'Appointment'

  switch (appointment.type) {
    case 'order_pickup':
      appointmentTitle = 'Order Pickup'
      break
    case 'general':
      appointmentTitle = 'General Appointment'
      break
    case 'initial':
      appointmentTitle = 'Initial Consultation'
      break
  }

  const clientName = appointment.clients ? appointment.clients.full_name : 'Unknown Client'

  return {
    id: appointment.id,
    title: `${appointmentTitle} - ${clientName}`,
    start: startDate,
    end: endDate,
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

  try {
    console.log('Token received:', token ? 'Yes' : 'No')
    const supabase = await getSupabaseClient(token)

    console.log('Supabase client initialized')

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
      console.error('Supabase error:', error)
      throw new Error(`Failed to add appointment: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error in addAppointment:', error)
    throw error
  }
}

export async function getAppointments(userId, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

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
    .eq('user_id', userId)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true })

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

  const today = new Date().toISOString().split('T')[0]

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
    query = query.lt('appointment_date', today).order('appointment_date', { ascending: false })
  } else {
    query = query.gte('appointment_date', today).order('appointment_date', { ascending: true })
  }

  const { data: appointments, error, count } = await query.range((page - 1) * pageSize, page * pageSize - 1)

  if (error) throw new Error(error.message)

  return {
    appointments: appointments.map(transformAppointment),
    totalCount: count
  }
}
