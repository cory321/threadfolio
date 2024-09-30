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

import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatOrderNumber } from '@/utils/formatOrderNumber'
import { getUserAndToken } from '@/utils/getUserAndToken'
import { getOrderById } from '@/app/actions/garments'

export default async function OrderPage({ params }) {
  const { orderId } = params
  const { userId, token } = await getUserAndToken()

  if (!userId) {
    return <div>You must be logged in to view this page.</div>
  }

  if (!token) {
    return <div>Failed to retrieve token.</div>
  }

  let order = null

  try {
    order = await getOrderById(userId, orderId, token)

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
