import dynamic from 'next/dynamic'

const OrderDetails = dynamic(
  () =>
    import('@/components/orders/OrderDetails').catch(err => {
      console.error('Failed to load OrderDetails component:', err)

      return () => <p>Failed to load component</p>
    }),
  {
    loading: () => <p>Loading...</p>
  }
)

import { auth } from '@clerk/nextjs/server'

import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatOrderNumber } from '@/utils/formatOrderNumber'
import { getOrderById } from '@/app/actions/orders'

export default async function OrderViewPage({ params }) {
  const { userId } = auth()
  const { orderId } = params

  let order = null

  try {
    order = await getOrderById(userId, orderId)

    if (!order) {
      return <>Order not found.</>
    }
  } catch (error) {
    console.error('Failed to fetch order:', error)

    return <>Error loading order. Please try again later.</>
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/orders' },
          { label: `Order #${formatOrderNumber(order.user_order_number)}`, href: `/orders/${order.id}` }
        ]}
      />
      <OrderDetails order={order} />
    </>
  )
}
