'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { format, addDays } from 'date-fns'
import { CldImage } from 'next-cloudinary'
import { Button, Card, CardContent, Typography, Box, Chip, Grid, Paper } from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import { getOrders } from '@/app/actions/garments'

const GarmentCard = ({ garment }) => (
  <Paper
    elevation={0}
    sx={{
      display: 'flex',
      mb: 3,
      width: '100%',
      maxWidth: { xs: '100%', sm: 400 },
      border: '1px solid',
      borderColor: 'grey.200',
      borderRadius: 2,
      overflow: 'hidden'
    }}
  >
    <Box sx={{ width: 150, height: 150, flexShrink: 0 }}>
      {garment.image_cloud_id ? (
        <CldImage
          src={garment.image_cloud_id}
          alt={garment.name}
          width={150}
          height={150}
          crop='fit'
          quality='auto'
          fetchformat='auto'
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'grey.100'
          }}
        >
          <i className='ri-t-shirt-line' style={{ fontSize: '3rem', color: 'grey' }} />
        </Box>
      )}
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, flexGrow: 1 }}>
      <Typography variant='h6' sx={{ mb: 1 }}>
        {garment.name}
      </Typography>
      <Box component='ul' sx={{ pl: 2, m: 0, '& li': { mb: 0.5 } }}>
        {garment.services.map(service => (
          <Typography component='li' variant='body2' key={service.id}>
            {service.name}
          </Typography>
        ))}
      </Box>
    </Box>
  </Paper>
)

const OrderCard = ({ order }) => {
  const dueDate = addDays(new Date(order.created_at), 14)

  return (
    <Card sx={{ mb: 4, boxShadow: 2 }}>
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
          {order.garments.map(garment => (
            <Grid item xs={12} sm={6} md={4} key={garment.id}>
              <GarmentCard garment={garment} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { userId, getToken } = useAuth()

  useEffect(() => {
    async function fetchOrders() {
      if (userId) {
        try {
          setIsLoading(true)
          const token = await getToken({ template: 'supabase' })

          if (!token) throw new Error('Failed to retrieve token')
          const fetchedOrders = await getOrders(userId, token)

          setOrders(fetchedOrders)
        } catch (error) {
          console.error('Failed to fetch orders:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchOrders()
  }, [userId, getToken])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
