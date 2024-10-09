import { auth } from '@clerk/nextjs/server'

import HomePage from '@components/HomePage'

export default async function HomePageWrapper() {
  const { userId, getToken } = auth()
  let token = null

  if (userId) {
    try {
      token = await getToken({ template: 'supabase' })
      if (!token) throw new Error('Failed to retrieve token')
    } catch (error) {
      console.error(error)
    }
  }

  return <HomePage userId={userId} token={token} />
}
