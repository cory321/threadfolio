import React, { useContext, useState } from 'react'

import { createRoot } from 'react-dom/client'
import { Grid, Button, Typography, CircularProgress } from '@mui/material'

import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import OrderSummary from './OrderSummary'
import PrintableInvoice from './PrintableInvoice'

const Step3Summary = ({ steps, handleSummarySubmit, onSubmit, handleBack }) => {
  const { orderId, selectedClient, garments } = useContext(GarmentServiceOrderContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')

    printWindow.document.write('<html><head><title>Invoice</title>')

    // Add print-specific styles
    printWindow.document.write(`
      <style>
        body { font-family: Arial, sans-serif; }
        .printable-invoice { padding: 20px; }
        .client-info { margin-bottom: 20px; }
        .garment-section { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .total { margin-top: 20px; }
        @media print {
          button { display: none; }
        }
      </style>
    `)

    printWindow.document.write('</head><body>')
    printWindow.document.write('<div id="printable-content"></div>')
    printWindow.document.close()

    const content = printWindow.document.getElementById('printable-content')

    // Use createRoot to render the component
    const root = createRoot(content)

    root.render(<PrintableInvoice orderId={orderId} selectedClient={selectedClient} garments={garments} />, () => {
      // This callback is called after the component has been rendered
      setTimeout(() => {
        printWindow.print()

        // Optional: Close the print window after printing
        // printWindow.close();
      }, 200) // Small delay to ensure styles are applied
    })
  }

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
        <Button variant='contained' onClick={handlePrint} sx={{ marginRight: 2 }}>
          Print Invoice
        </Button>
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
