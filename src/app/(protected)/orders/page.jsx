import { auth } from '@clerk/nextjs/server'

import { getOrders } from '@/app/actions/orders'
import OrdersPage from '@/components/orders/OrdersPage'

export const metadata = {
  title: 'Orders - Threadfolio'
}

export default async function Orders() {
  const { userId } = auth()

  let orders = []

  try {
    orders = await getOrders(userId)
  } catch (error) {
    console.error('Failed to fetch orders:', error)

    return <div>Error loading orders. Please try again later.</div>
  }

  return <OrdersPage orders={orders} />
}
