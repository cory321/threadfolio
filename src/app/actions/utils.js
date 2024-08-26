import { createClient } from '@supabase/supabase-js'

// Function to get Supabase client
export async function getSupabaseClient(token) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
}

// Function to validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email)
}

// Function to validate phone number format
export function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/

  return phoneRegex.test(phoneNumber)
}
