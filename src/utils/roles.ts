import { auth } from '@clerk/nextjs/server'

import { Roles, UserStates } from '@/types/globals'

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth()

  return sessionClaims?.metadata.role === role
}

export const checkPaymentStatus = (status: UserStates) => {
  const { sessionClaims } = auth()

  return sessionClaims?.metadata.paymentStatus?.state === status
}
