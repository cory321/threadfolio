'use server'

import { getSupabaseClient } from './utils'

export async function updateServiceDoneStatus(userId, serviceId, isDone) {
  const supabase = await getSupabaseClient()

  // Step 1: Fetch the garment_id from garment_services
  const { data: serviceData, error: serviceError } = await supabase
    .from('garment_services')
    .select('garment_id')
    .eq('id', serviceId)
    .single()

  if (serviceError || !serviceData) {
    throw new Error('Service not found.')
  }

  const garmentId = serviceData.garment_id

  // Step 2: Verify the garment belongs to the user
  const { data: garmentData, error: garmentError } = await supabase
    .from('garments')
    .select('user_id')
    .eq('id', garmentId)
    .single()

  if (garmentError || !garmentData) {
    throw new Error('Garment not found.')
  }

  if (garmentData.user_id !== userId) {
    throw new Error('You do not have permission to update this service.')
  }

  // Step 3: Update the service's is_done status
  const { error: updateError } = await supabase.from('garment_services').update({ is_done: isDone }).eq('id', serviceId)

  if (updateError) {
    throw new Error('Failed to update service status: ' + updateError.message)
  }
}

export async function addGarmentService(userId, serviceData) {
  const supabase = await getSupabaseClient()

  // Verify that the garment belongs to the user
  const { data: garment, error: garmentError } = await supabase
    .from('garments')
    .select('user_id')
    .eq('id', serviceData.garment_id)
    .single()

  if (garmentError || !garment) {
    throw new Error('Garment not found or you do not have permission to modify it.')
  }

  if (garment.user_id !== userId) {
    throw new Error('You do not have permission to add services to this garment.')
  }

  // Insert the new service into the garment_services table
  const { data: newService, error: insertError } = await supabase
    .from('garment_services')
    .insert(serviceData)
    .select('*')
    .single()

  if (insertError) {
    throw new Error('Failed to add new service: ' + insertError.message)
  }

  return newService
}

export async function getPrioritizedGarments(userId) {
  const supabase = await getSupabaseClient()

  const { data: garments, error } = await supabase
    .from('garments')
    .select(
      `
      id,
      name,
      due_date,
      stage_id,
      garment_stages (
        id,
        name,
        color
      ),
      image_cloud_id,
      notes,
      order_id,
      created_at,
      client_id,
      clients (
        full_name
      ),
      garment_services (
        id,
        name,
        qty,
        unit_price,
        unit,
        is_done,
        is_paid
      )
    `
    )
    .eq('user_id', userId)
    .order('due_date', { ascending: true })

  if (error) {
    throw new Error('Failed to fetch garments: ' + error.message)
  }

  // Filter garments where not all services are done
  const filteredGarments = garments.filter(garment => {
    // Exclude garments where all services are done
    const allServicesDone = garment.garment_services?.every(service => service.is_done)

    // Include garments that have at least one incomplete service
    return !allServicesDone
  })

  // Limit to the next 5 garments
  const prioritizedGarments = filteredGarments.slice(0, 5).map(garment => ({
    ...garment,
    stage_name: garment.garment_stages?.name || 'Unknown',
    stage_color: garment.garment_stages?.color,
    services: garment.garment_services || [],
    client_name: garment.clients?.full_name || 'Unknown Client'
  }))

  return prioritizedGarments
}

export async function deleteGarmentService(userId, serviceId) {
  const supabase = await getSupabaseClient()

  // Fetch the service to check `is_done` and `is_paid`
  const { data: service, error: serviceError } = await supabase
    .from('garment_services')
    .select('garment_id, is_done, is_paid')
    .eq('id', serviceId)
    .single()

  if (serviceError || !service) {
    throw new Error('Service not found.')
  }

  // Prevent deletion if `is_done` or `is_paid` is TRUE
  if (service.is_done || service.is_paid) {
    throw new Error('Cannot remove a service that is completed or paid.')
  }

  // Verify that the garment belongs to the user
  const { data: garment, error: garmentError } = await supabase
    .from('garments')
    .select('user_id')
    .eq('id', service.garment_id)
    .single()

  if (garmentError || !garment) {
    throw new Error('Garment not found.')
  }

  if (garment.user_id !== userId) {
    throw new Error('You do not have permission to delete this service.')
  }

  // Proceed to delete the service
  const { error: deleteError } = await supabase.from('garment_services').delete().eq('id', serviceId)

  if (deleteError) {
    throw new Error('Failed to delete service: ' + deleteError.message)
  }
}

export async function updateGarmentService(userId, serviceId, updatedData) {
  const supabase = await getSupabaseClient()

  // Fetch the service to check `is_done` and `is_paid`
  const { data: service, error: serviceError } = await supabase
    .from('garment_services')
    .select('garment_id, is_done, is_paid')
    .eq('id', serviceId)
    .single()

  if (serviceError || !service) {
    throw new Error('Service not found.')
  }

  // Prevent updating if `is_done` or `is_paid` is TRUE
  if (service.is_done || service.is_paid) {
    throw new Error('Cannot edit a service that is completed or paid.')
  }

  // Verify that the garment belongs to the user
  const { data: garment, error: garmentError } = await supabase
    .from('garments')
    .select('user_id')
    .eq('id', service.garment_id)
    .single()

  if (garmentError || !garment) {
    throw new Error('Garment not found.')
  }

  if (garment.user_id !== userId) {
    throw new Error('You do not have permission to edit this service.')
  }

  // Proceed to update the service
  const { error: updateError } = await supabase
    .from('garment_services')
    .update({
      name: updatedData.name,
      description: updatedData.description,
      qty: parseInt(updatedData.qty, 10),
      unit_price: parseFloat(updatedData.unit_price),
      unit: updatedData.unit
    })
    .eq('id', serviceId)

  if (updateError) {
    throw new Error('Failed to update service: ' + updateError.message)
  }
}
