import { NextResponse } from 'next/server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST() {
  try {
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

    return NextResponse.json({ account: account.id })
  } catch (error) {
    console.error('Error creating connected account:', error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
