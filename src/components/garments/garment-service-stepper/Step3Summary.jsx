import React, { useContext } from 'react'

import ReactDOM from 'react-dom'
import { Grid, Button, Typography } from '@mui/material'

import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import OrderSummary from './OrderSummary'
import PrintableInvoice from './PrintableInvoice'

const Step3Summary = ({ steps, handleSummarySubmit, onSubmit, handleBack }) => {
  const { orderId, selectedClient, garments } = useContext(GarmentServiceOrderContext)

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
    printWindow.document.write('</body></html>')
    printWindow.document.close()

    const content = printWindow.document.getElementById('printable-content')

    // Use ReactDOM.render with a callback to ensure content is fully rendered
    ReactDOM.render(
      <PrintableInvoice orderId={orderId} selectedClient={selectedClient} garments={garments} />,
      content,
      () => {
        // This callback is called after the component has been rendered
        setTimeout(() => {
          printWindow.print()

          // Optional: Close the print window after printing
          // printWindow.close();
        }, 200) // Small delay to ensure styles are applied
      }
    )
  }

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
          <Button variant='contained' onClick={handlePrint} sx={{ marginRight: 2 }}>
            Print Invoice
          </Button>
          <Button variant='contained' type='submit'>
            Confirm Order
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default Step3Summary
