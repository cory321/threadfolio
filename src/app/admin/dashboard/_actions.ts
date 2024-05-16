'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { clerkClient } from '@clerk/nextjs/server'

import { checkRole } from '@/utils/roles'
import { UserStates, UserPaymentDetails } from '@/types/globals'

export async function setRole(formData: FormData) {
  noStore()

  if (!checkRole('admin')) {
    return { message: 'Not Authorized' }
  }

  try {
    const userId = formData.get('id') as string
    const newRole = formData.get('role') as string

    const user = await clerkClient.users.getUser(userId)
    const currentPaymentStatus = user.publicMetadata.paymentStatus

    const updatedUser = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        role: newRole,
        paymentStatus: currentPaymentStatus
      }
    })

    console.log('Updated Metadata:', updatedUser.publicMetadata)

    return { message: updatedUser.publicMetadata }
  } catch (err) {
    console.log('Error:', err)

    return { message: err.message || 'An error occurred' }
  }
}

export async function setPaymentStatus(userId: string, status: UserStates, details?: UserPaymentDetails) {
  noStore()

  try {
    const user = await clerkClient.users.getUser(userId)
    const currentRole = user.publicMetadata.role
    const existingPaymentStatus = user.publicMetadata.paymentStatus || { state: '', details: {} }
    const newDetails = { ...existingPaymentStatus.details, ...details }

    const updatedUser = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        role: currentRole,
        paymentStatus: {
          state: status,
          details: newDetails
        }
      }
    })

    console.log('Updated Metadata:', updatedUser.publicMetadata)

    return { message: updatedUser.publicMetadata }
  } catch (err) {
    console.log('Error:', err)

    return { message: err.message || 'An error occurred' }
  }
}
