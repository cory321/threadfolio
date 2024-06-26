'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { clerkClient } from '@clerk/nextjs/server'

import { checkRole } from '@/utils/roles'

export async function setRole(formData: FormData) {
  noStore()

  if (!checkRole('admin')) {
    return { message: 'Not Authorized' }
  }

  try {
    const res = await clerkClient.users.updateUser(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') }
    })

    return { message: res.publicMetadata }
  } catch (err) {
    return { message: err }
  }
}
