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

// export async function addGarment(userId, clientId, garment, token) {
//   noStore()
//   const supabase = await getSupabaseClient(token)

//   let orderId = garment.order_id

//   // Create a new garment order if orderId is not provided
//   if (!orderId) {
//     const { data: orderData, error: orderError } = await supabase
//       .from('garment_orders')
//       .insert({
//         client_id: clientId
//       })
//       .select('id')
//       .single()

//     if (orderError) {
//       throw new Error(orderError.message)
//     }

//     orderId = orderData.id
//   }

//   const { data: garmentData, error: garmentError } = await supabase
//     .from('garments')
//     .insert({
//       user_id: userId,
//       client_id: clientId,
//       name: garment.name,
//       image_cloud_id: garment.image_cloud_id,
//       stage: garment.stage,
//       notes: garment.notes,
//       due_date: garment.due_date,
//       is_event: garment.is_event,
//       event_date: garment.event_date,
//       order_id: orderId
//     })
//     .select()
//     .single()

//   if (garmentError) {
//     throw new Error(garmentError.message)
//   }

//   const garmentId = garmentData.id

//   // Update the garment services table for the garment
//   const garmentServicesInserts = garment.services.map(service => ({
//     garment_id: garmentId,
//     name: service.name,
//     description: service.description,
//     qty: service.qty,
//     unit_price: service.unit_price,
//     unit: service.unit
//   }))

//   const { data: garmentServicesData, error: garmentServicesError } = await supabase
//     .from('garment_services')
//     .insert(garmentServicesInserts)
//     .select()

//   if (garmentServicesError) {
//     throw new Error(garmentServicesError.message)

//   return {
//     order: { id: orderId },
//     garment: garmentData,
//     garmentServices: garmentServicesData
//   }
// }
