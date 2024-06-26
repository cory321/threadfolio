import React, { useContext } from 'react'

import { Grid, Button, Typography } from '@mui/material'

import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import OrderSummary from './OrderSummary'

const Step3Summary = ({ steps, handleSummarySubmit, onSubmit, handleBack }) => {
  const { orderId, selectedClient, garments } = useContext(GarmentServiceOrderContext)

  return (
    <form key={2} onSubmit={handleSummarySubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Typography variant='h6' color='textPrimary'>
            {steps[2].title}
          </Typography>
          <Typography variant='body2'>{steps[2].subtitle}</Typography>
        </Grid>
        <Grid item xs={12}>
          <OrderSummary orderId={orderId} selectedClient={selectedClient} garments={garments} />
        </Grid>
        <Grid item xs={6}>
          <Button variant='outlined' onClick={handleBack} color='secondary'>
            Back
          </Button>
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='contained' type='submit'>
            Confirm Order
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default Step3Summary
