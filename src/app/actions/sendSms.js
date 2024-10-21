'use server'

import twilio from 'twilio'

export async function sendSms(to, body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID_TEST
  const authToken = process.env.TWILIO_AUTH_TOKEN_TEST
  const from = process.env.TWILIO_PHONE_NUMBER

  const client = twilio(accountSid, authToken)

  try {
    const message = await client.messages.create({
      body,
      from,
      to
    })

    console.log(`Message sent: ${message.sid}`)

    return { success: true }
  } catch (error) {
    console.error(`Error sending SMS: ${error.message}`)

    return { success: false, error: error.message }
  }
}
