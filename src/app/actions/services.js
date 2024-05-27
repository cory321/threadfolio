'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseClient } from './utils'

export async function addService(userId, service, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { data, error } = await supabase
    .from('services')
    .insert({
      name: service.name,
      description: service.description,
      qty: service.qty,
      unit: service.unit,
      unit_price: service.unit_price,
      user_id: userId,
      image_url: service.image_url
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function editService(id, updatedService, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { data, error } = await supabase
    .from('services')
    .update({
      name: updatedService.name,
      description: updatedService.description,
      qty: updatedService.qty,
      unit: updatedService.unit,
      unit_price: updatedService.unit_price,
      image_url: updatedService.image_url
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteService(id, token) {
  noStore()
  const supabase = await getSupabaseClient(token)
  const { error } = await supabase.from('services').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return id
}

export async function fetchAllServices(token) {
  noStore()
  const supabase = await getSupabaseClient(token)
  const { data: services, error } = await supabase.from('services').select('*')

  if (error) {
    throw new Error(error.message)
  }

  return services
}

export async function duplicateService(id, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  // Fetch the service by ID
  const { data: service, error: fetchError } = await supabase.from('services').select('*').eq('id', id).single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  // Remove the id field to allow the database to generate a new one
  const { id: _, ...serviceData } = service

  // Insert the duplicated service
  const { data: duplicatedService, error: insertError } = await supabase
    .from('services')
    .insert({
      ...serviceData,
      name: `${service.name} (Copy)` // or any logic to make the name unique
    })
    .select()
    .single()

  if (insertError) {
    throw new Error(insertError.message)
  }

  return duplicatedService
}