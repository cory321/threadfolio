import { getAuth } from '@clerk/nextjs/server'

import ClientSearch from './ClientSearch'

const ClientSearchWrapper = async () => {
  const { session } = await getAuth()
  const userId = session?.user?.id
  const token = await session?.getToken()

  return <ClientSearch userId={userId} token={token} />
}

export default ClientSearchWrapper
