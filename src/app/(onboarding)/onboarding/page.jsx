import { currentUser } from '@clerk/nextjs/server'

import OnboardingView from '@views/OnboardingView'
import { getMode } from '@core/utils/serverHelpers'

const mode = getMode()

export default async function OnboardingPage() {
  const user = await currentUser()

  if (!user) {
    return <div>Not signed in</div>
  }

  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress || '',
    phone: user.phoneNumbers[0]?.phoneNumber || ''
  }

  return <OnboardingView mode={mode} userData={userData} />
}
