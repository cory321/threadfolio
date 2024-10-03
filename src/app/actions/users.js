// src/app/actions/users.js
'use server'

import { auth } from '@clerk/nextjs/server'

import { getSupabaseClient } from './utils'

export const dismissOnboarding = async () => {
  const { userId } = auth()
  const supabase = await getSupabaseClient()

  if (!userId) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase.from('users').update({ onboarding_completed: true }).eq('user_id', userId)

  if (error) {
    console.error('Error updating onboarding status:', error)
    throw error
  }
}

// New server action to fetch onboarding status
export const getOnboardingStatus = async () => {
  const { userId } = auth()
  const supabase = await getSupabaseClient()

  if (!userId) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase.from('users').select('onboarding_completed').eq('user_id', userId).single()

  if (error) {
    console.error('Error fetching onboarding status:', error)
    throw error
  }

  return data.onboarding_completed
}
