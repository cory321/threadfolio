import FinancePageClient from './FinancePageClient.jsx'
import { getStripeAccountId } from '@/app/actions/users'

export default async function FinancePage() {
  const stripeAccountId = await getStripeAccountId()

  return <FinancePageClient initialStripeAccountId={stripeAccountId} />
}
