import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

// Function to get Supabase client
export async function getSupabaseClient() {
  const { getToken } = auth()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: async (url, options = {}) => {
        const clerkToken = await getToken({ template: 'supabase' })

        const headers = new Headers(options?.headers)

        headers.set('Authorization', `Bearer ${clerkToken}`)

        return fetch(url, {
          ...options,
          headers
        })
      }
    }
  })

  return supabase
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
