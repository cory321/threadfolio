'use server'

import { revalidateTag, unstable_cache } from 'next/cache'

import { getSupabaseClient } from './utils'

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
