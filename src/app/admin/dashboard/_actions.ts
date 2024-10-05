'use server'

import { clerkClient } from '@clerk/nextjs/server'

import { checkRole } from '@/utils/roles'

export async function setRole(formData: FormData): Promise<void> {
  const id = formData.get('id')
  const role = formData.get('role')

  const response = await fetch('/api/setRole', {
    method: 'POST',
    body: JSON.stringify({ id, role }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    // Handle error
    console.error('Failed to set role')
  } else {
    // Optionally handle success
    console.log('Role set successfully')
  }
}
