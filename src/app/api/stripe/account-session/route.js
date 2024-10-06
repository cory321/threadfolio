import { NextResponse } from 'next/server'

import Stripe from 'stripe'
import { auth } from '@clerk/nextjs/server'

import { getSupabaseClient } from '@/app/actions/utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    // Authenticate the user
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Initialize Supabase client
    const supabase = await getSupabaseClient()

    // Retrieve the stripe_account_id from the Supabase users table
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('stripe_account_id')
      .eq('user_id', userId)
      .single()

    if (userError) {
      console.error('Error fetching user record:', userError)

      return NextResponse.json({ error: 'Failed to retrieve user data' }, { status: 500 })
    }

    let stripeAccountId = userRecord?.stripe_account_id

    if (!stripeAccountId) {
      // If no Stripe account exists, create a new connected account
      const account = await stripe.accounts.create({
        controller: {
          stripe_dashboard: {
            type: 'none'
          },
          fees: {
            payer: 'application'
          },
          losses: {
            payments: 'application'
          },
          requirement_collection: 'application'
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        },
        country: 'US'
      })

      stripeAccountId = account.id

      // Save the new stripe_account_id to the Supabase users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ stripe_account_id: stripeAccountId })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating user record with Stripe account ID:', updateError)

        return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 })
      }
    }

    // Create an Account Session with the account_onboarding component enabled
    const accountSession = await stripe.accountSessions.create({
      account: stripeAccountId,
      components: {
        account_onboarding: { enabled: true }
      }
    })

    return NextResponse.json({ client_secret: accountSession.client_secret })
  } catch (error) {
    console.error('Error creating account session:', error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
