'use server'

import { revalidateTag, unstable_cache } from 'next/cache'

import { getSupabaseClient } from './utils'

export async function addGarmentsAndServicesFromContext(userId, selectedClient, garments, token) {
  const supabase = await getSupabaseClient(token)

  // Fetch the stage at position 1
  const { data: defaultStage, error: defaultStageError } = await supabase
    .from('garment_stages')
    .select('id')
    .eq('user_id', userId)
    .eq('position', 1)
    .single()

  if (defaultStageError || !defaultStage) {
    throw new Error('Failed to fetch default stage: ' + (defaultStageError?.message || 'Stage not found'))
  }

  const defaultStageId = defaultStage.id

  // Create a new garment order
  const { data: orderData, error: orderError } = await supabase
    .from('garment_orders')
    .insert({
      user_id: userId,
      client_id: selectedClient.id
    })
    .select('id')
    .single()

  if (orderError) {
    throw new Error(orderError.message)
  }

  const orderId = orderData.id

  // Add each garment and its services
  const results = await Promise.all(
    garments.map(async garment => {
      // Insert garment
      const { data: garmentData, error: garmentError } = await supabase
        .from('garments')
        .insert({
          user_id: userId,
          client_id: selectedClient.id,
          name: garment.name,
          image_cloud_id: garment.image_cloud_id,
          stage_id: defaultStageId, // Use the stage at position 1
          notes: garment.notes,
          due_date: garment.due_date,
          is_event: garment.is_event,
          event_date: garment.event_date,
          order_id: orderId
        })
        .select()
        .single()

      if (garmentError) {
        throw new Error(garmentError.message)
      }

      const garmentId = garmentData.id

      // Insert garment services
      const garmentServicesInserts = garment.services.map(service => ({
        garment_id: garmentId,
        name: service.name,
        description: service.description,
        qty: service.qty,
        unit_price: service.unit_price,
        unit: service.unit,
        is_paid: service.is_paid || false
      }))

      const { data: garmentServicesData, error: garmentServicesError } = await supabase
        .from('garment_services')
        .insert(garmentServicesInserts)
        .select()

      if (garmentServicesError) {
        throw new Error(garmentServicesError.message)
      }

      return {
        garment: garmentData,
        garmentServices: garmentServicesData
      }
    })
  )

  return {
    order: { id: orderId },
    garments: results
  }
}

export const getOrders = unstable_cache(
  async (userId, token) => {
    const supabase = await getSupabaseClient(token)

    const { data: orders, error } = await supabase
      .from('garment_orders')
      .select(
        `
        id,
        user_order_number,
        created_at,
        client_id,
        clients (
          full_name
        ),
        garments (
          id,
          name,
          stage_id,
          garment_stages (
            id,
            name
          ),
          image_cloud_id,
          garment_services (
            id,
            name,
            qty,
            unit_price,
            unit
          )
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Failed to fetch orders: ' + error.message)
    }

    // Process the orders to calculate total price and format the data
    const processedOrders = orders.map(order => ({
      id: order.id,
      user_order_number: order.user_order_number,
      created_at: order.created_at,
      client_id: order.client_id,
      client_name: order.clients?.full_name || 'Unknown',
      garments: order.garments.map(garment => ({
        id: garment.id,
        name: garment.name,
        stage_id: garment.stage_id,
        stage_name: garment.garment_stages?.name || 'Unknown',
        image_cloud_id: garment.image_cloud_id,
        services: garment.garment_services || [],
        total_price: garment.garment_services.reduce((sum, service) => sum + service.qty * service.unit_price, 0)
      })),
      total_price: order.garments.reduce(
        (sum, garment) =>
          sum +
          garment.garment_services.reduce((serviceSum, service) => serviceSum + service.qty * service.unit_price, 0),
        0
      )
    }))

    return processedOrders
  },
  {
    revalidate: 10800, // Revalidate every 3 hours
    tags: ['orders']
  }
)

export async function getOrderById(userId, orderId, token) {
  const supabase = await getSupabaseClient(token)

  const { data: order, error } = await supabase
    .from('garment_orders')
    .select(
      `
      id,
      user_order_number,
      created_at,
      client_id,
      clients (
        full_name
      ),
      garments (
        id,
        name,
        stage_id,
        garment_stages (
          id,
          name
        ),
        image_cloud_id,
        garment_services (
          id,
          name,
          qty,
          unit_price,
          unit,
          is_paid
        )
      )
    `
    )
    .eq('user_id', userId)
    .eq('id', orderId)
    .single()

  if (error) {
    throw new Error('Failed to fetch order: ' + error.message)
  }

  // Process the order to calculate total price and format the data
  const processedOrder = {
    id: order.id,
    user_order_number: order.user_order_number,
    created_at: order.created_at,
    client_id: order.client_id,
    client_name: order.clients?.full_name || 'Unknown',
    garments: order.garments.map(garment => ({
      id: garment.id,
      name: garment.name,
      stage_id: garment.stage_id,
      stage_name: garment.garment_stages?.name || 'Unknown',
      image_cloud_id: garment.image_cloud_id,
      services: garment.garment_services || [],
      total_price: garment.garment_services.reduce((sum, service) => sum + service.qty * service.unit_price, 0)
    })),
    total_price: order.garments.reduce(
      (sum, garment) =>
        sum +
        garment.garment_services.reduce((serviceSum, service) => serviceSum + service.qty * service.unit_price, 0),
      0
    )
  }

  return processedOrder
}

export const getGarments = unstable_cache(
  async (userId, token, { page = 1, pageSize = 10, clientId = null } = {}) => {
    const supabase = await getSupabaseClient(token)

    let query = supabase
      .from('garments')
      .select(
        `
        id,
        name,
        stage_id,
        garment_stages (
          id,
          name
        ),
        image_cloud_id,
        notes,
        due_date,
        is_event,
        event_date,
        order_id,
        created_at,
        client_id,
        clients (
          id,
          full_name,
          email,
          phone_number
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
      .order('created_at', { ascending: false })

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data: garments, error } = await query.range((page - 1) * pageSize, page * pageSize - 1)

    if (error) {
      throw new Error('Failed to fetch garments: ' + error.message)
    }

    // Process the garments to calculate total price and format the data
    const processedGarments = garments.map(garment => ({
      id: garment.id,
      name: garment.name,
      stage_id: garment.stage_id,
      stage_name: garment.garment_stages?.name || 'Unknown',
      image_cloud_id: garment.image_cloud_id,
      notes: garment.notes,
      due_date: garment.due_date,
      is_event: garment.is_event,
      event_date: garment.event_date,
      order_id: garment.order_id,
      created_at: garment.created_at,
      client: {
        id: garment.clients.id,
        full_name: garment.clients.full_name,
        email: garment.clients.email,
        phone_number: garment.clients.phone_number
      },
      services: garment.garment_services,
      total_price: garment.garment_services.reduce((sum, service) => sum + service.qty * service.unit_price, 0)
    }))

    return processedGarments
  },
  {
    revalidate: 10800, // Revalidate every 3 hours
    tags: ['garments']
  }
)

export const getGarmentById = unstable_cache(
  async (userId, orderId, garmentId, token) => {
    const supabase = await getSupabaseClient(token)

    const { data, error } = await supabase
      .from('garments')
      .select(
        `
        id,
        name,
        stage_id,
        image_cloud_id,
        notes,
        due_date,
        is_event,
        event_date,
        garment_stages(name),
        clients(id, email, full_name, phone_number),
        garment_services(*),
        garment_orders(user_order_number)
      `
      )
      .eq('user_id', userId)
      .eq('order_id', orderId)
      .eq('id', garmentId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Construct the garment object without client_id
    const garment = {
      id: data.id,
      name: data.name,
      stage_id: data.stage_id,
      stage_name: data.garment_stages.name,
      image_cloud_id: data.image_cloud_id,
      notes: data.notes,
      due_date: data.due_date,
      is_event: data.is_event,
      event_date: data.event_date,
      client: data.clients,
      services: data.garment_services,
      user_order_number: data.garment_orders.user_order_number
    }

    return garment
  },
  {
    revalidate: 10800,
    tags: [`garments`]
  }
)

// Wrap your function with unstable_cache
export const getGarmentsAndStages = unstable_cache(
  async (userId, token) => {
    const supabase = await getSupabaseClient(token)

    // Fetch garments with their associated data
    const { data: garments, error: garmentsError } = await supabase
      .from('garments')
      .select(
        `
        id,
        name,
        stage_id,
        garment_stages ( id, name ),
        garment_services (
          id,
          name,
          qty,
          unit_price,
          unit,
          is_done,
          is_paid
        ),
        order_id,
        image_cloud_id,
        notes,
        due_date,
        created_at,
        is_event,
        event_date,
        client_id,
        clients (
          full_name
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (garmentsError) {
      throw new Error('Failed to fetch garments: ' + garmentsError.message)
    }

    // Fetch stages
    const { data: stages, error: stagesError } = await supabase
      .from('garment_stages')
      .select('*')
      .eq('user_id', userId)
      .order('position')

    if (stagesError) {
      throw new Error('Failed to fetch stages: ' + stagesError.message)
    }

    // Process garments to include stage names and services
    const processedGarments = garments.map(garment => ({
      ...garment,
      stage_name: garment.garment_stages?.name || 'Unknown',
      services: garment.garment_services || [],
      client_name: garment.clients?.full_name || 'Unknown Client'
    }))

    return { garments: processedGarments, stages }
  },

  // Cache options
  {
    revalidate: 10800,
    tags: ['garments', 'stages']
  }
)

export async function getStages(userId, token) {
  const supabase = await getSupabaseClient(token)

  const { data: stages, error } = await supabase
    .from('garment_stages')
    .select('*')
    .eq('user_id', userId)
    .order('position')

  if (error) {
    throw new Error('Failed to fetch stages: ' + error.message)
  }

  return stages
}

export async function updateStages(userId, stages, token, stageToDeleteId = null, reassignStageId = null) {
  const supabase = await getSupabaseClient(token)

  // Fetch the stage to delete if needed
  let stageToDelete = null

  if (stageToDeleteId) {
    const { data, error } = await supabase.from('garment_stages').select('*').eq('id', stageToDeleteId).single()

    if (error) {
      throw new Error('Failed to fetch stage to delete: ' + error.message)
    }

    stageToDelete = data
  }

  // Validate all stage names are non-empty
  const invalidStages = stages.filter(stage => !stage.name || stage.name.trim() === '')

  if (invalidStages.length > 0) {
    throw new Error('Stage names cannot be empty.')
  }

  // Prevent deleting the last remaining stage
  if (stageToDelete && stages.length === 0) {
    throw new Error('Cannot delete the last remaining stage.')
  }

  // If a stage is to be deleted and reassigned
  if (stageToDelete && reassignStageId) {
    console.log(`Reassigning garments from stage ID ${stageToDelete.id} to stage ID ${reassignStageId}`)

    // Reassign garments from the stage to be deleted
    const { error: updateError } = await supabase
      .from('garments')
      .update({ stage_id: reassignStageId })
      .eq('stage_id', stageToDelete.id)

    if (updateError) {
      console.error('Reassign Error:', updateError)
      throw new Error('Failed to reassign garments: ' + updateError.message)
    }

    console.log('Garments reassigned successfully.')

    // Delete the stage after garments have been reassigned
    const { error: deleteError } = await supabase.from('garment_stages').delete().eq('id', stageToDelete.id)

    if (deleteError) {
      console.error('Delete Error:', deleteError)
      throw new Error('Failed to delete stage: ' + deleteError.message)
    }

    console.log(`Stage ID ${stageToDelete.id} deleted successfully.`)
  }

  // Update existing stages and insert new ones
  for (const stage of stages) {
    console.log('Processing stage:', stage)

    if (stage.id) {
      // Update existing stage
      const { error } = await supabase
        .from('garment_stages')
        .update({ name: stage.name.trim(), position: stage.position, color: stage.color })
        .eq('id', stage.id)

      if (error) {
        console.error('Update Error:', error)
        throw new Error('Failed to update stage: ' + error.message)
      }

      console.log(`Stage ID ${stage.id} updated successfully.`)
    } else {
      // Insert new stage
      const { data: insertData, error } = await supabase
        .from('garment_stages')
        .insert({ user_id: userId, name: stage.name.trim(), position: stage.position, color: stage.color })
        .select()
        .single()

      if (error) {
        console.error('Insert Error:', error)
        throw new Error('Failed to insert stage: ' + error.message)
      }

      if (!insertData) {
        throw new Error('InsertData is undefined after inserting a new stage.')
      }

      // Update the stage in the local array with the new ID
      stage.id = insertData.id

      console.log(`New stage "${stage.name}" inserted successfully.`)
    }
  }

  // Before the fetch of updated stages
  for (const stage of stages) {
    if (typeof stage.position !== 'number' || isNaN(stage.position)) {
      console.error('Invalid position for stage:', stage)
      throw new Error('All stages must have a valid position.')
    }
  }

  // Fetch the updated list of stages
  const { data: updatedStages, error: fetchError } = await supabase
    .from('garment_stages')
    .select('*')
    .eq('user_id', userId)
    .order('position')

  if (fetchError) {
    console.error('Fetch Error:', fetchError)
    throw new Error('Failed to fetch updated stages: ' + fetchError.message)
  }

  revalidateTag(['stages'])

  return updatedStages
}

export async function customizeStages(userId, stages, token, stageToDeleteId, reassignStageId) {
  const supabase = await getSupabaseClient(token)

  // Fetch the stage to delete
  const { data: stageToDelete, error: fetchError } = await supabase
    .from('garment_stages')
    .select('*')
    .eq('id', stageToDeleteId)
    .single()

  if (fetchError) {
    throw new Error('Failed to fetch stage to delete: ' + fetchError.message)
  }

  // Update stages with reassignment
  const updatedStages = await updateStages(userId, stages, token, stageToDelete, reassignStageId)

  // After successfully customizing stages, invalidate the stages cache for the user
  revalidateTag(`stages-${userId}`)

  return updatedStages
}

export async function initializeDefaultStages(userId, token) {
  const supabase = await getSupabaseClient(token)

  const defaultStages = [
    { user_id: userId, name: 'Not Started', position: 1, color: '#FF5733' },
    { user_id: userId, name: 'In Progress', position: 2, color: '#33FF57' },
    { user_id: userId, name: 'Ready for Pickup', position: 3, color: '#5733FF' },
    { user_id: userId, name: 'Stuck', position: 4, color: '#FF3333' },
    { user_id: userId, name: 'Archived', position: 5, color: '#333333' }
  ]

  const { error } = await supabase.from('garment_stages').insert(defaultStages)

  if (error) {
    throw new Error('Failed to initialize default stages: ' + error.message)
  }
}

export async function updateGarmentStage(userId, garmentId, newStageId, token) {
  const supabase = await getSupabaseClient(token)

  const { error } = await supabase
    .from('garments')
    .update({ stage_id: newStageId })
    .eq('user_id', userId)
    .eq('id', garmentId)

  if (error) {
    throw new Error('Failed to update garment stage: ' + error.message)
  }

  // Invalidate the cache for this specific garment
  revalidateTag(`garment-${garmentId}`)
}

export async function updateServiceDoneStatus(userId, serviceId, isDone, token) {
  const supabase = await getSupabaseClient(token)

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

  revalidateTag(`service-${serviceId}`)
}

export async function addGarmentService(userId, serviceData, token) {
  const supabase = await getSupabaseClient(token)

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
    throw new Error('Failed to add service: ' + insertError.message)
  }

  // Invalidate caches tagged with 'garments' and 'services'
  revalidateTag('garments')
  revalidateTag('services')

  return newService
}

export async function getPrioritizedGarments(userId, token) {
  const supabase = await getSupabaseClient(token)

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

export async function deleteGarmentService(userId, serviceId, token) {
  const supabase = await getSupabaseClient(token)

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

  revalidateTag(`service-${serviceId}`)
}

export async function updateGarmentService(userId, serviceId, updatedData, token) {
  const supabase = await getSupabaseClient(token)

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

  revalidateTag(`service-${serviceId}`)
}

// Function to create a new time entry
export async function addTimeEntry(userId, serviceId, minutes, token) {
  const supabase = await getSupabaseClient(token)

  const { data, error } = await supabase.from('garment_service_time_entries').insert({
    user_id: userId,
    service_id: serviceId,
    minutes
  })

  if (error) {
    throw new Error('Failed to add time entry: ' + error.message)
  }

  revalidateTag(`service-${serviceId}`)

  return data
}

// Function to fetch total time logged for a garment
export async function getTotalTimeForGarment(userId, garmentId, token) {
  const supabase = await getSupabaseClient(token)

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
export async function getTimeEntriesForGarment(userId, garmentId, token) {
  const supabase = await getSupabaseClient(token)

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
    .order('logged_at', { ascending: false })

  if (timeEntriesError) {
    throw new Error('Failed to fetch time entries: ' + timeEntriesError.message)
  }

  return timeEntries
}

export async function getTimeEntriesGroupedByServiceForGarment(userId, garmentId, token) {
  const supabase = await getSupabaseClient(token)

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
