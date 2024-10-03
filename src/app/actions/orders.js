'use server'

import { getSupabaseClient } from './utils'

export const getOrders = async userId => {
  const supabase = await getSupabaseClient()

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
}

export async function getOrderById(userId, orderId) {
  const supabase = await getSupabaseClient()

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
