'use client'

import { useEffect, useState, useTransition } from 'react'

import Link from 'next/link'

import { format, addDays } from 'date-fns'
import { Button, Card, CardContent, Typography, Box, Chip, Grid, CircularProgress } from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import { getOrders } from '@/app/actions/garments'
import OrderGarmentCard from '@/components/orders/OrderGarmentCard'

const OrderCard = ({ order }) => {
  const dueDate = addDays(new Date(order.created_at), 14)

  return (
    <Link href={`/orders/${order.id}`} passHref prefetch={true} style={{ textDecoration: 'none' }}>
      <Card sx={{ mb: 4, boxShadow: 2, cursor: 'pointer', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                #{order.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='body1'>{order.client_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant='body2'>{order.garments.length} items</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant='body1'>${order.total_price.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Chip label='Unpaid' color='warning' variant='outlined' size='small' />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Typography variant='body2'>{format(dueDate, 'MM/dd/yyyy')}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {order.garments.slice(0, 4).map(garment => (
              <Grid item xs={6} sm={3} key={garment.id}>
                <OrderGarmentCard garment={garment} />
              </Grid>
            ))}
            {order.garments.length > 4 && (
              <Grid item xs={12}>
                <Typography variant='body2' color='text.secondary'>
                  +{order.garments.length - 4} more garments
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { userId, getToken } = useAuth()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function fetchOrders() {
      if (userId) {
        try {
          setIsLoading(true)
          const token = await getToken({ template: 'supabase' })

          if (!token) throw new Error('Failed to retrieve token')
          const fetchedOrders = await getOrders(userId, token)

          startTransition(() => {
            setOrders(fetchedOrders)
            setIsLoading(false)
          })
        } catch (error) {
          console.error('Failed to fetch orders:', error)
          setIsLoading(false)
        }
      }
    }

    fetchOrders()
  }, [userId, getToken])

  const renderContent = () => {
    if (isLoading || isPending) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      )
    }

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
        {orders.length === 0 ? (
          <Typography>No orders found.</Typography>
        ) : (
          orders.map(order => <OrderCard key={order.id} order={order} />)
        )}
      </>
    )
  }

  return <>{renderContent()}</>
}
