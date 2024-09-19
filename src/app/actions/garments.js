'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseClient } from './utils'

export async function addGarmentsAndServicesFromContext(userId, selectedClient, garments, token) {
  noStore()
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
        unit: service.unit
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

export async function getOrders(userId, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { data: orders, error } = await supabase
    .from('garment_orders')
    .select(
      `
      id,
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
}

export async function getOrderById(userId, orderId, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { data: order, error } = await supabase
    .from('garment_orders')
    .select(
      `
      id,
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
    .eq('id', orderId)
    .single()

  if (error) {
    throw new Error('Failed to fetch order: ' + error.message)
  }

  // Process the order to calculate total price and format the data
  const processedOrder = {
    id: order.id,
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

export async function getGarments(userId, token, { page = 1, pageSize = 10, clientId = null } = {}) {
  noStore()
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
        unit
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
}

export async function getGarmentById(userId, orderId, garmentId, token) {
  const supabase = await getSupabaseClient(token)

  const { data: garment, error } = await supabase
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
        unit
      )
    `
    )
    .eq('user_id', userId)
    .eq('order_id', orderId)
    .eq('id', garmentId)
    .single()

  if (error) {
    throw new Error('Failed to fetch garment: ' + error.message)
  }

  return {
    ...garment,
    stage_name: garment.garment_stages?.name || 'Unknown',
    client: garment.clients,
    services: garment.garment_services || []
  }
}

export async function getGarmentsAndStages(userId, token) {
  noStore() // Ensure caching is disabled
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
        unit
      ),
      order_id,
      image_cloud_id,
      notes,
      due_date,
      is_event,
      event_date,
      client_id
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
    services: garment.garment_services || []
  }))

  return { garments: processedGarments, stages }
}

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
  return await updateStages(userId, stages, token, stageToDelete, reassignStageId)
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
}
