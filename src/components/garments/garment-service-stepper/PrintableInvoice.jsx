import React from 'react'

import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const PrintableInvoice = ({ orderId, selectedClient, garments }) => {
  const calculateTotal = () => {
    return garments.reduce((total, garment) => {
      const garmentTotal = garment.services.reduce((sum, service) => {
        return sum + service.qty * service.unit_price
      }, 0)

      return total + garmentTotal
    }, 0)
  }

  return (
    <div className='printable-invoice'>
      <Typography variant='h4' gutterBottom>
        Invoice
      </Typography>
      <Typography variant='body1'>Order ID: {orderId}</Typography>
      <Typography variant='body1'>Date: {new Date().toLocaleDateString()}</Typography>

      <div className='client-info'>
        <Typography variant='h6'>Client Information</Typography>
        <Typography>{selectedClient.full_name}</Typography>
        <Typography>{selectedClient.email}</Typography>
        <Typography>{selectedClient.phone_number}</Typography>
      </div>

      {garments.map((garment, index) => (
        <div key={garment.id} className='garment-section'>
          <Typography variant='h6'>
            Garment {index + 1}: {garment.name}
          </Typography>
          <Typography variant='body2'>Due Date: {new Date(garment.due_date).toLocaleDateString()}</Typography>
          {garment.is_event && (
            <Typography variant='body2'>Event Date: {new Date(garment.event_date).toLocaleDateString()}</Typography>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell align='right'>Quantity</TableCell>
                  <TableCell align='right'>Unit</TableCell>
                  <TableCell align='right'>Unit Price</TableCell>
                  <TableCell align='right'>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {garment.services.map(service => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell align='right'>{service.qty}</TableCell>
                    <TableCell align='right'>{service.unit}</TableCell>
                    <TableCell align='right'>${service.unit_price.toFixed(2)}</TableCell>
                    <TableCell align='right'>${(service.qty * service.unit_price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}

      <Typography variant='h6' className='total'>
        Total Order Amount: ${calculateTotal().toFixed(2)}
      </Typography>
    </div>
  )
}

export default PrintableInvoice
