// src/app/actions/users.js
'use server'

import { auth } from '@clerk/nextjs/server'

import { format } from 'date-fns' // Ensure format is imported

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

export const saveBusinessInfo = async businessInfo => {
  const { userId } = auth()
  const supabase = await getSupabaseClient()

  if (!userId) {
    throw new Error('User not authenticated')
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
    throw error
  }
}

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
