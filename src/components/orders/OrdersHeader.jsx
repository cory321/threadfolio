'use client'

import Link from 'next/link'

import { Button, Box } from '@mui/material'

import OrderCard from '@/components/orders/OrderCard'

export default function OrdersHeader({ orders }) {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
        <h1>Orders</h1>
        <Link href='/orders/create' passHref>
          <Button variant='contained' color='primary'>
            Create Order
          </Button>
        </Link>
      </Box>
      {orders.length === 0 ? <>No orders found.</> : orders.map(order => <OrderCard key={order.id} order={order} />)}
    </>
  )
}
