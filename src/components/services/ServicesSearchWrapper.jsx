import { auth } from '@clerk/nextjs/server'

import ServicesSearch from './ServicesSearch'

const ServicesSearchWrapper = async () => {
  const { userId } = auth()

  if (!userId) {
    return <p>You need to be signed in to search services.</p>
  }

  return <ServicesSearch userId={userId} />
}

export default ServicesSearchWrapper
