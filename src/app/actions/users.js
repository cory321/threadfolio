// src/app/actions/users.js
'use server'

import { auth } from '@clerk/nextjs/server'
import { format } from 'date-fns'

import { getSupabaseClient } from './utils'

/**
 * Dismisses the onboarding process for the authenticated user.
 */
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

/**
 * Fetches the onboarding status of the authenticated user.
 *
 * @returns {boolean} - true if onboarding is completed, false otherwise.
 */
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

/**
 * Saves the business information of the authenticated user.
 *
 * @param {Object} businessInfo - The business information to save.
 * @returns {Object} - { success: true } on success or { error: string } on failure.
 */
export const saveBusinessInfo = async businessInfo => {
  const { userId } = auth()
  const supabase = await getSupabaseClient()

  if (!userId) {
    return { error: 'User not authenticated' }
  }

  const { shopName, businessPhone, addressLine1, addressLine2, city, state, postalCode, country, businessHours } =
    businessInfo

  const formattedBusinessHours = formatBusinessHours(businessHours)

  const { error } = await supabase.from('users_business').insert({
    user_id: userId,
    business_name: shopName,
    business_phone: businessPhone,
    address_line_1: addressLine1,
    address_line_2: addressLine2,
    city: city,
    state_province_region: state,
    postal_code: postalCode,
    country: country,
    business_hours: formattedBusinessHours
  })

  if (error) {
    console.error('Error saving business info:', error)

    return { error: error.message }
  }

  return { success: true }
}

/**
 * Checks if the authenticated user exists in the users_business table.
 *
 * @returns {Object} - { exists: boolean } on success or { error: string } on failure.
 */
export const checkUserBusinessExists = async () => {
  try {
    const { userId } = auth()
    const supabase = await getSupabaseClient()

    if (!userId) {
      return { error: 'User not authenticated' }
    }

    // Query the users_business table for the user_id
    const { data, error } = await supabase.from('users_business').select('user_id').eq('user_id', userId).single()

    if (error && error.code !== 'PGRST116') {
      // 'PGRST116' is Supabase's code for no rows found
      console.error('Error checking user business existence:', error)

      return { error: error.message }
    }

    // If data exists, the user has a business entry
    if (data && data.user_id) {
      return { exists: true }
    } else {
      return { exists: false }
    }
  } catch (err) {
    console.error('Unexpected error in checkUserBusinessExists:', err)

    return { error: 'An unexpected error occurred while checking business information.' }
  }
}

/**
 * Formats business hours for insertion into the database.
 *
 * @param {Array} businessHours - Array of business hours objects.
 * @returns {Object} - Formatted business hours.
 */
const formatBusinessHours = businessHours => {
  const result = {}

  businessHours.forEach(day => {
    if (day.isOpen) {
      result[day.day.toLowerCase()] = day.intervals.map(interval => {
        // Parse ISO strings back into Date objects
        const openTime = new Date(interval.openTime)
        const closeTime = new Date(interval.closeTime)

        // Format the Date objects into the desired string format
        return {
          open: format(openTime, 'h:mm a'), // e.g., "9:00 AM"
          close: format(closeTime, 'h:mm a') // e.g., "5:00 PM"
        }
      })
    } else {
      result[day.day.toLowerCase()] = 'Closed'
    }
  })

  return result
}
