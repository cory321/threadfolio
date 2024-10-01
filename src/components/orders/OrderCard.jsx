// src/components/orders/OrderCard.jsx

'use client'

import Link from 'next/link'

import { Card, CardContent, Typography, Chip, Grid } from '@mui/material'
import { format, addDays } from 'date-fns'

import OrderGarmentCard from '@/components/orders/OrderGarmentCard'
import { formatOrderNumber } from '@/utils/formatOrderNumber'

const OrderCard = ({ order }) => {
  const dueDate = addDays(new Date(order.created_at), 14)

  return (
    <Link href={`/orders/${order.id}`}>
      <Card
        sx={{
          mb: 4,
          boxShadow: 2,
          cursor: 'pointer',
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: 6 }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                #{formatOrderNumber(order.user_order_number)}
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

export default OrderCard
