import LandingPageWrapper from '@views/front-pages/landing-page'
import { getServerMode } from '@core/utils/serverHelpers'

export default async function HomePageWrapper() {
  const mode = getServerMode()

  return <LandingPageWrapper mode={mode} />
}
