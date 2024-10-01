'use server'

import { revalidateTag, unstable_cache } from 'next/cache'

import { getSupabaseClient } from './utils'

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
