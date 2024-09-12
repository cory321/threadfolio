import React from 'react'

import { Typography, Box, Paper, Grid } from '@mui/material'
import { format } from 'date-fns'

import OrderGarmentCard from '@/components/orders/OrderGarmentCard'

const OrderDetails = ({ order }) => {
  return (
    <Box>
      <Typography variant='h4' gutterBottom>
        Order #{order.id}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Client:</strong> {order.client_name}
            </Typography>
            <Typography>
              <strong>Order Date:</strong> {format(new Date(order.created_at), 'PP')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Total Price:</strong> ${order.total_price.toFixed(2)}
            </Typography>
            <Typography>
              <strong>Status:</strong> {order.status || 'In Progress'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Typography variant='h5' gutterBottom>
        Garments
      </Typography>
      <Grid container spacing={2}>
        {order.garments.map(garment => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={garment.id}>
            <OrderGarmentCard garment={garment} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default OrderDetails
