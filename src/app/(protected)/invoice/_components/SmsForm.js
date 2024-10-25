'use client'

import { useState } from 'react'

import { sendSms } from '@/app/actions/sendSms'

export default function SmsForm() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    const result = await sendSms(phoneNumber, message)

    setStatus(result)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Phone Number:</label>
        <input
          type='tel'
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          placeholder='+1234567890'
          required
        />
      </div>
      <div>
        <label>Message:</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder='Your message here...'
          required
        ></textarea>
      </div>
      <button type='submit'>Send SMS</button>
      {status && status.success && <p>Message sent successfully!</p>}
      {status && status.error && <p>Error: {status.error}</p>}
    </form>
  )
}
