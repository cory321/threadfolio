import { getOrders } from '@/app/actions/garments'
import { getUserAndToken } from '@/utils/getUserAndToken'
import OrdersPageContent from '@/components/orders/OrdersHeader'

export default async function OrdersPage() {
  const { userId, token } = await getUserAndToken()

  if (!userId) {
    return <div>You must be logged in to view this page.</div>
  }

  if (!token) {
    return <div>Failed to retrieve token.</div>
  }

  let orders = []

  try {
    orders = await getOrders(userId, token)
  } catch (error) {
    console.error('Failed to fetch orders:', error)

    return <div>Error loading orders. Please try again later.</div>
  }

  return <OrdersPageContent orders={orders} />
}
