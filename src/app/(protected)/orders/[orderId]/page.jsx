import dynamic from 'next/dynamic'

import { auth } from '@clerk/nextjs/server'

import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatOrderNumber } from '@/utils/formatOrderNumber'
import { getOrderById } from '@/app/actions/orders'

const OrderDetails = dynamic(() => import('@/components/orders/OrderDetails'), {
  ssr: false
})

const QRCodeGenerator = dynamic(() => import('@/components/orders/QRCodeGenerator'), {
  ssr: false
})

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
          {
            label: `Order #${formatOrderNumber(order.user_order_number)}`,
            href: `/orders/${order.id}`
          }
        ]}
      />
      <OrderDetails order={order} />

      {/* Include the QRCodeGenerator client component */}
      <QRCodeGenerator orderId={order.id} />
    </>
  )
}
