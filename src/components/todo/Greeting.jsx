'use client'

import { useUser } from '@clerk/nextjs'

import { getGreeting } from '@/utils/greetings'
import { getFormattedDate } from '@/utils/formatDate'

const Greeting = () => {
  const { user } = useUser()
  const greeting = getGreeting()
  const formattedDate = getFormattedDate()

  return (
    <>
      <p>{formattedDate}</p>
      <h1>
        {greeting}, {user?.firstName}
      </h1>
    </>
  )
}

export default Greeting
