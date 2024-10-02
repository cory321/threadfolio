'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseClient } from './utils'

// Function to create a new time entry
export async function addTimeEntry(userId, serviceId, minutes) {
  noStore()

  const supabase = await getSupabaseClient()

  const { data, error } = await supabase.from('garment_service_time_entries').insert({
    user_id: userId,
    service_id: serviceId,
    minutes
  })

  if (error) {
    throw new Error('Failed to add time entry: ' + error.message)
  }

  return data
}

// Function to fetch total time logged for a garment
export async function getTotalTimeForGarment(userId, garmentId) {
  noStore()

  const supabase = await getSupabaseClient()

  // Get all services related to the garment
  const { data: services, error: servicesError } = await supabase
    .from('garment_services')
    .select('id')
    .eq('garment_id', garmentId)

  if (servicesError) {
    throw new Error('Failed to fetch services: ' + servicesError.message)
  }

  const serviceIds = services.map(service => service.id)

  // Sum the minutes from all time entries related to these services
  const { data: timeEntries, error: timeEntriesError } = await supabase
    .from('garment_service_time_entries')
    .select('minutes')
    .in('service_id', serviceIds)
    .eq('user_id', userId)

  if (timeEntriesError) {
    throw new Error('Failed to fetch time entries: ' + timeEntriesError.message)
  }

  const totalMinutes = timeEntries.reduce((sum, entry) => sum + entry.minutes, 0)

  return totalMinutes
}

// Function to fetch all time entries for a garment
export async function getTimeEntriesForGarment(userId, garmentId) {
  noStore()

  const supabase = await getSupabaseClient()

  // Get all services related to the garment
  const { data: services, error: servicesError } = await supabase
    .from('garment_services')
    .select('id')
    .eq('garment_id', garmentId)

  if (servicesError) {
    throw new Error('Failed to fetch services: ' + servicesError.message)
  }

  const serviceIds = services.map(service => service.id)

  // Fetch time entries with related service names
  const { data: timeEntries, error: timeEntriesError } = await supabase
    .from('garment_service_time_entries')
    .select(
      `
      id,
      minutes,
      logged_at,
      garment_services (
        id,
        name
      )
    `
    )
    .in('service_id', serviceIds)
    .eq('user_id', userId)

  if (timeEntriesError) {
    throw new Error('Failed to fetch time entries: ' + timeEntriesError.message)
  }

  return timeEntries
}

export async function getTimeEntriesGroupedByServiceForGarment(userId, garmentId) {
  noStore()
  const supabase = await getSupabaseClient()

  // Fetch all services related to the garment
  const { data: services, error: servicesError } = await supabase
    .from('garment_services')
    .select('id, name')
    .eq('garment_id', garmentId)

  if (servicesError) {
    throw new Error('Failed to fetch services: ' + servicesError.message)
  }

  if (!services || services.length === 0) {
    return []
  }

  const serviceIds = services.map(service => service.id)

  // Fetch time entries related to these services
  const { data: timeEntries, error: timeEntriesError } = await supabase
    .from('garment_service_time_entries')
    .select('service_id, minutes')
    .in('service_id', serviceIds)
    .eq('user_id', userId)

  if (timeEntriesError) {
    throw new Error('Failed to fetch time entries: ' + timeEntriesError.message)
  }

  // Group time entries by service and accumulate minutes
  const serviceTimeMap = {}

  // Initialize the map with services
  services.forEach(service => {
    serviceTimeMap[service.id] = {
      id: service.id,
      name: service.name,
      totalMinutes: 0
    }
  })

  // Accumulate minutes per service
  timeEntries.forEach(entry => {
    if (serviceTimeMap[entry.service_id]) {
      serviceTimeMap[entry.service_id].totalMinutes += entry.minutes
    }
  })

  // Convert the map to an array
  const groupedServiceTime = Object.values(serviceTimeMap)

  return groupedServiceTime
}

// Function to update a time entry
export async function updateTimeEntry(userId, entryId, minutes) {
  noStore()

  const supabase = await getSupabaseClient()

  const { error } = await supabase
    .from('garment_service_time_entries')
    .update({ minutes })
    .eq('id', entryId)
    .eq('user_id', userId)

  if (error) {
    throw new Error('Failed to update time entry: ' + error.message)
  }
}

// Function to delete a time entry
export async function deleteTimeEntry(userId, entryId) {
  noStore()

  const supabase = await getSupabaseClient()

  const { error } = await supabase.from('garment_service_time_entries').delete().eq('id', entryId).eq('user_id', userId)

  if (error) {
    throw new Error('Failed to delete time entry: ' + error.message)
  }
}
