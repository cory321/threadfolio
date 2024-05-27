import { auth } from '@clerk/nextjs/server'

import ClientSearch from './ClientSearch'

const ClientSearchWrapper = async () => {
  const { userId } = auth()

  if (!userId) {
    return <p>You need to be signed in to search clients.</p>
  }

  return <ClientSearch userId={userId} />
}

export default ClientSearchWrapper
