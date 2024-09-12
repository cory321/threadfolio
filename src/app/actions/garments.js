'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseClient } from './utils'

export async function addGarmentsAndServicesFromContext(userId, selectedClient, garments, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

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
          stage: garment.stage || 'new',
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
        stage,
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
      stage: garment.stage,
      image_cloud_id: garment.image_cloud_id, // Include image_cloud_id here
      services: garment.garment_services,
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
        stage,
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
      stage: garment.stage,
      image_cloud_id: garment.image_cloud_id,
      services: garment.garment_services,
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
      stage,
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

  const {
    data: garments,
    error,
    count
  } = await query.range((page - 1) * pageSize, page * pageSize - 1).order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch garments: ' + error.message)
  }

  // Process the garments to calculate total price and format the data
  const processedGarments = garments.map(garment => ({
    id: garment.id,
    name: garment.name,
    stage: garment.stage,
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

  return {
    garments: processedGarments,
    totalCount: count,
    page,
    pageSize
  }
}

export async function getGarmentById(userId, orderId, garmentId, token) {
  noStore()
  const supabase = await getSupabaseClient(token)

  const { data: garment, error } = await supabase
    .from('garments')
    .select(
      `
      id,
      name,
      stage,
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
    client: garment.clients,
    services: garment.garment_services
  }
}
