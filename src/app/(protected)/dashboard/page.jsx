import { getOnboardingStatus } from '@/app/actions/users'

import DashboardContent from '@/components/dashboard/DashboardContent'

export default async function Dashboard() {
  const status = await getOnboardingStatus()
  const showOnboarding = !status

  return <DashboardContent showOnboarding={showOnboarding} />
}
