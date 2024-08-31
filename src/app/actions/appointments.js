'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseClient } from './utils'

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

  if (error) {
    throw new Error(error.message)
  }

  const transformedAppointments = appointments.map(appointment => {
    const startDate = new Date(appointment.appointment_date + 'T' + appointment.start_time + 'Z')
    const endDate = new Date(appointment.appointment_date + 'T' + appointment.end_time + 'Z')

    let appointmentTitle = ''

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
      default:
        appointmentTitle = 'Appointment'
    }

    const clientName = appointment.clients ? appointment.clients.full_name : 'Unknown Client'

    return {
      id: appointment.id,
      title: `${appointmentTitle} - ${clientName}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
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
  })

  return transformedAppointments
}
