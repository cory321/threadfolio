import { fileURLToPath } from 'url'

import { dirname, join } from 'path'

import { config } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'

console.log('Environment variables:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_KEY ? '[REDACTED]' : 'undefined')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or key')
    process.exit(1)
  }

  return createClient(supabaseUrl, supabaseKey)
}

async function addClient(supabase, client) {
  const timestamp = new Date().toISOString()

  if (!client.user_id || typeof client.user_id !== 'string') {
    throw new Error('Invalid user ID.')
  }

  if (!client.full_name || typeof client.full_name !== 'string' || client.full_name.length > 100) {
    throw new Error('Full name is required and should be less than 100 characters.')
  }

  if (!client.email || typeof client.email !== 'string') {
    throw new Error('A valid email address is required.')
  }

  if (client.phone_number && typeof client.phone_number !== 'string') {
    throw new Error('A valid phone number is required.')
  }

  if (client.mailing_address && typeof client.mailing_address !== 'string') {
    throw new Error('Mailing address should be a string.')
  }

  if (client.notes && typeof client.notes !== 'string') {
    throw new Error('Notes should be a string.')
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({
      ...client,
      updated_at: timestamp
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

async function seedClients() {
  const supabase = getSupabaseClient()
  const userId = 'user_2n0KdKsdOXP6P72UmWaNxByxEDN'

  const clients = Array.from({ length: 100 }, () => ({
    user_id: userId,
    full_name: faker.person.fullName(),
    email: faker.internet.email(),
    phone_number: faker.phone.number(),
    mailing_address: faker.location.streetAddress(),
    notes: faker.lorem.sentence()
  }))

  for (const client of clients) {
    try {
      const addedClient = await addClient(supabase, client)

      console.log(`Successfully added client: ${addedClient.full_name}`)
    } catch (error) {
      console.error(`Error adding client: ${error.message}`)
    }
  }

  console.log('Seeding completed')
}

seedClients()
