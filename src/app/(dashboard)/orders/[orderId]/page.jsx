'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useAuth } from '@clerk/nextjs'
import { Typography, Box, CircularProgress } from '@mui/material'

import { getOrderById } from '@/app/actions/garments'
import OrderDetails from '@/components/orders/OrderDetails'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function OrderPage() {
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { orderId } = useParams()
  const { userId, getToken } = useAuth()

  useEffect(() => {
    async function fetchOrder() {
      if (userId && orderId) {
        try {
          setIsLoading(true)
          const token = await getToken({ template: 'supabase' })

          if (!token) throw new Error('Failed to retrieve token')
          const fetchedOrder = await getOrderById(userId, orderId, token)

          setOrder(fetchedOrder)
        } catch (error) {
          console.error('Failed to fetch order:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchOrder()
  }, [userId, orderId, getToken])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!order) {
    return <Typography>Order not found.</Typography>
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/orders' },
          { label: `Order #${order.id}`, href: `/orders/${order.id}` }
        ]}
      />
      <Box sx={{ mt: 2 }}>
        <OrderDetails order={order} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant='h6'>Invoicing Information</Typography>
        <Typography>
          Put invoicing information on this page, so that the garments in this order can be invoiced. We want to be able
          to add all garments in the order to an invoice with their respective services. When the services are paid, we
          can classify the garment as paid status.
        </Typography>
      </Box>
    </>
  )
}
