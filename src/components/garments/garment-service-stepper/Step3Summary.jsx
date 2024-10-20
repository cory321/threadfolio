import React, { useContext, useState } from 'react'

import { Grid, Button, Typography, CircularProgress } from '@mui/material'

import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import OrderSummary from './OrderSummary'

const Step3Summary = ({ steps, handleSummarySubmit, onSubmit, handleBack }) => {
  const { orderId, selectedClient, garments } = useContext(GarmentServiceOrderContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConfirmOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await handleSummarySubmit()

      // Additional success actions...
    } catch (e) {
      console.error('Error confirming order:', e)
      setError(e.message || 'An error occurred while confirming the order.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant='h6' color='textPrimary'>
          {steps[2].title}
        </Typography>
        <Typography variant='body2'>{steps[2].subtitle}</Typography>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Typography variant='body2' color='error'>
            {error}
          </Typography>
        </Grid>
      )}

      <Grid item xs={12}>
        <OrderSummary orderId={orderId} selectedClient={selectedClient} garments={garments} />
      </Grid>

      <Grid item xs={6}>
        <Button variant='outlined' onClick={handleBack} color='secondary'>
          Back
        </Button>
      </Grid>
      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='contained' onClick={handleConfirmOrder} disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={24} color='inherit' />
              &nbsp;Confirming...
            </>
          ) : (
            'Confirm Order'
          )}
        </Button>
      </Grid>
    </Grid>
  )
}

export default Step3Summary
