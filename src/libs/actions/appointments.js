'use server'
import { unstable_noStore as noStore } from 'next/cache'

import { createClient } from '@supabase/supabase-js'

export async function getSupabaseClient(token) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${token}` }
    }
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

export async function getAppointmentsAction(token) {
  noStore()
  const supabase = await getSupabaseClient(token)
  const { data: appointments, error } = await supabase.from('appointments').select('*')

  if (error) {
    throw new Error(error.message)
  }

  const transformedAppointments = appointments.map(appointment => {
    const startDate = new Date(appointment.appointment_date)
    const startTime = appointment.start_time.split(':')

    startDate.setHours(startTime[0], startTime[1], startTime[2])

    const endDate = new Date(appointment.appointment_date)
    const endTime = appointment.end_time.split(':')

    endDate.setHours(endTime[0], endTime[1], endTime[2])

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

    return {
      id: appointment.id,
      title: appointmentTitle,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      allDay: false,
      extendedProps: {
        location: appointment.location,
        status: appointment.status,
        type: appointment.type,
        sendEmail: appointment.send_email,
        sendSms: appointment.send_sms,
        notes: appointment.notes
      }
    }
  })

  return transformedAppointments
}
