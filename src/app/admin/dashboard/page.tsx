import { redirect } from 'next/navigation'

import { clerkClient } from '@clerk/nextjs/server'

import { checkRole } from '@/utils/roles'
import UserList from './UserList'

export default async function AdminDashboard() {
  if (!checkRole('admin')) {
    redirect('/')

    return null
  }

  let users = []

  try {
    const response = await clerkClient.users.getUserList({})

    if (response && Array.isArray(response.data)) {
      users = response.data.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        primaryEmailAddressId: user.primaryEmailAddressId,
        emailAddresses: user.emailAddresses.map(email => ({
          id: email.id,
          emailAddress: email.emailAddress
        })),
        publicMetadata: user.publicMetadata
      }))
    } else {
      console.error('Unexpected response format:', response)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    users = []
  }

  return (
    <>
      <h1>This is the admin dashboard</h1>
      <p>This page is restricted to users with the admin role.</p>

      <UserList users={users} />
    </>
  )
}
