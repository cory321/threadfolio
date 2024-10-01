import { getOrders } from '@/app/actions/orders'
import { getUserAndToken } from '@/utils/getUserAndToken'
import OrdersPage from '@/components/orders/OrdersPage'

export default async function Orders() {
  const { userId, token } = await getUserAndToken()

  let orders = []

  try {
    orders = await getOrders(userId, token)
  } catch (error) {
    console.error('Failed to fetch orders:', error)

    return <div>Error loading orders. Please try again later.</div>
  }

  return <OrdersPage orders={orders} />
}
