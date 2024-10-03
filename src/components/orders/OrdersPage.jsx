import dynamic from 'next/dynamic'

const OrdersHeader = dynamic(() => import('@/components/orders/OrdersHeader'))
const OrderCard = dynamic(() => import('@/components/orders/OrderCard'))

export default function OrdersPage({ orders }) {
  return (
    <>
      <OrdersHeader />
      {orders.length === 0 ? <>No orders found.</> : orders.map(order => <OrderCard key={order.id} order={order} />)}
    </>
  )
}
