// src/utils/getUserAndToken.js

import { auth } from '@clerk/nextjs/server'

export async function getUserAndToken() {
  const { userId, getToken } = auth()

  if (!userId) {
    // Handle unauthenticated users
    return { userId: null, token: null }
  }

  // Obtain the token for Supabase or other services
  const token = await getToken({ template: 'supabase' })

  if (!token) {
    // Handle token retrieval failure
    return { userId, token: null }
  }

  return { userId, token }
}
